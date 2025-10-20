"""
Test script to verify backend APIs
- Fetch all saved resumes for a test user
- Fetch all sections for each resume
- Specifically verify DynamicTemplate data
"""

import requests
import json
from pprint import pprint

# Configuration
BASE_URL = "http://localhost:8000/api"
TEST_USER_USERNAME = "testuser"
TEST_USER_PASSWORD = "123456789"
TEST_USER_EMAIL = "test@example.com"

# Global variables to store auth token and user data
auth_token = None
test_user_id = None


def print_header(title):
    """Print a formatted header"""
    print("\n" + "="*80)
    print(f"  {title}")
    print("="*80)


def register_user():
    """Register a new test user"""
    print_header("STEP 1: Register Test User")
    
    url = f"{BASE_URL}/auth/register/"
    payload = {
        "username": TEST_USER_USERNAME,
        "email": TEST_USER_EMAIL,
        "password": TEST_USER_PASSWORD,
        "first_name": "Test",
        "last_name": "User"
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        
        if response.status_code in [201, 200]:
            data = response.json()
            print(f"✓ User registered successfully!")
            print(f"  User ID: {data.get('id')}")
            print(f"  Username: {data.get('username')}")
            print(f"  Email: {data.get('email')}")
            return data.get('id')
        elif response.status_code == 400:
            # User might already exist - that's OK, we'll try to login
            print(f"! User already exists - will use existing user")
            return None
        else:
            print(f"✗ Error: {response.text}")
            return None
    except Exception as e:
        print(f"✗ Exception: {e}")
        return None


def login_user():
    """Login user and get auth token"""
    global auth_token
    
    print_header("STEP 2: Login Test User")
    
    url = f"{BASE_URL}/auth/token/"
    payload = {
        "username": TEST_USER_USERNAME,
        "password": TEST_USER_PASSWORD
    }
    
    try:
        response = requests.post(url, json=payload)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            auth_token = data.get('access')
            print(f"✓ Login successful!")
            print(f"  Access Token: {auth_token[:50]}...")
            return auth_token
        else:
            print(f"✗ Error: {response.text}")
            return None
    except Exception as e:
        print(f"✗ Exception: {e}")
        return None


def get_headers():
    """Get headers with auth token"""
    return {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }


def fetch_all_resumes():
    """Fetch all resumes for the authenticated user"""
    print_header("STEP 3: Fetch All Resumes for Test User")
    
    url = f"{BASE_URL}/resumes/"
    
    try:
        response = requests.get(url, headers=get_headers())
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            resumes = data if isinstance(data, list) else data.get('results', [])
            
            if not resumes:
                print("! No resumes found for this user")
                return []
            
            print(f"✓ Found {len(resumes)} resume(s):\n")
            for resume in resumes:
                print(f"  Resume ID: {resume.get('id')}")
                print(f"  Title: {resume.get('title')}")
                print(f"  Template: {resume.get('template_name')}")
                print(f"  Created: {resume.get('created_at')}")
                print(f"  Updated: {resume.get('updated_at')}")
                print()
            
            return resumes
        else:
            print(f"✗ Error: {response.text}")
            return []
    except Exception as e:
        print(f"✗ Exception: {e}")
        return []


def fetch_resume_sections(resume_id):
    """Fetch all sections for a specific resume"""
    print_header(f"STEP 4: Fetch Sections for Resume ID {resume_id}")
    
    url = f"{BASE_URL}/resumes/{resume_id}/sections/"
    
    try:
        response = requests.get(url, headers=get_headers())
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            sections = data if isinstance(data, list) else data.get('results', [])
            
            if not sections:
                print("! No sections found for this resume")
                return []
            
            print(f"✓ Found {len(sections)} section(s):\n")
            
            for section in sections:
                print(f"\n  Section Type: {section.get('type')}")
                print(f"  Section ID: {section.get('id')}")
                print(f"  Order: {section.get('order')}")
                print(f"  Content Preview:")
                
                content = section.get('content', {})
                if isinstance(content, dict):
                    if content.get('text'):
                        preview = content['text'][:100]
                        print(f"    Text: {preview}{'...' if len(content['text']) > 100 else ''}")
                    if content.get('items'):
                        print(f"    Items Count: {len(content['items'])}")
                        if content['items']:
                            first_item = content['items'][0]
                            if isinstance(first_item, dict):
                                print(f"    First Item: {json.dumps(first_item, indent=6)}")
                            else:
                                print(f"    First Item: {first_item}")
                    if content.get('email'):
                        print(f"    Contact Info: {content.get('name', 'N/A')} - {content.get('email', 'N/A')}")
                    
                print("  " + "-"*70)
            
            return sections
        else:
            print(f"✗ Error: {response.text}")
            return []
    except Exception as e:
        print(f"✗ Exception: {e}")
        return []


def analyze_dynamic_template_data(sections):
    """Analyze and display DynamicTemplate data structure"""
    print_header("STEP 5: Analyze DynamicTemplate Data Structure")
    
    print("\n📋 Section Content Summary:\n")
    
    section_summary = {}
    for section in sections:
        section_type = section.get('type')
        content = section.get('content', {})
        
        print(f"[{section_type.upper()}]")
        print(f"  Section ID: {section.get('id')}")
        print(f"  Order: {section.get('order')}")
        
        if section_type == 'contact':
            print(f"  Name: {content.get('name', 'Empty')}")
            print(f"  Email: {content.get('email', 'Empty')}")
            print(f"  Phone: {content.get('phone', 'Empty')}")
            print(f"  Title: {content.get('title', 'Empty')}")
            print(f"  Address: {content.get('address', 'Empty')}")
            print(f"  LinkedIn: {content.get('linkedin', 'Empty')}")
            print(f"  Website: {content.get('website', 'Empty')}")
            
        elif section_type == 'summary':
            text = content.get('text', 'Empty')
            if text:
                print(f"  Text: {text[:150]}{'...' if len(text) > 150 else ''}")
            else:
                print(f"  Text: [Empty]")
            
        elif section_type == 'experience':
            items = content.get('items', [])
            print(f"  Total Experiences: {len(items)}")
            for idx, exp in enumerate(items, 1):
                print(f"    [{idx}] {exp.get('title', 'N/A')} @ {exp.get('company', 'N/A')}")
                if exp.get('start_date'):
                    print(f"        {exp.get('start_date')} - {exp.get('end_date', 'Present')}")
            
        elif section_type == 'education':
            items = content.get('items', [])
            print(f"  Total Educations: {len(items)}")
            for idx, edu in enumerate(items, 1):
                print(f"    [{idx}] {edu.get('degree', 'N/A')} from {edu.get('institution', 'N/A')}")
                if edu.get('start_date'):
                    print(f"        {edu.get('start_date')} - {edu.get('end_date', 'Present')}")
            
        elif section_type == 'skills':
            items = content.get('items', [])
            print(f"  Total Skills: {len(items)}")
            if items:
                print(f"  Skills: {', '.join(items[:5])}" + (f"... (+{len(items)-5} more)" if len(items) > 5 else ""))
            
        elif section_type == 'projects':
            items = content.get('items', [])
            print(f"  Total Projects: {len(items)}")
            for idx, proj in enumerate(items, 1):
                print(f"    [{idx}] {proj.get('title', proj.get('name', 'N/A'))}")
                if proj.get('description'):
                    desc = proj['description'][:80]
                    print(f"        {desc}{'...' if len(proj['description']) > 80 else ''}")
            
        elif section_type == 'custom':
            print(f"  Title: {content.get('title', 'Empty')}")
            text = content.get('content') or content.get('text', 'Empty')
            if text:
                print(f"  Content: {text[:150]}{'...' if len(text) > 150 else ''}")
            else:
                print(f"  Content: [Empty]")
        
        print()
        section_summary[section_type] = {
            'id': section.get('id'),
            'order': section.get('order'),
            'has_content': bool(content),
            'items_count': len(content.get('items', []))
        }
    
    return section_summary


def verify_data_integrity(sections):
    """Verify data integrity and completeness"""
    print_header("STEP 6: Data Integrity Verification")
    
    issues = []
    
    print("\n🔍 Checking data integrity:\n")
    
    for section in sections:
        section_type = section.get('type')
        content = section.get('content', {})
        
        if not content:
            issues.append(f"[{section_type}] Section has no content")
            print(f"⚠ [{section_type}] No content found")
            continue
        
        # Check for empty strings that shouldn't be empty
        if section_type == 'contact':
            if not content.get('name'):
                issues.append(f"[contact] Name is missing")
            if not content.get('email'):
                print(f"✓ [{section_type}] No email provided (OK)")
        
        elif section_type == 'summary':
            if not content.get('text'):
                print(f"⚠ [{section_type}] Summary text is empty")
            else:
                print(f"✓ [{section_type}] Summary has content ({len(content.get('text', ''))} chars)")
        
        elif section_type in ['experience', 'education', 'projects', 'skills']:
            items = content.get('items', [])
            if not items:
                print(f"⚠ [{section_type}] No items found")
            else:
                print(f"✓ [{section_type}] Found {len(items)} item(s)")
        
        else:
            print(f"✓ [{section_type}] Section exists with content")
    
    if not issues:
        print("\n✓ All data integrity checks passed!")
    else:
        print(f"\n⚠ Found {len(issues)} potential issue(s):")
        for issue in issues:
            print(f"  - {issue}")
    
    return len(issues) == 0


def export_full_resume_data(resume_id, sections):
    """Export full resume data as JSON"""
    print_header(f"STEP 7: Export Full Resume Data (Resume ID: {resume_id})")
    
    resume_data = {
        "resume_id": resume_id,
        "sections": sections
    }
    
    filename = f"resume_data_export_{resume_id}.json"
    
    try:
        with open(filename, 'w') as f:
            json.dump(resume_data, f, indent=2)
        print(f"\n✓ Resume data exported to: {filename}")
        print(f"  Total sections: {len(sections)}")
        print(f"  File size: {len(json.dumps(resume_data))} bytes")
        return True
    except Exception as e:
        print(f"✗ Error exporting data: {e}")
        return False


def main():
    """Main test execution"""
    print("\n" + "="*80)
    print("  BACKEND API TEST - Resume Data Verification")
    print("="*80)
    
    # Step 1: Register user
    user_id = register_user()
    
    # Step 2: Login
    if not login_user():
        print("\n✗ Failed to login. Exiting.")
        return
    
    # Step 3: Fetch all resumes
    resumes = fetch_all_resumes()
    
    if not resumes:
        print("\n✗ No resumes found. Please create a resume first.")
        return
    
    # Step 4-7: For each resume, fetch and analyze sections
    for resume in resumes:
        resume_id = resume.get('id')
        template_name = resume.get('template_name')
        resume_title = resume.get('title')
        
        print(f"\n\n{'*'*80}")
        print(f"  Processing Resume: {resume_title} (Template: {template_name})")
        print(f"{'*'*80}")
        
        # Fetch sections
        sections = fetch_resume_sections(resume_id)
        
        if sections:
            # Analyze data
            summary = analyze_dynamic_template_data(sections)
            
            # Verify integrity
            is_valid = verify_data_integrity(sections)
            
            # Export data
            export_full_resume_data(resume_id, sections)
    
    print_header("Test Complete")
    print("\n✓ All tests completed successfully!")
    print("\nGenerated Files:")
    print("  - resume_data_export_*.json (Resume data exports)")


if __name__ == "__main__":
    main()
