# Engaze Resume Builder

A modern, minimalist, and professional resume builder inspired by platforms like FlowCV. The application allows users to create, edit, and share professional resumes with various templates and customization options.

## Project Overview

Engaze Resume Builder is a full-stack web application built with Django REST Framework backend and React frontend. It features on-canvas editing, drag-and-drop section reordering, template switching, design customization, PDF downloads, and public sharing.

## Table of Contents

- [Project Structure](#project-structure)
- [Backend](#backend)
  - [Models](#models)
  - [API Endpoints](#api-endpoints)
  - [Authentication](#authentication)
- [Frontend](#frontend)
- [Proxy Server](#proxy-server)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

```
engaze/
│
├── backend/            # Django REST API backend
│   ├── api/            # Main API app
│   └── config/         # Django settings
│
├── frontend/           # React frontend
│
└── proxy/              # Node.js proxy server
```

## Backend

The backend is built with Django REST Framework and provides a comprehensive API for resume creation, editing, and sharing.

### Models

#### User

Extends Django's AbstractUser for authentication and user management.

#### Resume

```python
class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=255)
    template_name = models.CharField(max_length=50, default='classic')
    share_slug = models.UUIDField(unique=True, null=True, blank=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

- **Relationships**:
  - Belongs to a User
  - Has one Style (one-to-one)
  - Has many Sections (one-to-many)
- **Use Cases**:
  - Store basic resume information
  - Track creation and updates
  - Enable public sharing via unique UUID

#### Section

```python
class Section(models.Model):
    SECTION_TYPES = (
        ('experience', 'Experience'),
        ('education', 'Education'),
        ('skills', 'Skills'),
        ('projects', 'Projects'),
        ('summary', 'Summary'),
        ('contact', 'Contact Information'),
        ('custom', 'Custom'),
    )
    
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='sections')
    type = models.CharField(max_length=20, choices=SECTION_TYPES)
    content = models.JSONField()
    order = models.PositiveIntegerField()
```

- **Relationships**:
  - Belongs to a Resume
- **Use Cases**:
  - Store different types of resume content in a flexible format (JSON)
  - Support ordering of sections
  - Allow for various section types (experience, education, etc.)

#### Style

```python
class Style(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='style')
    primary_color = models.CharField(max_length=7, default='#000000')
    font_family = models.CharField(max_length=100, default='Inter')
    font_size = models.IntegerField(default=10)
```

- **Relationships**:
  - One-to-one with Resume
- **Use Cases**:
  - Store styling preferences for a resume
  - Customize colors, fonts, and sizing

### API Endpoints

#### Authentication Endpoints

| Endpoint | Method | Purpose | Request Body | Response |
|----------|--------|---------|-------------|----------|
| `/api/auth/register/` | POST | Register a new user | `{"username": "user", "email": "user@example.com", "password": "password", "first_name": "First", "last_name": "Last"}` | `{"id": 1, "username": "user", "email": "user@example.com", "first_name": "First", "last_name": "Last"}` |
| `/api/auth/token/` | POST | Login and obtain JWT token | `{"username": "user", "password": "password"}` | `{"access": "access_token", "refresh": "refresh_token"}` |
| `/api/auth/token/refresh/` | POST | Refresh JWT token | `{"refresh": "refresh_token"}` | `{"access": "new_access_token"}` |

#### Resume Endpoints

| Endpoint | Method | Purpose | Auth Required | Request Body | Response |
|----------|--------|---------|---------------|-------------|----------|
| `/api/resumes/` | GET | List user's resumes | Yes | - | Array of resume objects with basic info |
| `/api/resumes/` | POST | Create a new resume | Yes | `{"title": "Resume Title", "template_name": "modern"}` | Created resume object with ID |
| `/api/resumes/{id}/` | GET | Get a specific resume | Yes | - | Complete resume with sections and style |
| `/api/resumes/{id}/` | PUT/PATCH | Update a resume | Yes | `{"title": "Updated Title", "template_name": "classic"}` | Updated resume object |
| `/api/resumes/{id}/` | DELETE | Delete a resume | Yes | - | `204 No Content` |
| `/api/resumes/{id}/share/` | POST | Generate a share link | Yes | - | `{"share_url": "/share/{uuid}"}` |

#### Section Endpoints

| Endpoint | Method | Purpose | Auth Required | Request Body | Response |
|----------|--------|---------|---------------|-------------|----------|
| `/api/resumes/{resume_id}/sections/` | GET | List sections of a resume | Yes | - | Array of section objects |
| `/api/resumes/{resume_id}/sections/` | POST | Add a section to a resume | Yes | `{"type": "experience", "content": {...}, "order": 1}` | Created section object |
| `/api/sections/{id}/` | PUT/PATCH | Update a section | Yes | `{"content": {...}, "order": 2}` | Updated section object |
| `/api/sections/{id}/` | DELETE | Delete a section | Yes | - | `204 No Content` |

#### Style Endpoints

| Endpoint | Method | Purpose | Auth Required | Request Body | Response |
|----------|--------|---------|---------------|-------------|----------|
| `/api/resumes/{resume_id}/style/` | GET | Get the style of a resume | Yes | - | Style object |
| `/api/resumes/{resume_id}/style/` | PUT/PATCH | Update the style | Yes | `{"primary_color": "#1E88E5", "font_family": "Roboto", "font_size": 12}` | Updated style object |

#### Public Endpoints

| Endpoint | Method | Purpose | Auth Required | Response |
|----------|--------|---------|---------------|----------|
| `/api/public/resume/{share_slug}/` | GET | Access a shared resume | No | Resume with sections and style |

### Authentication

The API uses JWT (JSON Web Token) authentication with the following features:

- Token-based authentication using djangorestframework-simplejwt
- Access tokens valid for 1 day
- Refresh tokens valid for 7 days
- User registration with secure password hashing
- Permission-based access control (users can only access their own resumes)

### Example API Usage

#### Creating a Resume

```bash
# First, authenticate to get a token
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "password"}'

# Use the token to create a resume
curl -X POST http://localhost:8000/api/resumes/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "My Professional Resume", "template_name": "modern"}'
```

#### Adding an Experience Section

```bash
curl -X POST http://localhost:8000/api/resumes/1/sections/ \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "experience",
    "content": {
      "title": "Software Developer",
      "company": "Tech Company",
      "location": "New York, NY",
      "start_date": "2022-01",
      "end_date": "2025-10",
      "description": "Developed web applications using modern technologies."
    },
    "order": 1
  }'
```

## Frontend

*[Frontend details will be added as development progresses]*

## Proxy Server

*[Proxy server details will be added as development progresses]*

## Setup and Installation

### Prerequisites

- Python 3.8+
- PostgreSQL (optional for production)
- Node.js and npm

### Backend Setup

1. Navigate to the backend directory and create a virtual environment:
   ```
   cd backend
   python -m venv venv
   ```

2. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - Unix/MacOS: `source venv/bin/activate`

3. Install dependencies:
   ```
   pip install django djangorestframework psycopg2-binary djangorestframework-simplejwt django-cors-headers
   ```

4. Apply migrations:
   ```
   python manage.py migrate
   ```

5. Create a superuser:
   ```
   python manage.py createsuperuser
   ```

6. Run the development server:
   ```
   python manage.py runserver
   ```

### Frontend Setup

*[Frontend setup instructions will be added as development progresses]*

### Proxy Server Setup

*[Proxy server setup instructions will be added as development progresses]*

## Usage

*[Usage instructions will be added as development progresses]*

## Deployment

*[Deployment instructions will be added as development progresses]*

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.