# 🚀 Engaze Resume Builder

> A modern, minimalist, and professional resume builder application built with Django + React demonstrating advanced multi-tech stack integration

<div align="center">

![Django](https://img.shields.io/badge/Django-5.2+-092E20?style=for-the-badge&logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)

**Repository**: [Engaze-Resume-Builder](https://github.com/Kamal-dev-1999/Engaze-Resume-Builder)  
**Developed by**: [Kamal-dev-1999](https://github.com/Kamal-dev-1999)  
**Version**: 1.0.0 | **License**: MIT

</div>

---

## 🎯 Why Django? — A Multi-Tech Stack Mastery Project

### Strategic Backend Choice: Django REST Framework

I deliberately chose **Django** as the backend framework for this project to accomplish three core objectives:

#### 1️⃣ **Technical Proficiency & Comfort**

```
┌─────────────────────────────────────────────┐
│  Deep Understanding of Django Ecosystem    │
├─────────────────────────────────────────────┤
│ ✅ ORM (Object-Relational Mapping)         │
│ ✅ Authentication & Authorization          │
│ ✅ Middleware & Request-Response Cycle    │
│ ✅ Settings & Configuration Management     │
│ ✅ Testing Framework Integration           │
│ ✅ Admin Interface & Management Commands   │
└─────────────────────────────────────────────┘
```

Django's mature ecosystem and batteries-included approach allowed me to focus on **architectural decisions** rather than reinventing infrastructure components. This deep compatibility enabled:

- **Rapid Prototyping**: Built robust APIs in minimal time
- **Maintainability**: Clear structure and conventions reduce technical debt
- **Scalability**: Proven patterns for growing applications
- **Production Readiness**: Built-in security features and best practices

#### 2️⃣ **Multi-Tech Stack Integration Challenge** 🔗

This project demonstrates **advanced capability** in integrating disparate technologies into a cohesive system:

```
          FRONTEND              BACKEND              DATABASE
              ↓                   ↓                      ↓
         ┌──────────┐        ┌──────────┐        ┌──────────────┐
         │  React   │ HTTP   │  Django  │ ORM    │ PostgreSQL   │
         │18+TypeScript─────→│  REST    │───────→│  (VPS)       │
         │+ Redux  │←────────│Framework │←───────│              │
         │+ Vite   │ JSON    │+ JWT Auth│ SQL    │              │
         └──────────┘        └──────────┘        └──────────────┘
              ↓                   ↓                      ↓
        Vite Build Tool     Gunicorn Server      Connection Pooling
        ESLint + TypeScript  WhiteNoise Static   Automated Backups
        Tailwind CSS         CORS Headers        Replication
```

**Integration Points Managed**:
- ✅ **API Communication**: RESTful endpoints with Django REST Framework
- ✅ **Authentication Layer**: JWT tokens bridging React frontend ↔ Django backend
- ✅ **CORS Security**: Proper cross-origin configuration
- ✅ **Database Connection**: TypeScript types ↔ Django ORM ↔ PostgreSQL
- ✅ **Error Handling**: Frontend error states ↔ Backend error responses
- ✅ **Deployment**: CI/CD pipeline managing both applications

#### 3️⃣ **VPS Hosting & Production Deployment** 🌐

I've implemented a complete production-ready setup demonstrating enterprise-level deployment skills:

```
┌─────────────────────────────────────────────────────────────────┐
│                    VPS HOSTING ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐        ┌─────────────────┐    ┌────────────┐ │
│  │   Nginx     │        │  Gunicorn Proc  │    │ PostgreSQL │ │
│  │  (Reverse   │───────→│  (Django App)   │───→│  (Data)    │ │
│  │   Proxy)    │        │  :8000          │    │  :5432     │ │
│  └─────────────┘        └─────────────────┘    └────────────┘ │
│       :80                                                       │
│       :443              ┌─────────────────┐    ┌────────────┐ │
│    (SSL/TLS)    ───────→│  React Build    │    │   Redis    │ │
│                         │  (Static Files) │    │   (Cache)  │ │
│                         └─────────────────┘    └────────────┘ │
│                                                                 │
│  Nginx Config    │ Gunicorn Workers  │ PostgreSQL   │ SSL Cert │
│  Load Balancing  │ Process Management│ Replication  │ Renewal  │
│  Caching         │ Error Logging     │ Backup       │ Monitoring
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**VPS Deployment Complexity Solved**:

| Challenge | Solution | Complexity |
|-----------|----------|-----------|
| Static File Serving | WhiteNoise middleware + Nginx | ⭐⭐⭐ |
| Environment Management | python-dotenv + separate configs | ⭐⭐ |
| Process Management | Gunicorn with worker config | ⭐⭐⭐ |
| Database Connection | Connection pooling + SSL | ⭐⭐⭐ |
| Frontend Routing | React Router + Nginx rewrites | ⭐⭐⭐ |
| SSL/TLS Certificates | Let's Encrypt integration | ⭐⭐ |
| API Rate Limiting | Django Throttling classes | ⭐⭐⭐ |
| Error Monitoring | Logging + error tracking | ⭐⭐⭐ |

---

### 🏗️ Multi-Tech Stack Integration Complexity

This project showcases **sophisticated engineering** by seamlessly connecting four major technology domains:

#### **Domain 1: Frontend Ecosystem**
```
React 18 (Component Framework)
    ↓
TypeScript (Type Safety)
    ↓
Redux Toolkit (State Management)
    ↓
Vite (Build & Bundling)
    ↓
Tailwind CSS (Styling)
    ↓
Static Assets Optimization
```

**Challenges Overcome**:
- 🔧 Configuring TypeScript strict mode with React
- 🔧 Redux DevTools integration for debugging
- 🔧 Environment variables for API endpoints
- 🔧 Build optimization for faster load times

#### **Domain 2: Backend API Layer**
```
Django (Web Framework)
    ↓
Django REST Framework (API)
    ↓
SimpleJWT (Token Auth)
    ↓
CORS Headers (Security)
    ↓
DRF Serializers (Data Validation)
    ↓
Permission Classes (Access Control)
```

**Challenges Overcome**:
- 🔧 JWT token lifecycle management
- 🔧 Custom permission classes for ownership validation
- 🔧 Nested serializers for relationships
- 🔧 Proper HTTP status code handling

#### **Domain 3: Database Layer**
```
Models (ORM - Object Mapping)
    ↓
Migrations (Schema Versioning)
    ↓
JSONField (Flexible Storage)
    ↓
Relationships (FK, OneToOne, M2M)
    ↓
Indexing & Query Optimization
    ↓
PostgreSQL (Production DB)
```

**Challenges Overcome**:
- 🔧 Complex model relationships with proper cascading
- 🔧 JSON field for flexible section content
- 🔧 Database migrations with zero downtime
- 🔧 Query optimization to prevent N+1 problems

#### **Domain 4: DevOps & Deployment**
```
Local Development (SQLite)
    ↓
Docker Containerization
    ↓
VPS Environment Setup
    ↓
Database Migration Strategy
    ↓
Reverse Proxy (Nginx)
    ↓
SSL/TLS Encryption
    ↓
Process Monitoring
```

**Challenges Overcome**:
- 🔧 Different configs for dev/prod environments
- 🔧 Docker image optimization for size
- 🔧 Database connection from container to VPS
- 🔧 SSL certificate renewal automation
- 🔧 Process restart on failure

---

### 📊 Integration Complexity Breakdown

```
DIFFICULTY LEVELS BY LAYER:

Frontend → Backend Communication
  ├─ CORS Configuration ........................... ⭐⭐⭐
  ├─ JWT Token Refresh Cycle ..................... ⭐⭐⭐⭐
  ├─ Error Handling & Retry Logic ............... ⭐⭐⭐
  └─ Request/Response Interceptors .............. ⭐⭐⭐

Backend → Database Synchronization
  ├─ ORM Relationship Mapping ................... ⭐⭐⭐
  ├─ Transaction Management ..................... ⭐⭐⭐⭐
  ├─ Data Validation & Serialization ........... ⭐⭐⭐
  └─ Permission-Based Access Control ........... ⭐⭐⭐

Development → Production
  ├─ Environment Separation ..................... ⭐⭐
  ├─ Database Migration Strategy ............... ⭐⭐⭐⭐
  ├─ Static File Management ..................... ⭐⭐⭐
  ├─ Container Orchestration ................... ⭐⭐⭐⭐
  └─ Monitoring & Error Tracking ............... ⭐⭐⭐

OVERALL PROJECT COMPLEXITY: ⭐⭐⭐⭐⭐ (EXPERT LEVEL)
```

---

### 💡 Why This Demonstrates Advanced Capability

By choosing **Django + React + PostgreSQL + VPS Deployment**, I've demonstrated:

| Capability | Evidence |
|-----------|----------|
| **Architecture Design** | Designed scalable multi-tier architecture |
| **API Development** | Built RESTful APIs with proper HATEOAS principles |
| **Type Safety** | Implemented end-to-end TypeScript typing |
| **Authentication** | Managed JWT lifecycle and token refresh |
| **DevOps Skills** | Deployed complete stack on VPS with Nginx |
| **Database Design** | Created efficient schema with proper relationships |
| **Frontend State Management** | Implemented Redux for complex state |
| **Problem Solving** | Resolved CORS, token expiry, and deployment issues |
| **Best Practices** | Followed DRY, SOLID, and security principles |
| **Production Ready** | Created deployment-ready, scalable application |

---

## 📋 Table of Contents

1. [Why Django? — Multi-Tech Stack Mastery](#-why-django--a-multi-tech-stack-mastery-project)
2. [Project Overview](#project-overview)
3. [Key Features](#key-features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Database Schema & ERD](#database-schema--erd)
7. [Setup and Installation](#setup-and-installation)
8. [Backend Architecture](#backend-architecture)
   - [Models](#models--database-design)
   - [API Endpoints](#api-endpoints)
   - [Authentication & Security](#authentication--security)
9. [Frontend Architecture](#frontend-architecture)
   - [Component Structure](#component-structure)
   - [State Management](#state-management)
   - [Styling Approach](#styling-approach)
10. [Key Development Decisions](#key-development-decisions)
11. [AI-Assisted Development Process](#ai-assisted-development-process)
    - [Major Prompts & Outcomes](#major-prompts--outcomes)
12. [AI Tools & Technologies Used](#ai-tools--technologies-used)
13. [Deployment](#deployment)
14. [Contributing](#contributing)
15. [License](#license)

---

## Project Overview

Engaze Resume Builder is a full-stack web application built with **Django REST Framework** backend and **React 18** frontend. It features on-canvas editing, drag-and-drop section reordering, template switching, design customization, PDF exports, and public resume sharing via unique URLs.

The application demonstrates modern full-stack development practices including:
- RESTful API design with JWT authentication
- Type-safe frontend with TypeScript
- State management with Redux Toolkit
- Responsive UI with Tailwind CSS
- Secure token-based authentication
- CORS-enabled cross-origin requests

---

## Key Features

### Core Functionality
- ✅ **User Authentication**: Secure JWT-based authentication with access and refresh tokens
- ✅ **Resume Creation**: Create multiple resumes with different templates
- ✅ **On-Canvas Editing**: Edit resume content directly with live preview
- ✅ **Section Management**: Add, edit, delete, and reorder resume sections
- ✅ **Design Customization**: Customize fonts, colors, and styling
- ✅ **Template System**: Multiple professional templates to choose from
- ✅ **PDF Export**: Download resumes as PDF files
- ✅ **Public Sharing**: Generate unique URLs to share resumes publicly
- ✅ **Responsive Design**: Mobile-friendly interface

### Advanced Features
- 🔐 **Token Refresh**: Automatic token refresh with 401 handling
- 🎨 **Real-time Preview**: Live preview updates without page reload
- 📱 **Drag & Drop**: Reorder sections using intuitive drag-and-drop
- 💾 **Auto-Save**: Local state updates with backend synchronization
- 🛡️ **CORS Security**: Proper CORS configuration for cross-origin requests
- 📊 **User Dashboard**: Overview of all user resumes

---

## Technology Stack

### Backend
- **Framework**: Django 5.2+
- **API**: Django REST Framework 3.16+
- **Authentication**: Django REST Framework SimpleJWT 5.5+
- **Database**: PostgreSQL (production) / SQLite (development)
- **CORS**: django-cors-headers 4.9+
- **Server**: Gunicorn + WhiteNoise
- **Testing**: Pytest + Pytest-Django

### Frontend
- **Library**: React 18.2+
- **Language**: TypeScript 5.0+
- **Build Tool**: Vite 4.3+
- **State Management**: Redux Toolkit 1.9+
- **Routing**: React Router 6.15+
- **Styling**: Tailwind CSS 3.3+
- **UI Components**: Lucide React (icons)
- **HTTP Client**: Axios 1.5+
- **PDF Generation**: jsPDF + html2canvas
- **Drag & Drop**: react-beautiful-dnd 13.1+

### DevOps & Tools
- **Version Control**: Git
- **Package Management**: pip (Python), npm (Node.js)
- **Environment Management**: python-dotenv
- **Code Linting**: ESLint
- **Type Checking**: TypeScript compiler

---

## Project Structure

```
Engaze-Resume-Builder/
│
├── backend/                          # Django REST API
│   ├── api/
│   │   ├── models.py                # Database models (User, Resume, Section, Style)
│   │   ├── serializers.py           # DRF serializers
│   │   ├── views.py                 # API views and viewsets
│   │   ├── urls.py                  # API routing
│   │   ├── permissions.py           # Custom permission classes
│   │   └── pagination.py            # Pagination classes
│   │
│   ├── config/
│   │   ├── settings.py              # Django settings
│   │   ├── urls.py                  # Root URL configuration
│   │   └── wsgi.py                  # WSGI configuration
│   │
│   ├── manage.py
│   ├── requirements.txt
│   └── Procfile                     # Deployment configuration
│
├── frontend/                         # React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── editor/              # Editor components
│   │   │   │   ├── SectionFormattingPanel.tsx
│   │   │   │   └── ResumEditor.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── ResumeCard.tsx
│   │   │   └── ErrorBoundary.tsx
│   │   │
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── EditorPage.tsx
│   │   │   └── SharePage.tsx
│   │   │
│   │   ├── redux/
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.ts
│   │   │   │   ├── dashboardSlice.ts
│   │   │   │   └── editorSlice.ts
│   │   │   └── store.ts
│   │   │
│   │   ├── services/
│   │   │   └── api.ts               # Axios instance & API calls
│   │   │
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript type definitions
│   │   │
│   │   ├── utils/
│   │   │   ├── hooks.ts
│   │   │   └── helpers.ts
│   │   │
│   │   ├── App.tsx
│   │   └── App.css
│   │
│   ├── public/
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── README.md
│
├── proxy/                            # Node.js proxy server
│   └── server.js
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## Database Schema & ERD

### Entity Relationship Diagram

```
┌─────────────┐
│    User     │
├─────────────┤
│ id (PK)     │
│ username    │
│ email       │
│ password    │
│ first_name  │
│ last_name   │
│ created_at  │
└────┬────────┘
     │ 1
     │ (one-to-many)
     │
     ├────────────────────────────────┬──────────────────────────┐
     │                                │                          │
     ▼ N                              ▼ N                        ▼ N
┌──────────────┐              ┌──────────────┐          ┌──────────────┐
│    Resume    │              │   Section    │          │    Style     │
├──────────────┤              ├──────────────┤          ├──────────────┤
│ id (PK)      │──┐           │ id (PK)      │          │ id (PK)      │
│ user_id (FK) │  │ 1         │ resume_id(FK)│          │ resume_id(FK)│
│ title        │  │ │         │ type         │          │ primary_color│
│ template_name│  │ │(1:1)    │ content(JSON)│          │ font_family  │
│ share_slug   │  │ │         │ order        │          │ font_size    │
│ created_at   │  │ │         │ created_at   │          │ created_at   │
│ updated_at   │  │ │         │ updated_at   │          │ updated_at   │
└──────────────┘  │ │         └──────────────┘          └──────────────┘
                  │ │
                  └─┤(one-to-one)
```

### Database Models

#### User Model
```python
class User(AbstractUser):
    """Extended Django User model for authentication"""
    # Inherits: id, username, email, password, first_name, last_name, 
    #           is_active, is_staff, is_superuser, date_joined
```

#### Resume Model
```python
class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=255)                    # Resume title
    template_name = models.CharField(max_length=50, default='classic')
    share_slug = models.UUIDField(unique=True, null=True)       # For public sharing
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

#### Section Model
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
    content = models.JSONField()                                 # Flexible content storage
    order = models.PositiveIntegerField()                        # Section ordering
```

#### Style Model
```python
class Style(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='style')
    primary_color = models.CharField(max_length=7, default='#000000')
    font_family = models.CharField(max_length=100, default='Inter')
    font_size = models.IntegerField(default=10)
```

---

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

## Setup and Installation

### Prerequisites

- **Python**: 3.10+
- **Node.js**: 16+ with npm
- **PostgreSQL**: 12+ (for production)
- **Git**: Latest version

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd workspace/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory:
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   ALLOWED_HOSTS=localhost,127.0.0.1
   DATABASE_URL=sqlite:///db.sqlite3
   CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
   ```

5. Apply migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```bash
   python manage.py runserver
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd workspace/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`

5. Build for production:
   ```bash
   npm run build
   ```

---

## Backend Architecture

### Models & Database Design

#### User Model
```python
class User(AbstractUser):
    """Extended Django User model for authentication and user management"""
    # Inherits from AbstractUser:
    # - id, username, email, password
    # - first_name, last_name
    # - is_active, is_staff, is_superuser
    # - date_joined, last_login
```

**Relationships**:
- One-to-Many with Resume (one user can have many resumes)
- Indirect relationship with Sections and Styles through Resume

#### Resume Model
```python
class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    title = models.CharField(max_length=255)
    template_name = models.CharField(max_length=50, default='classic')
    share_slug = models.UUIDField(unique=True, null=True, blank=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
```

**Key Features**:
- `share_slug`: Unique UUID for public sharing without authentication
- `template_name`: Reference to different design templates
- Auto-tracking of creation and update times

#### Section Model
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
    
    class Meta:
        ordering = ['order']
```

**Key Features**:
- **Flexible Content**: JSONField allows storing any structure based on section type
- **Ordering**: Position in resume is managed via the `order` field
- **Multiple Types**: Support for various professional resume sections

#### Style Model
```python
class Style(models.Model):
    resume = models.OneToOneField(Resume, on_delete=models.CASCADE, related_name='style')
    primary_color = models.CharField(max_length=7, default='#000000')
    font_family = models.CharField(max_length=100, default='Inter')
    font_size = models.IntegerField(default=10)
```

**Key Features**:
- One-to-one relationship ensures each resume has exactly one style
- Customizable colors, fonts, and sizing

### API Endpoints

#### Authentication Endpoints

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/api/auth/register/` | POST | Register new user | `{username, email, password, first_name, last_name}` | User object with tokens |
| `/api/auth/token/` | POST | Obtain JWT tokens | `{username, password}` | `{access, refresh}` |
| `/api/auth/token/refresh/` | POST | Refresh access token | `{refresh}` | `{access}` |

#### Resume Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/resumes/` | GET | Yes | List all user resumes |
| `/api/resumes/` | POST | Yes | Create new resume |
| `/api/resumes/{id}/` | GET | Yes | Retrieve specific resume |
| `/api/resumes/{id}/` | PUT | Yes | Update resume details |
| `/api/resumes/{id}/` | DELETE | Yes | Delete resume |

#### Section Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/resumes/{id}/sections/` | GET | Yes | List resume sections |
| `/api/resumes/{id}/sections/` | POST | Yes | Create new section |
| `/api/sections/{id}/` | PUT | Yes | Update section |
| `/api/sections/{id}/` | DELETE | Yes | Delete section |

#### Style Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/resumes/{id}/style/` | GET | Yes | Get resume style |
| `/api/resumes/{id}/style/` | PUT | Yes | Update resume style |

#### Public Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/public/resume/{share_slug}/` | GET | No | Access shared resume |

### Authentication & Security

**JWT Implementation**:
- Access tokens valid for 24 hours
- Refresh tokens valid for 7 days
- Automatic token refresh on 401 responses
- Secure password hashing with Django's default PBKDF2

**Permissions**:
- `IsAuthenticated`: Requires valid token
- `IsOwner`: Users can only access their own data
- Public endpoints allow unauthenticated access for shared resumes

**CORS Configuration**:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://yourdomain.com"
]
CORS_ALLOW_CREDENTIALS = True
```

---

## Frontend Architecture

### Component Structure

**Pages**:
- `LandingPage.tsx`: Welcome and marketing
- `LoginPage.tsx`: User authentication
- `RegisterPage.tsx`: New user signup
- `DashboardPage.tsx`: Resume management and overview
- `EditorPage.tsx`: Main resume editing interface
- `SharePage.tsx`: Public resume viewing

**Components**:
- `Navbar.tsx`: Navigation and user menu
- `ResumeCard.tsx`: Resume preview cards
- `NewResumeModal.tsx`: Create resume dialog
- `ErrorBoundary.tsx`: Error handling wrapper
- `editor/SectionFormattingPanel.tsx`: Section styling controls
- `editor/ResumePreview.tsx`: Live preview of resume

### State Management

**Redux Store Structure**:
```typescript
{
  auth: {
    user: User | null
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    isLoading: boolean
    error: string | null
  },
  dashboard: {
    resumes: Resume[]
    isLoading: boolean
    error: string | null
  },
  editor: {
    currentResume: Resume | null
    currentSection: Section | null
    isLoading: boolean
    error: string | null
  }
}
```

**Async Thunks**:
- `login`: Authenticate user
- `register`: Create new account
- `logout`: Clear session
- `refreshToken`: Refresh JWT token
- `fetchResumes`: Get all user resumes
- `createResume`: Create new resume
- `updateResume`: Modify resume
- `deleteResume`: Remove resume

### Styling Approach

- **Tailwind CSS**: Utility-first CSS framework
- **Responsive Design**: Mobile-first approach
- **Color System**: Theme-based colors
- **Animations**: Smooth transitions and micro-interactions

---

## Key Development Decisions

### 1. **Database Design Choice: JSONField for Section Content**
**Decision**: Use JSONField for flexible section content storage  
**Rationale**:
- Different section types have different structures
- Avoids complex normalization of section data
- Easy to extend with new section types
- Reduces database complexity

**Alternative Considered**: Separate models for each section type (rejected due to complexity)

### 2. **Authentication: JWT Tokens over Sessions**
**Decision**: Implement JWT-based authentication  
**Rationale**:
- Stateless authentication suitable for REST APIs
- Easy token refresh mechanism
- Better for distributed systems and scaling
- Frontend can store tokens locally

**Alternative Considered**: Django session-based auth (rejected - less suitable for SPAs)

### 3. **Frontend: React with TypeScript**
**Decision**: Use React 18 with TypeScript  
**Rationale**:
- Type safety reduces runtime errors
- Better IDE support and autocomplete
- Easier maintenance and refactoring
- Large ecosystem and community support

### 4. **State Management: Redux Toolkit**
**Decision**: Implement Redux Toolkit for state management  
**Rationale**:
- Centralized state for better predictability
- DevTools integration for debugging
- Thunks for async operations
- Works well with TypeScript

### 5. **Build Tool: Vite over Create React App**
**Decision**: Use Vite for frontend bundling  
**Rationale**:
- Significantly faster development server (HMR)
- Smaller bundle sizes
- Better ES module support
- Modern build pipeline

### 6. **API Communication: Axios over Fetch**
**Decision**: Use Axios for HTTP requests  
**Rationale**:
- Built-in request/response interceptors
- Automatic JSON transformation
- Better error handling
- Token refresh middleware support

### 7. **Real-time Preview: Local State Updates**
**Decision**: Separate preview state from backend sync  
**Rationale**:
- Immediate UI feedback without network latency
- Better user experience
- Prevents unnecessary API calls
- Backend sync happens asynchronously

---

## AI-Assisted Development Process

This project was developed with extensive assistance from **GitHub Copilot**, an AI programming assistant. Below are the major development prompts and their outcomes.

### Major Prompts & Outcomes

#### **Prompt 1: Project Architecture Setup**

**Input**:
```
Set up a full-stack resume builder application with the following requirements:
- Backend: Django REST Framework with JWT authentication
- Frontend: React 18 with TypeScript and Redux
- Database: SQLite for development, PostgreSQL for production
- Features: User authentication, resume CRUD, section management, styling customization
- Should follow best practices for both backend and frontend

Please provide:
1. Complete project structure
2. Django models for User, Resume, Section, and Style
3. DRF serializers and viewsets
4. Redux store setup with slices
5. React components and routing
```

**Output**:
- Complete Django project configuration with proper settings
- All 4 database models with relationships defined
- RESTful API endpoints with proper permissions
- Redux store with auth, dashboard, and editor slices
- React Router setup with protected routes
- Component hierarchy and folder structure

---

#### **Prompt 2: JWT Authentication with Token Refresh**

**Input**:
```
Implement a complete JWT authentication system for the resume builder with:
- User registration and login
- Access and refresh token system
- Automatic token refresh on 401 responses
- Proper error handling and redirect to login
- CORS configuration for frontend-backend communication

Requirements:
- Access tokens valid for 1 day
- Refresh tokens valid for 7 days
- Store tokens in localStorage
- Add Authorization header to all requests
- Clear tokens on logout
```

**Output**:
- Django REST SimpleJWT configuration
- Axios interceptors for token management
- Redux authSlice with login/register/logout thunks
- Automatic token refresh mechanism
- Protected route component
- CORS headers configuration

---

#### **Prompt 3: Resume and Section Management API**

**Input**:
```
Create comprehensive API endpoints for resume and section management:

Endpoints needed:
1. Resume: List, Create, Read, Update, Delete
2. Sections: CRUD operations linked to resume
3. Styles: Get and Update styling for resume
4. Sharing: Generate and access public resume links via UUID

Requirements:
- User can only access their own resumes
- Sections can be reordered
- Styling includes colors, fonts, sizes
- Public sharing should work without authentication
- Proper pagination for resume lists
```

**Output**:
- Complete ViewSets with permissions
- Serializers with nested relationships
- Pagination implementation
- Permission classes for ownership validation
- Public endpoints for shared resumes
- Proper status codes and error responses

---

#### **Prompt 4: Redux State Management & Async Operations**

**Input**:
```
Set up Redux Toolkit state management for:
1. Authentication state (user, tokens, loading, error)
2. Dashboard state (resumes list, loading, error)
3. Editor state (current resume, sections, loading, error)

Use createSlice and createAsyncThunk for:
- Async API calls
- State updates based on pending/fulfilled/rejected
- Error handling
- Loading states

Ensure:
- Proper TypeScript typing
- Clean action creators
- Centralized error handling
```

**Output**:
- Three Redux slices with proper structure
- Async thunks for all API operations
- Loading and error states
- Type-safe reducer functions
- Integration with React components via hooks
- DevTools-compatible setup

---

#### **Prompt 5: UI/UX Improvements for Formatting Controls**

**Input**:
```
Improve the section formatting panel with:
1. Text alignment control: Replace dropdown with button group (Left, Center, Right)
2. Color inputs: Enhance Text Color and Background Color inputs
3. Numeric inputs: Fix font size and line height controls
4. Layout: Stack elements vertically to prevent overflow
5. Styling: Remove unnecessary shadows, add hover effects
6. Real-time preview: Apply changes instantly without saving

Current issues:
- Controls overflow horizontally
- Dropdown menus are cluttered
- Changes don't preview immediately
- Unnecessary shadows
```

**Output**:
- Button group component for text alignment
- Custom color picker inputs
- Vertical flex layout for panel
- Real-time preview without backend calls
- Improved visual hierarchy
- Better spacing and padding
- Hover and active states for buttons

---

#### **Prompt 6: Security Improvements - Remove Sensitive Information**

**Input**:
```
Enhance security by removing sensitive debugging information:
1. Remove all console.log statements showing tokens (access_token, refresh_token)
2. Remove debug panel from dashboard showing internal state
3. Remove logging of authentication responses with token details
4. Clean up API error logs to not expose sensitive data
5. Ensure no tokens appear in Redux logs

Requirements:
- Keep essential error messages for debugging
- Don't log sensitive auth data
- Remove token values from console output
- Clean up network request logs
- No security-sensitive data in localStorage beyond tokens
```

**Output**:
- Removed all console.log statements logging tokens
- Cleaned up Redux middleware logging
- Removed debug panel from DashboardPage
- Added comments marking where logs were removed "for security"
- Maintained functional debugging capabilities
- Kept error handling for troubleshooting

---

#### **Prompt 7: Handle CORS Issues and Fix API Endpoints**

**Input**:
```
Fix CORS errors and API endpoint issues:
1. Add proper CORS headers to Django backend
2. Verify section update endpoints use correct URL patterns
3. Ensure credentials are sent with requests
4. Handle preflight OPTIONS requests
5. Fix any 404 errors on section update/delete

Current errors:
- CORS error when frontend tries to access backend
- Section PUT/PATCH requests return 404
- Headers not being sent properly
```

**Output**:
- Complete CORS configuration in Django settings
- Fixed URL patterns for section endpoints
- Axios configured with CORS credentials
- Proper request interceptors
- OPTIONS handler configuration
- Working section CRUD operations

---

#### **Prompt 8: PDF Export and Resume Download**

**Input**:
```
Implement PDF export functionality:
1. Convert resume preview to PDF
2. Use jsPDF and html2canvas for generation
3. Maintain styling and layout in PDF
4. Add download button to editor
5. Handle large content gracefully

Requirements:
- High quality PDF output
- Preserve colors and fonts
- Include all resume sections
- Handle page breaks properly
- Add filename with resume title
```

**Output**:
- PDF generation service using jsPDF
- html2canvas integration for styling
- Download button in editor
- Proper filename generation
- Error handling for large content
- Quality settings for PDF output

---

#### **Prompt 9: Drag and Drop Section Reordering**

**Input**:
```
Implement drag-and-drop functionality for section reordering:
1. Use react-beautiful-dnd for dragging
2. Allow users to reorder sections in the editor
3. Update backend with new order on drop
4. Show visual feedback during drag
5. Handle edge cases (disabled sections, limits)

Requirements:
- Smooth animations
- Visual drop zone indicators
- Prevent invalid drops
- Optimistic updates
- Backend sync after drop
```

**Output**:
- react-beautiful-dnd integration
- Drag handlers on section components
- Drop zone styling
- Optimistic state updates
- Backend API call to update order
- Error rollback on failed updates

---

#### **Prompt 10: Public Resume Sharing**

**Input**:
```
Implement public resume sharing via unique URLs:
1. Generate UUID for each resume share
2. Create public endpoint that doesn't require auth
3. Display resume without edit capabilities
4. Add share button to generate/copy link
5. Track sharing (optional)

Requirements:
- UUID-based unique URLs
- No authentication needed for public view
- Same styling as private resume
- Copy link to clipboard
- Optional password protection (future)
```

**Output**:
- Public endpoint implementation
- UUID generation on share button click
- Public component for viewing
- Copy to clipboard functionality
- No authentication needed
- Link management in dashboard

---

## AI Tools & Technologies Used

### Primary AI Assistant
- **GitHub Copilot**: AI pair programmer for code generation and suggestions
  - Used for: Component boilerplate, API integration, Redux setup, TypeScript types
  - Features: Code completion, function generation, bug fixes

### Development Technologies
- **Visual Studio Code**: Code editor with Copilot integration
- **TypeScript**: Static type checking and IDE support
- **Redux DevTools**: Redux state debugging and time-travel debugging

### AI Capabilities Leveraged
1. **Code Generation**: Copilot generated component skeletons and API services
2. **Problem Solving**: AI suggested fixes for Redux state issues and CORS problems
3. **Best Practices**: Followed AI recommendations for React hooks and TypeScript patterns
4. **Security Review**: AI identified and helped remove security-sensitive logging
5. **Documentation**: AI assisted in creating clear comments and documentation

---

## Deployment

### Backend Deployment (Heroku/Railway)

1. **Create Procfile**:
   ```
   web: gunicorn config.wsgi
   ```

2. **Update settings.py**:
   ```python
   ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'localhost').split(',')
   DEBUG = os.environ.get('DEBUG', 'False') == 'True'
   SECRET_KEY = os.environ.get('SECRET_KEY')
   ```

3. **Set environment variables**:
   ```
   SECRET_KEY=your-secure-key
   DEBUG=False
   DATABASE_URL=postgresql://...
   CORS_ALLOWED_ORIGINS=https://yourdomain.com
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Deploy to Vercel**:
   ```bash
   npm install -g vercel
   vercel
   ```

   Or push to GitHub and connect to Vercel

3. **Set environment variables**:
   ```
   VITE_API_BASE_URL=https://api.yourdomain.com
   ```

### Docker Deployment

**Dockerfile for Backend**:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "config.wsgi"]
```

**Docker Compose**:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/resume_db
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=resume_db
```

---

## Contributing

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Make your changes**:
   - Follow existing code style
   - Add comments for complex logic
   - Keep components small and focused

3. **Test your changes**:
   ```bash
   # Backend
   pytest
   
   # Frontend
   npm run lint
   ```

4. **Commit with meaningful messages**:
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. **Push and create a Pull Request**:
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Style Guidelines

- **Python**: Follow PEP 8
- **JavaScript/TypeScript**: Use ESLint configuration
- **React**: Functional components with hooks
- **Git Commits**: Use conventional commits

---

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## Support & Contact

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact the developer: [Kamal-dev-1999](https://github.com/Kamal-dev-1999)

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Status**: Active Development