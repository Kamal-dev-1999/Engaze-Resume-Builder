# Render Deployment - Step-by-Step Fix Guide

**Status:** Ready to fix and redeploy

---

## 📋 Step 1: Update Build Command in Render Dashboard

1. Go to **Render Dashboard** → Your Service: `Engaze-Resume-Builder`
2. Click **Settings** tab
3. Scroll down to **Build Command** field
4. **Replace entire command with:**
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput
   ```
5. Click **Save**

✅ This removes the problematic `migrate` command that causes build failure

---

## 📋 Step 2: Verify Environment Variables

In Render Dashboard → **Settings** → **Environment**

Make sure these variables are set correctly:

```
DEBUG=False
SECRET_KEY=%c-(x1e%$(@m0o5vv*e8i6lm!-x3*@qe&)(i)7(m3f9l7g!o@k
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com,www.yourdomain.com,*.render.com

DB_ENGINE=django.db.backends.postgresql
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=Ajeet1973@1395
DB_HOST=db.vpqqrezmdrtmcxkvvxqm.supabase.co
DB_PORT=5432

CORS_ALLOW_LOCALHOST=False
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173,https://yourdomain.com,https://www.yourdomain.com,https://*.render.com

ACCESS_TOKEN_LIFETIME_DAYS=1
REFRESH_TOKEN_LIFETIME_DAYS=7

STATIC_URL=/static/
STATIC_ROOT=staticfiles

ENVIRONMENT=production

SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=3600
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

✅ All 23 environment variables properly set

---

## 📋 Step 3: Redeploy

1. Go to **Render Dashboard** → Your Service
2. Click **Manual Deploy** → **Deploy latest commit**
3. Wait for build to complete (should take 2-3 minutes)
4. Watch the logs - should see:
   ```
   ✅ Installing Python dependencies
   ✅ Running collectstatic
   ✅ Build succeeded
   ✅ Service running at https://[your-service-name].render.com
   ```

---

## 📋 Step 4: Run Migrations (After Build Succeeds)

**IMPORTANT:** Only do this AFTER your app is live!

### **Using Render Shell (Best Method):**

1. Go to **Render Dashboard** → Your Service
2. Click **Shell** tab
3. You'll see a terminal prompt: `$ `
4. Run this command:
   ```bash
   python /opt/render/project/src/workspace/backend/manage.py migrate
   ```
5. Wait for output:
   ```
   Operations to perform:
     Apply all migrations: admin, api, auth, contenttypes, sessions
   Running migrations:
     Applying api.0001_initial... OK
     Applying admin.0001_initial... OK
     ...
   ```

✅ Migrations complete!

---

## 📋 Step 5: Create Django Admin Superuser

In the same **Render Shell**, run:

```bash
python /opt/render/project/src/workspace/backend/manage.py createsuperuser
```

**Follow the prompts:**
```
Username: admin
Email: your-email@example.com
Password: (enter secure password)
Password (again): (confirm)
```

✅ Superuser created!

---

## 📋 Step 6: Test Your API

1. Visit: `https://[your-render-url]/admin/`
   - Login with superuser credentials
   - Should see Django admin dashboard

2. Visit: `https://[your-render-url]/api/`
   - Should see REST API interface
   - Endpoints available but require authentication

3. Test registration: `POST https://[your-render-url]/api/auth/register/`
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "securepass123"
   }
   ```

✅ API working!

---

## 🔍 Troubleshooting

### **If build still fails:**

1. Check build logs carefully
2. Make sure **Root Directory** is set to `backend`
3. Verify all environment variables have no typos
4. Check Supabase is still running and credentials are correct

### **If migrations fail:**

1. Error like `Table "django_migrations" does not exist`?
   - Run: `python manage.py migrate --run-syncdb`

2. Connection timeout again?
   - Check Supabase is accessible
   - Run locally first to verify: `python manage.py migrate`

### **If API returns 404:**

1. Clear Render cache: **Settings** → **Purge Cache**
2. Restart service: **Manual Deploy** → **Deploy latest commit**

---

## 📊 Expected Timeline

| Phase | Duration | What Happens |
|-------|----------|--------------|
| Build | 1-2 min | Dependencies installed, static files collected |
| Deploy | 30 sec | New version goes live |
| Migrations | 1-2 min | Database schema created (run in Shell) |
| Ready | ✅ | API is live and accessible |

---

## 🎉 Success Checklist

- [ ] Build command updated (no more `migrate`)
- [ ] Environment variables verified (23 total)
- [ ] Redeploy completed successfully
- [ ] Render service URL received (e.g., `xxx.render.com`)
- [ ] Migrations run via Render Shell
- [ ] Superuser created
- [ ] Admin panel accessible
- [ ] API endpoints responding
- [ ] Frontend connected to new backend URL

---

## 🚀 Update Frontend API URL

Once deployment succeeds, update your frontend to use the new Render URL:

**In `frontend/src/services/api.ts`:**
```typescript
const API_BASE_URL = 'https://[your-render-url].render.com/api';
```

Then redeploy frontend to point to your new backend.

---

## 💾 Keep for Reference

Your Render Service URL will be something like:
```
https://engaze-resume-builder-xxxxx.render.com
```

Bookmark this - you'll need it!

---

**Next Action:** Update build command in Render and hit "Deploy Latest Commit"
