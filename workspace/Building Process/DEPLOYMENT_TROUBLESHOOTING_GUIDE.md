Perfect! Here's the **concise deployment troubleshooting guide** directly in chat:

---

# ENGAZE RESUME BUILDER - DEPLOYMENT TROUBLESHOOTING GUIDE

## ISSUE #1: RENDER BUILD FAILURE - "Network is Unreachable"

**Problem:** Build failed with `psycopg2.OperationalError: Network is unreachable`

**Root Cause:** Procfile tried to run migrations during build phase when database wasn't accessible.

**Solution:**
- Change `Procfile` from: `release: python manage.py migrate`
- To: `web: python manage.py migrate && gunicorn config.wsgi:application`
- This runs migrations AFTER deployment when database is accessible

**Key Learning:** Separate build-time operations from runtime operations. Migrations need database access, which only exists after deployment.

---

## ISSUE #2: FRONTEND TYPESCRIPT ERRORS (16 errors)

**Problem:** `error TS6133: 'React' is declared but its value is never used` + 15 more errors

**Root Cause:** Strict TypeScript options (`noUnusedLocals: true`) caught unused imports and variables.

**Solution:**
- Remove unused imports: `import React from 'react'` → Just `import { useState } from 'react'`
- Remove unused function parameters
- Modern React (17+) doesn't need React in scope for JSX

**Key Learning:** Fix code instead of disabling TypeScript. Unused variables often indicate bugs. Keeps code clean and bundle size small.

---

## ISSUE #3: FRONTEND-BACKEND API INTEGRATION

**Problem:** Frontend hardcoded to `http://localhost:8000/api/` - didn't work in production.

**Solution:** Create environment-based URL in `api.ts`:
```typescript
function getBaseURL(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) return envUrl.endsWith('/api/') ? envUrl : `${envUrl}/api/`;
  return 'http://localhost:8000/api/';
}
```

In .env:
```
VITE_API_BASE_URL=https://api.kamal.software/api/
```

In Render environment variables, set the same variable.

**Key Learning:** Environment variables are baked into build artifacts. Different deployments need different builds. Always provide fallbacks.

---

## ISSUE #4: CROSS-DEVICE AUTH FAILURES (THE BIG ONE)

**Problem:** Login worked on laptop, failed on phone from different network.

**Root Cause - 4 separate issues:**

### 4A: CORS Too Restrictive
Only allowed one frontend origin. Different networks = different origins = CORS rejection.

**Fix:** In .env:
```
CORS_ALLOWED_ORIGINS=https://api.kamal.software,https://www.kamal.software,https://engaze-resume-builder-1.onrender.com,http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
CORS_ALLOW_LOCALHOST=True
```

### 4B: Unnecessary `withCredentials: true`
JWT stored in localStorage (not cookies), but `withCredentials: true` tells browser to send cookies. Browser rejects CORS with credentials mismatch.

**Fix:** In api.ts:
```typescript
const api = axios.create({
  baseURL: getBaseURL(),
  // withCredentials: false, // Default - no need to specify
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

JWT travels in Authorization header, not cookies. Much simpler and more RESTful.

### 4C: Token Refresh Using Wrong Client
Token refresh used separate axios instance without interceptors.

**Fix:** Use configured api client:
```typescript
// WRONG: const response = await axios.post(...)
// RIGHT:
const response = await api.post('/token/refresh/', { refresh: refreshToken });
```

### 4D: Django CORS Settings Wrong
Had `CORS_ALLOW_CREDENTIALS = True` (for sessions, not JWT)

**Fix:** In settings.py:
```python
CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
CORS_ALLOW_CREDENTIALS = False  # JWT doesn't need credentials
CORS_ALLOW_HEADERS = [
    'accept', 'accept-encoding', 'authorization', 'content-type',
    'dnt', 'origin', 'user-agent', 'x-csrftoken', 'x-requested-with',
]
CSRF_TRUSTED_ORIGINS = [
    'https://api.kamal.software', 'https://www.kamal.software',
    'https://engaze-resume-builder-1.onrender.com',
    'http://localhost:3000', 'http://localhost:5173',
]
```

**Key Learning:** JWT and sessions are different. Each needs specific CORS configuration. Mixing them causes mysterious cross-device failures.

---

## ISSUE #5: VPS BACKEND NOT ACCESSIBLE

**Problem:** `curl http://31.97.111.127:8000/api/` → Connection refused

**Root Cause:** Gunicorn bound to `127.0.0.1:8000` (localhost only). External IPs can't reach localhost.

**Solution:** Use Unix socket + Nginx reverse proxy

In `/etc/systemd/system/gunicorn.service`:
```ini
ExecStart=/path/to/gunicorn \
    --workers 4 \
    --bind unix:/var/run/gunicorn/gunicorn.sock \
    config.wsgi:application
```

In `/etc/nginx/sites-available/kamal.software`:
```nginx
upstream gunicorn {
    server unix:/var/run/gunicorn/gunicorn.sock fail_timeout=0;
}

server {
    listen 80;
    server_name kamal.software api.kamal.software;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kamal.software api.kamal.software;
    
    location / {
        proxy_pass http://gunicorn;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/kamal.software /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Key Learning:** Unix sockets are superior for local IPC - better performance, better security, industry standard (used by PostgreSQL, Redis, etc.)

---

## ISSUE #6: SSL CERTIFICATE & CUSTOM DOMAIN

**Problem - Multiple sub-issues:**

### 6A: Certificate Domain Mismatch
`https://31.97.111.127/api/` doesn't work - certificate issued for domain, not IP address.

**Fix:** Always use domain names in production: `https://api.kamal.software/api/`

### 6B: Render Can't Verify Domain
Render wants domain to point to Render to issue certificate, but you want it on VPS.

**Fix - Temporary DNS switch:**
1. Point domain to Render: `CNAME kamal.software → engaze-resume-builder-1.onrender.com`
2. Wait 10 minutes for Render to issue certificate
3. Change DNS back to VPS: `A api.kamal.software → 31.97.111.127`
4. Certificate persists in Render's records

### 6C: Nginx Duplicate Upstream Error
Multiple site configs defined same `upstream gunicorn`.

**Fix:** Define upstream once, reference in other configs:
```nginx
# Don't redefine upstream in each site config
# Reference existing one
location / {
    proxy_pass http://gunicorn;  # Uses upstream from other file
}
```

### 6D: Certbot Can't Bind Port 80
`certbot --standalone` needs port 80, but Nginx using it.

**Fix:** Use Nginx plugin instead:
```bash
# WRONG: sudo certbot certonly --standalone -d kamal.software
# RIGHT:
sudo certbot --nginx -d kamal.software -d api.kamal.software -d www.kamal.software
```

**Final DNS Setup:**
```
CNAME kamal.software     → engaze-resume-builder-1.onrender.com (Frontend)
CNAME www.kamal.software → engaze-resume-builder-1.onrender.com (Frontend)
A     api.kamal.software → 31.97.111.127 (Backend VPS)
```

---

## FINAL ARCHITECTURE

```
User Browser
    ↓ HTTPS
DNS Resolution
    ├─ kamal.software → Render
    ├─ www.kamal.software → Render
    └─ api.kamal.software → 31.97.111.127 (VPS)
    ↓
    ├─→ Frontend at Render
    │   (React app, serves static files)
    │
    └─→ Backend at VPS
        Nginx (SSL, reverse proxy)
            ↓
        Gunicorn (Django app on Unix socket)
            ↓
        PostgreSQL (Supabase - managed DB)
```

---

## QUICK CHECKLIST

**Before Production:**
- [ ] DEBUG=False
- [ ] SECRET_KEY is random
- [ ] Database credentials in env variables
- [ ] ALLOWED_HOSTS configured
- [ ] CORS origins restricted to your domains
- [ ] API URL points to correct backend
- [ ] SSL certificates installed
- [ ] Test auth on different device/network

---

## KEY TAKEAWAYS

1. **Separate build-time from runtime** - Migrations run after deployment
2. **Environment-driven config** - Everything should work in any environment with proper env vars
3. **Choose JWT or sessions, not both** - Each needs different CORS config
4. **Use reverse proxy in production** - Never expose app servers directly
5. **Test cross-device early** - Different networks expose CORS issues
6. **Domains for production, not IPs** - Certificates are domain-based

That's it! The comprehensive guide condensed to essentials. 🚀