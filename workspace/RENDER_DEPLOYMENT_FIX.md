# Render Deployment Error - Database Connection Fix

**Error:** `psycopg2.OperationalError: Network is unreachable`  
**Cause:** Render build environment cannot reach Supabase during `python manage.py migrate`

---

## 🔴 Problem Analysis

The error occurs during the build command phase:
```
pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput
```

**Why it fails:**
1. Render's build environment is isolated and may have network restrictions
2. Supabase connection check happens during `python manage.py migrate`
3. The build fails before your app even starts

---

## ✅ Solution: Update Build Command

Replace your current build command in Render with this one:

### **New Build Command:**
```bash
pip install -r requirements.txt && python manage.py collectstatic --noinput
```

**What changed:**
- ❌ Removed: `python manage.py migrate` (causes build failure)
- ✅ Kept: `pip install -r requirements.txt` (installs dependencies)
- ✅ Kept: `python manage.py collectstatic --noinput` (collects static files)

---

## 📋 Updated Render Deployment Steps

### **In Render Dashboard:**

1. **Root Directory**: `backend`

2. **Build Command** (UPDATED):
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput
   ```

3. **Start Command** (Keep same):
   ```bash
   gunicorn config.wsgi --log-file -
   ```

4. **Environment Variables** (Make sure all are set):
   ```
   DEBUG=False
   SECRET_KEY=<your-secure-key>
   ALLOWED_HOSTS=yourdomain.render.com
   DB_ENGINE=django.db.backends.postgresql
   DB_NAME=postgres
   DB_USER=postgres
   DB_PASSWORD=Ajeet1973@1395
   DB_HOST=db.vpqqrezmdrtmcxkvvxqm.supabase.co
   DB_PORT=5432
   CORS_ALLOW_LOCALHOST=False
   CORS_ALLOWED_ORIGINS=https://yourdomain.render.com
   ACCESS_TOKEN_LIFETIME_DAYS=1
   REFRESH_TOKEN_LIFETIME_DAYS=7
   STATIC_URL=/static/
   STATIC_ROOT=staticfiles
   ENVIRONMENT=production
   ```

---

## 🚀 After First Deployment

Once your app is running, you need to run migrations manually:

### **Option 1: Using Render Shell (Recommended)**

1. Go to your Render service dashboard
2. Click **"Shell"** tab at the top
3. Run this command in the shell:
   ```bash
   python /opt/render/project/src/workspace/backend/manage.py migrate
   ```

4. Create a superuser:
   ```bash
   python /opt/render/project/src/workspace/backend/manage.py createsuperuser
   ```

### **Option 2: Using Django Shell**

```bash
python manage.py dbshell
# Then run your migrations programmatically
```

### **Option 3: Add Manual Deployment Step**

Create a `scripts/pre_deploy.sh` file:
```bash
#!/bin/bash
cd workspace/backend
python manage.py migrate
python manage.py collectstatic --noinput
```

Then add this to Render as a "one-off command" or use Render's background jobs feature.

---

## 🔧 Alternative: Update Django Settings to Handle Build Failures

Modify `backend/config/settings.py` to skip migrations during build:

```python
# Add this near the top of settings.py after imports
import sys

# Check if we're in a migration/build phase
IS_BUILD_PHASE = any(arg.startswith('manage.py') for arg in sys.argv)

# If building, use SQLite temporarily to allow build to succeed
if IS_BUILD_PHASE and 'migrate' in sys.argv:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': ':memory:',  # Use in-memory SQLite for build
        }
    }
else:
    # Use normal PostgreSQL config
    DATABASES = {
        'default': {
            'ENGINE': os.environ.get('DB_ENGINE', 'django.db.backends.sqlite3'),
            'NAME': os.environ.get('DB_NAME', str(BASE_DIR / 'db.sqlite3')),
            'USER': os.environ.get('DB_USER', ''),
            'PASSWORD': os.environ.get('DB_PASSWORD', ''),
            'HOST': os.environ.get('DB_HOST', ''),
            'PORT': os.environ.get('DB_PORT', ''),
        }
    }
```

---

## 📊 Recommended Approach

**Best Practice:** Keep migrations separate from build

1. **Build Command** (collect static files only):
   ```bash
   pip install -r requirements.txt && python manage.py collectstatic --noinput
   ```

2. **Post-Deploy Steps:**
   - Use Render Shell to run: `python manage.py migrate`
   - Create superuser: `python manage.py createsuperuser`

3. **For Future Deployments:**
   - Render will automatically run your Start Command
   - No migration errors since app is already initialized

---

## 🔍 Verify Supabase Connection

Before redeploying, verify your Supabase credentials:

1. Go to **Supabase Dashboard** → Your Project
2. Click **Settings** → **Database**
3. Verify these details match your `.env`:
   - **Host**: `db.vpqqrezmdrtmcxkvvxqm.supabase.co` ✓
   - **Port**: `5432` ✓
   - **Database**: `postgres` ✓
   - **User**: `postgres` ✓

4. Check **Network** → **Firewall** rules allow Render's IP

---

## 🛠️ Testing Locally

Test your build command locally first:

```bash
cd workspace/backend

# Clean setup
rm -r venv
python -m venv venv

# Activate venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Test static file collection (no DB needed)
python manage.py collectstatic --noinput

# Should succeed without database connection!
```

---

## 📝 Complete Deployment Checklist

- [ ] Update build command in Render (remove `migrate`)
- [ ] Verify all 15 environment variables are set
- [ ] Test connection string format is correct
- [ ] Redeploy to Render
- [ ] Wait for build to complete (should succeed now)
- [ ] Use Render Shell to run migrations
- [ ] Create superuser via Render Shell
- [ ] Test API endpoints
- [ ] Access admin panel

---

## 💡 Prevention for Future Deployments

1. **Don't include database-dependent commands in build**
2. **Use Render Shell for one-off tasks**
3. **Keep migrations and static collection separate**
4. **Monitor build logs for connection errors**

---

## ✅ Expected Output After Fix

Your build should now show:
```
✅ Dependencies installed successfully
✅ Static files collected successfully
✅ Build completed
✅ Service running at https://yourdomain.render.com
```

Then manually in Render Shell:
```
$ python manage.py migrate
Operations to perform:
  Apply all migrations: admin, api, auth, contenttypes, sessions
Running migrations:
  Applying api.0001_initial... OK
✅ Migrations completed
```

---

## 🆘 If You Still Get Errors

1. **Check Supabase is running:**
   - Visit https://supabase.com/dashboard
   - Verify your project is active

2. **Check credentials are correct:**
   - Copy-paste from Supabase dashboard (not manual entry)
   - Verify no extra spaces

3. **Check Render environment variables:**
   - Make sure they match exactly
   - No typos in variable names

4. **Test connection locally first:**
   ```bash
   python manage.py shell
   >>> from django.db import connection
   >>> connection.ensure_connection()  # Should succeed
   ```

---

**Status:** Ready to deploy with updated build command!
