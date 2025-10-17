# ✅ Complete Setup Guide - Resume Import with Gemini AI

## Quick Setup (3 Steps)

### Step 1: Check Environment Files
Your frontend now has two environment files:

**`.env.example`** (Template for all developers)
- Contains API key placeholder
- Shows all available variables
- Should be committed to git

**`.env.local`** (Your personal configuration)
- Already created with the Gemini API key
- Local machine only (not in git)
- Has the actual API key configured

### Step 2: Verify The Files

#### Check `.env.local` exists:
```bash
cd frontend
ls -la | grep .env
```

You should see:
```
.env.example
.env.local
```

#### Check `.env.local` has the key:
```bash
cat .env.local
```

Should output:
```
VITE_GEMINI_API_KEY=AIzaSyCryOwktO78IPFMkfcK7iS_xaI_LgwFdsg
VITE_API_BASE_URL=http://localhost:8000/api/
```

### Step 3: Restart Development Server

**Kill the current dev server (if running):**
```bash
# Press Ctrl+C in the terminal running npm run dev
```

**Restart the server:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

---

## Testing the Setup

### 1. Navigate to Resume Editor
- Login to your account
- Go to Dashboard → Create Resume or Open existing resume
- Click "Open Editor"

### 2. Click "Import Resume" Button
Located in the top toolbar next to "Back to Dashboard"

### 3. Upload a Sample Resume
- Drag and drop a resume file, OR
- Click to select from your computer
- Supported formats: TXT, PDF, DOCX

### 4. Wait for AI Processing
You'll see: "Parsing your resume with AI..."

### 5. Review Extracted Data
The modal will show:
- ✅ Contact Information
- ✅ Professional Summary
- ✅ Work Experience (all entries)
- ✅ Education (all entries)
- ✅ Skills (all skills)
- ✅ Projects (if any)

### 6. Click "Import to Resume"
All data will automatically populate your resume template!

---

## File Structure

```
frontend/
├── .env.example          ← Template (commit to git)
├── .env.local           ← Your keys (DO NOT commit)
├── .gitignore           ← Should include .env.local
├── src/
│   ├── services/
│   │   ├── geminiParser.ts        ← AI parsing service ✨
│   │   └── api.ts                 ← API calls
│   ├── components/
│   │   └── editor/
│   │       └── ResumeImportModal.tsx  ← Import UI (updated)
│   └── redux/
│       └── slices/
│           └── editorSlice.ts    ← Redux logic (updated)
```

---

## Configuration Explanation

### VITE_GEMINI_API_KEY
```
This is your Google Gemini API key
- Used to authenticate with Google's AI service
- Allows parsing resumes with AI
- Free tier: 15 requests/minute
```

**Where to find/create:**
1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key
5. Paste it in `.env.local`

### VITE_API_BASE_URL
```
Your backend Django API endpoint
- Used for all resume CRUD operations
- Default: http://localhost:8000/api/
```

---

## How the Import Works

### Flow Diagram
```
┌─────────────────────────┐
│ User Uploads Resume File│
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ Frontend reads file text│
└────────────┬────────────┘
             ↓
┌─────────────────────────────────────────┐
│ Sends text to Gemini API with prompt    │
│ (Using VITE_GEMINI_API_KEY)            │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────┐
│ Gemini AI parses resume │
│ Returns structured JSON │
└────────────┬────────────┘
             ↓
┌─────────────────────────┐
│ System validates data   │
└────────────┬────────────┘
             ↓
┌─────────────────────────────────────────┐
│ User sees preview of extracted data     │
│ (Contact, Experience, Education, etc)  │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────┐
│ User clicks Import      │
└────────────┬────────────┘
             ↓
┌─────────────────────────────────────────┐
│ Redux importResumeData action maps data │
│ to correct resume section structure     │
└────────────┬────────────────────────────┘
             ↓
┌─────────────────────────────────────────┐
│ Resume template automatically updates   │
│ showing all imported information        │
└─────────────────────────────────────────┘
```

---

## Troubleshooting

### Problem: "API key not configured"
**Solution:**
1. Check `.env.local` exists in `frontend/` directory
2. Verify it contains: `VITE_GEMINI_API_KEY=AIzaSyCryOwktO78IPFMkfcK7iS_xaI_LgwFdsg`
3. Restart dev server (`npm run dev`)
4. Clear browser cache (Ctrl+Shift+Delete)

### Problem: "Request failed" or network error
**Solution:**
1. Check internet connection
2. Verify Gemini API key is valid at: https://aistudio.google.com/app/apikey
3. Check browser console (F12) for detailed error message
4. Try with a simple text resume file first

### Problem: AI parsing fails, falls back to basic parser
**Solution:**
- This is normal and expected sometimes
- System automatically uses basic parser as fallback
- Resume will still import successfully
- Try reformatting your resume and try again

### Problem: Resume imports but data is incomplete
**Solution:**
1. Check if your resume has clear section headers (Experience, Education, Skills, etc.)
2. Ensure date formats are consistent
3. Check browser console (F12) for parsing logs
4. You can manually edit sections after import

### Problem: Nothing happens when I click Import
**Solution:**
1. Check browser console (F12 → Console tab)
2. Look for error messages
3. Verify backend API is running: http://localhost:8000/api/
4. Check Redux DevTools to see state changes

---

## Environment File Checklist

### .env.local Setup
- [ ] File exists: `frontend/.env.local`
- [ ] Contains Gemini API key
- [ ] Contains backend URL
- [ ] Not committed to git (in .gitignore)
- [ ] Dev server restarted after creation

### Before Testing Import
- [ ] Frontend dev server running on http://localhost:5173
- [ ] Backend API running on http://localhost:8000
- [ ] Logged in to Engaze application
- [ ] Have a sample resume file ready

### During Import Test
- [ ] File uploads without error
- [ ] "Parsing with AI..." message appears
- [ ] Preview shows extracted data
- [ ] Can see all sections populated
- [ ] Import button is clickable

### After Import
- [ ] Resume template updates
- [ ] Can see imported contact info
- [ ] Experience section shows jobs
- [ ] Education section shows degrees
- [ ] Skills appear in skills section
- [ ] Can undo with Ctrl+Z if needed

---

## Next Steps

1. **Verify setup is working:**
   ```bash
   npm run dev
   ```

2. **Test the import feature:**
   - Open a resume in the editor
   - Click "Import Resume"
   - Upload a test resume
   - Confirm data appears

3. **Handle errors:**
   - Check browser console for any issues
   - Read error messages carefully
   - Refer to troubleshooting section above

4. **Share with team:**
   - Share `.env.example` (not `.env.local`)
   - Tell team to copy `.env.example` to `.env.local`
   - Team adds their own API key if different

---

## Git Configuration

Make sure `.env.local` is ignored:

**Check `.frontend/.gitignore`:**
```bash
cat .gitignore
```

Should contain:
```
.env
.env.local
.env.*.local
```

If not, add it:
```bash
echo ".env.local" >> .gitignore
```

---

## Support Resources

**Gemini API Documentation:**
- https://aistudio.google.com/app/apikey
- https://ai.google.dev/docs

**Vite Environment Variables:**
- https://vitejs.dev/guide/env-and-modes.html

**Frontend Code:**
- Resume Import Modal: `src/components/editor/ResumeImportModal.tsx`
- Gemini Service: `src/services/geminiParser.ts`
- Redux Logic: `src/redux/slices/editorSlice.ts`

---

That's it! Your AI-powered resume import is ready to use! 🚀
