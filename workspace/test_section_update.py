"""
Test script to trigger section update and see debug output
"""

import requests
import json

BASE_URL = "http://localhost:8000/api"
TEST_USER_USERNAME = "testuser"
TEST_USER_PASSWORD = "12345678"

# Step 1: Login
print("="*80)
print("STEP 1: Login")
print("="*80)

login_response = requests.post(
    f"{BASE_URL}/auth/token/",
    json={
        "username": TEST_USER_USERNAME,
        "password": TEST_USER_PASSWORD
    }
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.text}")
    exit(1)

auth_token = login_response.json().get('access')
print(f"✓ Login successful!")
print(f"  Token: {auth_token[:50]}...\n")

headers = {
    "Authorization": f"Bearer {auth_token}",
    "Content-Type": "application/json"
}

# Step 2: Get all resumes
print("="*80)
print("STEP 2: Fetch Resumes")
print("="*80)

resumes_response = requests.get(f"{BASE_URL}/resumes/", headers=headers)
resumes = resumes_response.json()

if not resumes:
    print("❌ No resumes found")
    exit(1)

print(f"Found {len(resumes)} resume(s):")
for r in resumes:
    print(f"  - ID {r['id']}: {r.get('title')} (Template: {r.get('template_name')})")

resume_id = resumes[0]['id']
print(f"\nUsing resume ID: {resume_id}\n")

# Step 3: Get sections
print("="*80)
print("STEP 3: Fetch Sections")
print("="*80)

sections_response = requests.get(f"{BASE_URL}/resumes/{resume_id}/sections/", headers=headers)
sections = sections_response.json()

print(f"Found {len(sections)} section(s):")
for s in sections:
    print(f"  - ID {s['id']}: {s['type']} (Order: {s['order']})")

if not sections:
    print("❌ No sections found")
    exit(1)

# Pick a section to update
section_to_update = sections[0]
section_id = section_to_update['id']
section_type = section_to_update['type']

print(f"\nUpdating section ID {section_id} (type: {section_type})\n")

# Step 4: Update the section with content
print("="*80)
print("STEP 4: Update Section")
print("="*80)
print(f"\n📤 Sending update for section {section_id}...")

# Create update data based on section type
update_data = {
    "type": section_type,
    "order": section_to_update.get('order', 1)
}

# Add different content based on type
if section_type == 'contact':
    update_data['content'] = {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "(555) 123-4567",
        "title": "Senior Developer",
        "address": "San Francisco, CA",
        "linkedin": "linkedin.com/in/johndoe",
        "website": "johndoe.com",
        "location": "San Francisco"
    }
elif section_type == 'summary':
    update_data['content'] = {
        "text": "Experienced software developer with 5+ years of experience in full-stack development."
    }
elif section_type == 'experience':
    update_data['content'] = {
        "items": [
            {
                "title": "Senior Developer",
                "company": "Tech Corp",
                "location": "San Francisco, CA",
                "start_date": "2022-01-01",
                "end_date": "present",
                "description": "Led development of microservices architecture"
            }
        ]
    }
elif section_type == 'education':
    update_data['content'] = {
        "items": [
            {
                "degree": "BS Computer Science",
                "institution": "UC Berkeley",
                "location": "Berkeley, CA",
                "start_date": "2015-09-01",
                "end_date": "2019-05-31"
            }
        ]
    }
elif section_type == 'skills':
    update_data['content'] = {
        "items": ["Python", "JavaScript", "React", "Django", "PostgreSQL"]
    }
elif section_type == 'projects':
    update_data['content'] = {
        "items": [
            {
                "title": "Resume Builder App",
                "description": "Full-stack resume builder application",
                "technologies": ["React", "Django", "PostgreSQL"]
            }
        ]
    }
elif section_type == 'custom':
    update_data['content'] = {
        "title": "Certifications",
        "content": "AWS Solution Architect Associate, Kubernetes Administrator"
    }
else:
    update_data['content'] = {}

print(f"\n📊 Update Payload:")
print(json.dumps(update_data, indent=2))

# Send the update
update_response = requests.patch(
    f"{BASE_URL}/sections/{section_id}/",
    json=update_data,
    headers=headers
)

print(f"\n📋 Response Status: {update_response.status_code}")

if update_response.status_code == 200:
    print("✓ Update successful!")
    updated_section = update_response.json()
    print(f"\n📥 Updated Section Content:")
    print(json.dumps(updated_section.get('content'), indent=2))
else:
    print(f"❌ Update failed!")
    print(f"Response: {update_response.text}")

print("\n" + "="*80)
print("Check server console above for 🔍 DEBUG OUTPUT")
print("="*80)
