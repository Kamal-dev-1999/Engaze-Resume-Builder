/**
 * Gemini AI Resume Parser
 * Uses Google's Gemini API to intelligently extract and structure resume data
 */

interface ResumeSectionData {
  contact?: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
  };
  summary?: string;
  experience?: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education?: Array<{
    institution: string;
    degree: string;
    field: string;
    graduationDate: string;
  }>;
  skills?: string[];
  projects?: Array<{
    name: string;
    description: string;
    link?: string;
  }>;
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent';

export const parseResumeWithAI = async (resumeText: string): Promise<ResumeSectionData> => {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API key not configured. Please set VITE_GEMINI_API_KEY in environment variables.');
  }

  const prompt = `You are an expert resume parser. I will provide you with resume text, and you need to extract and structure all the information into a JSON format.

Please parse the following resume and extract the information into this exact JSON structure:
{
  "contact": {
    "name": "Full name",
    "email": "email address",
    "phone": "phone number",
    "location": "city, state/country",
    "website": "personal website or portfolio URL",
    "linkedin": "LinkedIn profile URL"
  },
  "summary": "Professional summary or objective (2-3 sentences max)",
  "experience": [
    {
      "company": "Company name",
      "position": "Job title",
      "startDate": "Month Year",
      "endDate": "Month Year or Present",
      "description": "Brief description of responsibilities and achievements"
    }
  ],
  "education": [
    {
      "institution": "University/School name",
      "degree": "Degree type (e.g., Bachelor of Science)",
      "field": "Field of study",
      "graduationDate": "Month Year"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "name": "Project name",
      "description": "Brief description",
      "link": "GitHub or project URL"
    }
  ]
}

Important instructions:
1. Extract ONLY information that is present in the resume
2. Omit fields if the information is not available (use null or empty values)
3. For experience and education, include ALL entries found
4. Format dates consistently as "Month Year" (e.g., "January 2020")
5. Keep descriptions concise but informative
6. For skills, create a comprehensive list from all mentioned skills
7. Return ONLY valid JSON, no additional text or markdown

Resume to parse:
${resumeText}

Return the JSON object only, no markdown formatting, no code blocks.`;

  try {
    console.log('Calling Gemini API to parse resume...');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3, // Lower temperature for more structured output
          maxOutputTokens: 4096,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);
    console.log('Candidates:', data.candidates);
    console.log('First candidate:', data.candidates?.[0]);
    console.log('Content:', data.candidates?.[0]?.content);
    console.log('Parts:', data.candidates?.[0]?.content?.parts);
    console.log('First part:', data.candidates?.[0]?.content?.parts?.[0]);

    // Extract the generated content
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Generated text extracted:', generatedText);
    
    if (!generatedText) {
      console.error('Failed to extract text. Full response structure:', JSON.stringify(data, null, 2));
      throw new Error('No content generated from Gemini API');
    }

    console.log('Generated text from Gemini:', generatedText);

    // Clean up the response - remove markdown code blocks if present
    let jsonText = generatedText.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse the JSON response
    const parsedData: ResumeSectionData = JSON.parse(jsonText);
    
    console.log('Successfully parsed resume with AI:', parsedData);
    return parsedData;

  } catch (error) {
    console.error('Error parsing resume with AI:', error);
    if (error instanceof SyntaxError) {
      throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
    }
    throw error;
  }
};

export const validateResumeData = (data: ResumeSectionData): boolean => {
  // Basic validation - at least one contact field or experience should exist
  const hasContact = data.contact && Object.values(data.contact).some(v => !!v);
  const hasExperience = data.experience && data.experience.length > 0;
  const hasEducation = data.education && data.education.length > 0;
  const hasSkills = data.skills && data.skills.length > 0;

  return !!(hasContact || hasExperience || hasEducation || hasSkills);
};
