# Template Debug Logger Guide

## Overview

A comprehensive debugging utility has been added to all resume templates to help identify data fetching issues, missing fields, and hardcoded content. The debug logger automatically logs detailed information to the browser console when templates are rendered.

## Features

### 1. **Template Data Analysis**
- Shows total sections loaded
- Lists all sections with their types, IDs, and order values
- Displays content keys and preview of data
- Identifies missing or empty sections

### 2. **Section Sorting Verification**
- Compares original section order with sorted section order
- Confirms if reordering was applied
- Helps verify the `order` property is being respected

### 3. **Hardcoded Content Detection**
- Automatically scans section content for common hardcoded patterns:
  - "Additional Information" (generic placeholder)
  - "View Project" (generic link text)
  - "Add your" / "Enter your" (incomplete placeholders)
  - "Lorem ipsum" (test data)
  - "TBD", "N/A" (non-specific values)
  - Array brackets `[...]` (unrendered data)

### 4. **Missing Data Detection**
For each section type, the logger checks for required fields:

#### Summary Section
- ❌ Missing `text` field

#### Experience Section
- ❌ Missing `items` array
- ❌ Missing `title` in any experience item
- ❌ Missing `company` in any experience item

#### Education Section
- ❌ Missing `items` array
- ❌ Missing `degree` in any education item
- ❌ Missing `institution` in any education item

#### Skills Section
- ❌ Missing `items` array

#### Projects Section
- ❌ Missing `name` or `title` in any project item

#### Custom Section
- ❌ Missing `title`, `content`, or `text`

#### Contact Section
- ❌ Missing both `name` and `email`

## How to Use

### Enable Debug Mode

In each template file (ClassicTemplate.tsx, ExecutiveTemplate.tsx, etc.), find this line:

```typescript
const DEBUG_MODE = true;  // Change to false to disable debugging
```

Set `DEBUG_MODE = true` to enable console logging (default is already enabled).

### View Debug Output

1. **Open Developer Tools** in your browser (F12 or Right-click → Inspect)
2. **Go to the Console tab**
3. **Load or edit a resume** to trigger template rendering
4. **Look for colored console output** with the template name and debug information

### Console Output Structure

Example output in browser console:

```
🎯 ClassicTemplate Loaded
📋 ClassicTemplate Debug Info
├─ Total Sections: 5
├─ Sorted Sections:
│  ├─ ✅ SUMMARY (ID: 1, Order: 0)
│  ├─ ✅ EXPERIENCE (ID: 2, Order: 1)
│  ├─ ❌ EDUCATION (ID: 3, Order: 2)
│  │  ⚠️  Issues Found:
│  │     - Missing items array
│  └─ ✅ SKILLS (ID: 4, Order: 3)
├─ Missing Data Summary:
│  • Education ID 3: Missing items array
│  • Education ID 3: Missing degree
└─ Full Debug Object: {...}
```

## Debug Logger Functions

### `logTemplateData(templateName, sections, sortedSections)`

Main function that logs all template information.

**Parameters:**
- `templateName` (string): Name of the template (e.g., "ClassicTemplate")
- `sections` (Section[]): Original unsorted sections array
- `sortedSections` (Section[]): Sections sorted by order property

**Returns:** `TemplateDebugInfo` object with complete debug data

### `analyzeSection(section, _index)`

Analyzes a single section for data issues.

**Parameters:**
- `section` (Section): The section object to analyze
- `_index` (number): Index in the array (for reference)

**Returns:** `SectionDebugInfo` object with analysis results

### `detectHardcodedContent(sectionType, content)`

Scans section content for hardcoded placeholder strings.

**Parameters:**
- `sectionType` (string): Type of section being checked
- `content` (any): The content object to scan

**Returns:** Array of found hardcoded strings

### `logSectionSorting(originalSections, sortedSections)`

Displays section ordering in a formatted table.

**Parameters:**
- `originalSections` (Section[]): Unsorted sections
- `sortedSections` (Section[]): Sorted sections

### `exportDebugData(debugInfo)`

Exports debug information to a JSON file for detailed analysis.

**Parameters:**
- `debugInfo` (TemplateDebugInfo): Debug information object returned from `logTemplateData`

## Common Issues and Solutions

### Issue: Section Shows "❌" Status

**Meaning:** The section has missing required data

**Solution:**
1. Check the specific issues listed in the console
2. Go to EditorPage and edit that section
3. Fill in the missing fields
4. Save and check the console again

### Issue: Hardcoded Content Detected

**Meaning:** The section might contain placeholder text instead of real data

**Solution:**
1. Note which hardcoded patterns were found
2. Edit the section in the editor
3. Replace placeholder text with actual content
4. Save and verify in console

### Issue: Sections Not Reordering

**Meaning:** Even though you changed the order, the section order in output hasn't changed

**Solution:**
1. Check the "Section Sorting" output in console
2. If "Sections were reordered" is NOT shown, verify:
   - You're using a template that supports reordering (all 7 templates now do)
   - The `order` values are different between sections
   - Clear browser cache and reload

### Issue: No Debug Output in Console

**Meaning:** Debug mode might be disabled or template didn't reload

**Solution:**
1. Ensure `DEBUG_MODE = true` in the template file
2. Check that you're looking at the correct console tab
3. Reload the page with Ctrl+Shift+R (hard refresh)
4. Edit a section to trigger template re-render

## Data Structure Reference

### Section Interface

```typescript
interface Section {
  id: number;          // Unique identifier
  type: string;        // 'summary', 'experience', 'education', 'skills', 'projects', 'custom', 'contact'
  content: any;        // Data varies by type
  order: number;       // Determines rendering order (0, 1, 2, etc.)
}
```

### Expected Content Structures

#### Summary Content
```typescript
{
  text: string;           // Professional summary text
  formatting?: any;       // Optional formatting styles
}
```

#### Experience Content
```typescript
{
  items?: [
    {
      title: string;      // Job title
      company: string;    // Company name
      location?: string;  // Location
      start_date: string; // Start date
      end_date: string;   // End date
      description: string; // Job description
    }
  ];
  formatting?: any;
}
```

#### Education Content
```typescript
{
  items?: [
    {
      degree: string;         // Degree type
      institution: string;    // School/University name
      location?: string;      // Location
      start_date?: string;    // Start date
      end_date?: string;      // End date
      fieldOfStudy?: string;  // Field of study
    }
  ];
  formatting?: any;
}
```

#### Skills Content
```typescript
{
  items: [
    {
      id: string;           // Unique skill ID
      name: string;         // Skill name
      category: string;     // Skill category
      proficiency?: string; // Proficiency level
    }
  ];
  formatting?: any;
}
```

#### Projects Content
```typescript
{
  items?: [
    {
      name?: string;      // Project name
      title?: string;     // Alternative to name
      description: string; // Project description
      link?: string;      // Project URL
      linkText?: string;  // Link display text
    }
  ];
  formatting?: any;
}
```

#### Custom Content
```typescript
{
  title: string;        // Section title
  content?: string;     // Section content
  text?: string;        // Alternative to content
  formatting?: any;
}
```

#### Contact Content
```typescript
{
  name?: string;        // Full name
  email?: string;       // Email address
  phone?: string;       // Phone number
  address?: string;     // Physical address
  location?: string;    // City/location
  linkedin?: string;    // LinkedIn URL
  website?: string;     // Website URL
  github?: string;      // GitHub URL
}
```

## Tips for Debugging

1. **Use Browser DevTools Filters:** In console, you can filter logs by template name
2. **Check Network Tab:** If data isn't loading, check if API calls are successful
3. **Compare Before/After:** Edit a section and check console changes
4. **Export Debug Data:** Use `exportDebugData()` for detailed analysis
5. **Disable DEBUG_MODE in Production:** Set `DEBUG_MODE = false` before deployment to reduce console noise

## Troubleshooting Checklist

- [ ] Is `DEBUG_MODE` set to `true` in the template?
- [ ] Are you looking at the browser console (F12)?
- [ ] Did you reload the page after making changes?
- [ ] Do all sections show ✅ status?
- [ ] Are sections rendering in the correct order?
- [ ] Are there any hardcoded content warnings?
- [ ] Do the content keys match expected fields for each section type?
- [ ] Is the API returning data successfully (check Network tab)?

## Advanced Usage

### Manual Debug Calls in Components

You can import and use debug functions in other components:

```typescript
import { logTemplateData, detectHardcodedContent } from '../../utils/debugLogger';

// In your component
logTemplateData('CustomTemplate', sections, sortedSections);

// Check specific section for hardcoded content
detectHardcodedContent('experience', experienceSection.content);
```

### Creating Custom Analysis

The debug logger functions are exportable and can be used for custom analysis:

```typescript
import { analyzeSection } from '../../utils/debugLogger';

const analysis = analyzeSection(section, 0);
if (analysis.issues.length > 0) {
  // Handle issues
}
```

## Performance Note

Debug logging adds minimal performance overhead. However, for production builds, it's recommended to disable `DEBUG_MODE` to reduce console output and improve browser performance.
