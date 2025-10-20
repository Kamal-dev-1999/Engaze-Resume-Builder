# Multi-Item Sections Implementation Guide

## Overview
This implementation allows users to add **multiple entries** for Experience, Education, and Projects sections, instead of being limited to a single entry per section.

## Key Features

### 1. **Add Multiple Entries**
- Each section (Experience, Education, Projects) now has an "+ Add Experience/Education/Project" button
- Users can add as many entries as needed
- Each entry is displayed in a collapsible card format

### 2. **Collapsible Item Format**
- Each item appears as a collapsed header showing the main title/company
- Click the header to expand and edit all fields
- Click the trash icon to delete an item

### 3. **Form Structure Changes**
Data is now saved as an array in the `items` field:
```json
{
  "items": [
    {
      "title": "Software Engineer",
      "company": "Tech Corp",
      "location": "San Francisco",
      "start_date": "2023-01-15",
      "end_date": "2024-10-20",
      "description": "..."
    },
    {
      "title": "Junior Developer",
      "company": "Startup Inc",
      "location": "Remote",
      "start_date": "2022-06-01",
      "end_date": "2023-01-14",
      "description": "..."
    }
  ]
}
```

## Section Types & Fields

### Experience Items
- Job Title *
- Company *
- Location
- Start Date
- End Date
- Description

### Education Items
- Degree / Certificate *
- Institution *
- Location
- Start Date
- End Date
- Field of Study
- GPA

### Projects Items
- Project Title *
- Description *
- Project URL
- Technologies
- Start Date
- End Date

## Code Changes

### 1. **SectionEditor.tsx**
**Major changes:**
- Added state for `expandedItems` to track which items are expanded
- Added `handleChange(e, itemIndex?)` to support both root-level and item-level changes
- Added `addItem()` function to create new empty items
- Added `removeItem(itemIndex)` function to delete items
- Added `toggleItemExpanded(itemIndex)` to expand/collapse items
- Created helper functions:
  - `renderExperienceItem(item, itemIndex, isExpanded)`
  - `renderEducationItem(item, itemIndex, isExpanded)`
  - `renderProjectsItem(item, itemIndex, isExpanded)`
- Updated `renderFields()` to render multiple items with "Add" buttons
- Updated validation logic to validate all items in the array

**Files modified:**
- `frontend/src/components/editor/SectionEditor.tsx`

### 2. **Data Storage**
- Backend already stores data in JSONField, supporting nested arrays
- Frontend sends data in correct `items` array format
- `getItemsArray()` helper in templates handles both old and new formats

### 3. **Templates** 
All templates already support the new `items` array format through the `getItemsArray()` helper function:
- Experience items are detected and rendered
- Education items are detected and rendered  
- Projects items are detected and rendered
- Each field is properly displayed

## How It Works

### User Flow:
1. User opens editor and selects a section (e.g., Experience)
2. Form shows "Add Experience" button
3. User clicks to add first experience entry
4. Form expands showing all fields
5. User fills in details (Job Title, Company, Dates, etc.)
6. User can click "Add Experience" again to add another entry
7. Multiple items are shown as collapsible cards
8. Each item shows a summary in the header (Title, Company)
9. User can expand/collapse each item to edit
10. User can delete items with the trash icon
11. On save, all items are sent to backend as `{ items: [...] }`

### Data Flow:
```
Frontend Editor Form
  ↓ (onClick: Add Experience)
Form adds new item to items array
  ↓ (User fills form)
Expanded item shows all fields
  ↓ (onClick: Save)
All items in array sent to backend
  ↓
Backend stores in JSONField
  ↓
Frontend retrieves and normalizes via getItemsArray()
  ↓
Templates render all items correctly
```

## Next Steps

### For all other templates:
The following templates already support the new format through `getItemsArray()`:
- ✅ ExecutiveTemplate
- ⏳ DynamicTemplate (needs testing)
- ⏳ ClassicTemplate (needs testing)
- ⏳ MinimalistTemplate (needs testing)
- ⏳ ModernTemplate (needs testing)
- ⏳ Other templates

### Testing Checklist:
- [ ] Add single experience entry
- [ ] Add multiple experience entries
- [ ] Expand/collapse experience items
- [ ] Delete experience items
- [ ] Add single education entry
- [ ] Add multiple education entries
- [ ] Expand/collapse education items
- [ ] Delete education items
- [ ] Add single project entry
- [ ] Add multiple projects
- [ ] Expand/collapse project items
- [ ] Delete project items
- [ ] Verify all fields are saved correctly
- [ ] Verify all templates display all items correctly
- [ ] Test with different template types

## Backend Compatibility

The backend `api/views.py` already creates proper empty defaults:
```python
'experience': {'items': []},
'education': {'items': []},
'projects': {'items': []}
```

No backend changes required! The implementation is fully backward compatible.

## UI/UX Improvements

### Visual Feedback:
- "Add Experience/Education/Project" button with + icon
- Collapsible cards with summary information
- Red trash icon on hover to delete
- Error messages if required fields are missing
- Expanded view shows all 6 fields for editing
- Collapsed view shows title and company for reference

### Accessibility:
- Keyboard navigation support (all buttons are focusable)
- Clear error messages for validation
- Proper labeling of all form fields
- Sufficient color contrast

## Known Limitations

- Items are not draggable (no reordering yet)
- No duplicate item feature
- No bulk delete
- Can't copy item to create similar one quickly

These features can be added in future iterations if needed.
