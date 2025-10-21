## Frontend Data Filtering Fix - DynamicTemplate

### Problem
The DynamicTemplate was displaying **placeholder data** (old hardcoded defaults) from the backend database because:
1. Earlier sections were created with placeholder content ("Job Title", "Company Name", "Skill 1", etc.)
2. When new data was added, it got mixed with the old placeholder data
3. The template was rendering ALL items without filtering placeholders

### Root Cause
The data in the backend had mixed structure:
```json
{
  "items": [
    { "title": "Project Name", "description": "Project description" },  // ← OLD PLACEHOLDER
    // ... new items from user input mixed in
  ]
}
```

### Solution Applied
Added **placeholder filtering** to DynamicTemplate for all section types:

#### 1. **Projects Section** (Lines 302-340)
- Filter out projects where `title === 'Project Name' && description === 'Project description'`
- Show "Add your projects" message if all items are filtered out

#### 2. **Skills Section** (Lines 253-287)
- Filter out skills that are in the placeholder list: `['Skill 1', 'Skill 2', 'Skill 3']`
- Show "Add your skills" message if no real skills found

#### 3. **Experience Section** (Lines 165-205)
- Filter out items where `title === 'Job Title' && company === 'Company Name'`
- Show "Add your work experience" if all items are placeholders

#### 4. **Education Section** (Lines 207-240)
- Filter out items where `degree === 'Degree Name' && institution === 'Institution Name'`
- Show "Add your education" if all items are placeholders

### Filter Pattern Used
```typescript
// Generic filter pattern applied to all sections
const filteredItems = originalItems.filter((item: any) => {
  const isPlaceholder = /* check if item matches known placeholder values */;
  return !isPlaceholder;  // Return only real items
});

return filteredItems.length > 0 ? (
  renderRealItems()
) : (
  <p>Add your [section type]</p>
);
```

### Benefits
✅ Users no longer see old placeholder data mixed with their actual data
✅ Clean display showing only user-entered content
✅ Fallback messages guide users when sections are empty
✅ No need to manually clear old data from database

### Files Modified
- `frontend/src/components/templates/DynamicTemplate.tsx`

### Frontend API Updates (Previously Applied)
Also updated `frontend/src/services/api.ts` to send proper empty content structures when creating new sections:
- Changed `addSection` to send empty `content` object based on section type
- Removed hardcoded placeholder defaults from the mock section fallback
- All new sections now start truly empty instead of with placeholder data
