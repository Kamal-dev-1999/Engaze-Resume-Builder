# Resume AI Parser Integration Guide

## Overview
The Engaze resume import system now uses Google's Gemini AI to intelligently parse and structure resume data. The AI extracts and organizes information into a properly formatted JSON structure that automatically populates your resume template.

## Setup Instructions

### 1. Get a Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click "Create API Key" 
3. Select your Google Cloud project (or create a new one)
4. Copy the generated API key

### 2. Configure Your Frontend
1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Add your Gemini API key to `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_api_key_here
   VITE_API_BASE_URL=http://localhost:8000/api/
   ```

### 3. Restart Your Frontend Development Server
```bash
npm run dev
```

## How It Works

### Step 1: User Imports Resume
- User navigates to Resume Editor
- Clicks "Import Resume" button
- Selects a resume file (TXT, PDF, or DOCX)

### Step 2: AI Parsing
- Frontend reads the file content
- Sends content to Gemini AI API
- AI extracts and structures all information
- If AI parsing fails, system falls back to basic parser

### Step 3: Preview & Confirm
- User sees extracted data preview:
  - Contact information
  - Professional summary
  - Work experience
  - Education
  - Skills
  - Projects
- User reviews the extracted data

### Step 4: Import to Resume
- User clicks "Import to Resume"
- Redux action maps AI-parsed data to resume sections
- All data automatically populates the template
- Changes marked as unsaved

## Data Structure

The AI parses resume data into the following structure:

```json
{
  "contact": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedin": "string"
  },
  "summary": "string (professional summary)",
  "experience": [
    {
      "company": "string",
      "position": "string",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "string"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "field": "string",
      "graduationDate": "Month Year"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "name": "string",
      "description": "string",
      "link": "string (optional)"
    }
  ]
}
```

## Features

✅ **AI-Powered Parsing**
- Intelligent extraction of resume information
- Automatic categorization into sections
- Handles various resume formats and styles

✅ **Fallback Parser**
- If AI parsing fails, basic parser automatically kicks in
- Ensures users can always import resumes

✅ **Data Validation**
- Validates parsed data before preview
- Ensures at least one data type (contact, experience, education, or skills)

✅ **Preview Before Import**
- Shows all extracted information
- Users can see exactly what will be imported
- Color-coded sections for easy review

✅ **Automatic Undo/Redo**
- Import is added to undo/redo history
- Users can undo with Ctrl+Z if needed

## Troubleshooting

### "API key not configured" Error
**Solution**: Make sure `VITE_GEMINI_API_KEY` is set in `.env.local`

### AI Parsing Fails / Returns Incomplete Data
**Solution**: System automatically falls back to basic parser. The resume will still be imported.

### Imported Data Looks Wrong
**Suggestions**:
1. Ensure resume format is clear and well-structured
2. Try exporting your resume as PDF or plain text
3. Check if all sections are properly labeled (e.g., "Experience", "Education", "Skills")

### API Rate Limiting
**Note**: Free Gemini API has rate limits. For production use, consider:
- Implementing request queuing
- Caching parsed results
- Upgrading to paid API tier

## API Costs

- **Gemini 1.5 Flash**: Very affordable, optimized for structured data extraction
- **Free tier**: 15 requests per minute, 1.5 million tokens per day
- **Paid tier**: More generous limits, typically $0.075 per 1M input tokens

## Environment Variables

```bash
# Required
VITE_GEMINI_API_KEY=sk-...     # Your Gemini API key from Google AI Studio

# Optional
VITE_API_BASE_URL=http://localhost:8000/api/  # Backend API endpoint
```

## Files Modified/Created

- `src/services/geminiParser.ts` - AI parsing service
- `src/components/editor/ResumeImportModal.tsx` - Updated to use AI parser
- `.env.example` - Configuration template

## Next Steps

After importing a resume:
1. Review all extracted data
2. Edit any sections as needed
3. Add missing information manually
4. Save and download your resume
5. Share publicly if desired

---

For issues or questions, check the browser console for detailed error logs when importing resumes.
