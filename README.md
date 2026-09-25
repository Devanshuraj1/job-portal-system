# 💼 Job Portal System

A production-deployed **Full-Stack Job Portal System** built with **React.js, Spring Boot, PostgreSQL, Spring Security, JWT, Google OAuth2, Docker, Nginx, GitHub Actions, and AWS EC2**.

The platform supports three application roles:

* **Applicant**
* **Recruiter**
* **Admin**

Applicants can search and apply for jobs with resumes, Recruiters can manage jobs and applicants, and Admins can approve and manage jobs.

---

## 🔗 Live Project

| Resource             | Link                                                                                |
| -------------------- | ----------------------------------------------------------------------------------- |
| 🌐 Live Application  | http://13.203.214.42                                                        |
| 💻 GitHub Repository | [Devanshuraj1/job-portal-system](https://github.com/Devanshuraj1/job-portal-system) |
| ☁️ Cloud             | AWS EC2                                                                             |
| 🐳 Containerization  | Docker + Docker Compose                                                             |
| 🌐 Web Server        | Nginx                                                                               |
| 🔄 CI/CD             | GitHub Actions                                                                      |

---

# ✨ Features

## 👤 Applicant

* Registration and login
* JWT authentication
* Google OAuth2 login
* Browse jobs
* View job details
* Apply for jobs
* Upload PDF/DOCX resume
* Resume validation
* Resume text extraction
* Skill-based resume matching
* View submitted applications

## 🏢 Recruiter

* Recruiter authentication
* Recruiter dashboard
* Create jobs
* Manage own jobs
* View applicants
* Access applicant resumes
* View resume matching percentage

## 🛡️ Admin

* Admin authentication
* Manage users
* Manage jobs
* Approve/reject jobs
* Edit jobs
* Delete jobs
* Role-based authorization

---

# 🛠️ Tech Stack

| Layer             | Technology                        |
| ----------------- | --------------------------------- |
| Frontend          | React.js, JavaScript              |
| Routing           | React Router                      |
| API Client        | Axios                             |
| Backend           | Java, Spring Boot                 |
| Security          | Spring Security                   |
| Authentication    | JWT + Google OAuth2               |
| Database          | PostgreSQL                        |
| ORM               | Spring Data JPA, Hibernate        |
| Resume Processing | Apache PDFBox, Apache POI         |
| Testing           | Unit Testing, Integration Testing |
| Containerization  | Docker, Docker Compose            |
| Web Server        | Nginx                             |
| CI/CD             | GitHub Actions                    |
| Cloud             | AWS EC2                           |
| Version Control   | Git, GitHub                       |

---

# 🏗️ System Architecture

```text
                         INTERNET
                            │
                            ▼
                     ┌──────────────┐
                     │   AWS EC2    │
                     │    Server    │
                     └──────┬───────┘
                            │
                      Docker Compose
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
       ┌──────────────┐            ┌──────────────┐
       │   Frontend   │            │    Backend   │
       │ React + Nginx│            │ Spring Boot  │
       │    :3000     │            │    :8084     │
       └──────┬───────┘            └──────┬───────┘
              │                           │
              │ REST API                  │
              │                           ▼
              │                    ┌──────────────┐
              │                    │  PostgreSQL  │
              │                    └──────────────┘
              │
              ▼
        Resume Storage
```

---

# 📂 Project Structure

```text
job-portal-system/
│
├── Backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dev/springbootrest/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── repository/
│   │   │   │   ├── entity/
│   │   │   │   ├── security/
│   │   │   │   └── ...
│   │   │   │
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   ├── mvnw
│   ├── Dockerfile
│   └── uploads/
│       └── resumes/
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   ├── Dockerfile
│   └── nginx.conf
│
├── .github/
│   └── workflows/
│       └── ...
│
├── docker-compose.yml
├── .dockerignore
├── .gitignore
└── README.md
```

---

# 🔄 Application Flow

```text
React Frontend
      │
      │ HTTP / REST API
      ▼
Spring Security
      │
      ▼
Controller
      │
      ▼
Service Layer
      │
      ▼
Repository Layer
      │
      ▼
Hibernate / JPA
      │
      ▼
PostgreSQL
```

---

# 🔐 Authentication & Authorization

The application supports:

* JWT authentication
* Google OAuth2 authentication
* Role-based authorization

Application roles:

```text
USER
RECRUITER
ADMIN
```

## JWT Authentication

```text
Login
  ↓
Credentials Validation
  ↓
JWT Generated
  ↓
Frontend Stores Token
  ↓
Protected Request
  ↓
JwtFilter
  ↓
JWT Validation
  ↓
Role Verification
  ↓
Protected Resource
```

---

# 🔑 Google OAuth2

Google OAuth2 is available **only for USER accounts**.

Google login does not automatically create or assign Recruiter or Admin privileges.

```text
Google Login
      ↓
Google Authentication
      ↓
OAuth2 Success Handler
      ↓
Backend Verifies User
      ↓
USER Role
      ↓
JWT Generated
      ↓
Authenticated USER
```

Role separation:

```text
Google OAuth2      ─────► USER

Recruiter Account  ─────► RECRUITER

Admin Account      ─────► ADMIN
```

This keeps OAuth2 authentication separate from privileged application roles.

---

# 🛡️ Role-Based Authorization

Authorization is enforced by the backend.

```text
Authentication
      ↓
JWT
      ↓
JwtFilter
      ↓
User + Role
      ↓
Authorization
      ↓
Allowed / Denied
```

### USER

```text
✓ Browse Jobs
✓ View Job Details
✓ Apply for Jobs
✓ Upload Resume
✓ View Applications
```

### RECRUITER

```text
✓ Create Jobs
✓ Manage Own Jobs
✓ View Applicants
✓ Access Resumes
✓ View Matching Percentage
```

### ADMIN

```text
✓ Manage Users
✓ Manage Jobs
✓ Approve Jobs
✓ Reject Jobs
✓ Edit Jobs
✓ Delete Jobs
```

---

# 👥 Role-Based Workflow

## Applicant

```text
Register / Login
       ↓
Browse Jobs
       ↓
View Job
       ↓
Upload Resume
       ↓
Apply
       ↓
Resume Processing
       ↓
Skill Matching
       ↓
Application Saved
```

## Recruiter

```text
Login
  ↓
Recruiter Dashboard
  ↓
Create Job
  ↓
Admin Approval
  ↓
Job Published
  ↓
Applicants Apply
  ↓
View Applicants
  ↓
Access Resume
  ↓
View Matching %
```

## Admin

```text
Login
  ↓
Admin Dashboard
  ↓
View Jobs / Users
  ↓
Review Jobs
  ↓
Approve / Reject
  ↓
Manage Platform
```

---

# 📄 Resume Processing

Applicants can upload:

* PDF
* DOCX

Maximum file size:

```text
5 MB
```

Processing flow:

```text
Applicant
    ↓
Upload Resume
    ↓
File Validation
    ↓
Resume Storage
    ↓
Text Extraction
    ↓
Skill Matching
    ↓
Matching Percentage
    ↓
Application Saved
```

### PDF

```text
PDF
 ↓
Apache PDFBox
 ↓
Extract Text
```

### DOCX

```text
DOCX
 ↓
Apache POI
 ↓
Extract Text
```

---

# 📊 Resume Matching

The application calculates a skill-based matching percentage between job requirements and resume content.

Example:

```text
Job Requirements:

Java
Spring Boot
React
PostgreSQL
```

Resume:

```text
Java
Spring Boot
React
```

Result:

```text
3 / 4 skills matched

Matching Percentage = 75%
```

Matching flow:

```text
Job Tech Stack
      +
Resume Text
      ↓
Normalize Skills
      ↓
Compare Skills
      ↓
Count Matches
      ↓
Calculate Percentage
      ↓
Matching %
```

Implemented by:

```text
ResumeMatchingService
```

---

# 🐳 Docker & Nginx

The application uses Docker for containerization and **Nginx to serve the production React frontend**.

## Frontend Production Flow

```text
React Source Code
        ↓
npm run build
        ↓
Production Build
        ↓
Nginx Docker Image
        ↓
Nginx
        ↓
Port 80
        ↓
Host Port 3000
```

The frontend Dockerfile uses a multi-stage build:

```text
Node.js
   ↓
React Build
   ↓
Static Production Files
   ↓
Nginx
```

Nginx serves the compiled React application instead of running the React development server in production.

### React Routing

The Nginx configuration supports React client-side routing by forwarding application routes to `index.html`.

```text
Browser
   ↓
Nginx
   ↓
React Production Build
   ↓
React Router
```

---

# 🐳 Docker Architecture

```text
                  Docker Compose
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
         Frontend            Backend
         Container           Container
              │                 │
        React + Nginx      Spring Boot
              │                 │
           Port 80          Port 8084
              │                 │
        Host Port 3000            │
              │                   │
              └────────┬──────────┘
                       │
                       ▼
                  PostgreSQL
```

---

# ☁️ AWS EC2 Deployment

The application is deployed on an **AWS EC2 instance** using Docker.

Production architecture:

```text
                         INTERNET
                            │
                            ▼
                     AWS EC2 Instance
                            │
                      Docker Compose
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
        React + Nginx              Spring Boot
          Frontend                   Backend
           :3000                      :8084
               │                         │
               └────────────┬────────────┘
                            ▼
                       PostgreSQL
```

### Production Components

| Component      | Responsibility             |
| -------------- | -------------------------- |
| AWS EC2        | Cloud hosting              |
| Docker         | Application containers     |
| Docker Compose | Container orchestration    |
| Nginx          | Production frontend server |
| React          | Frontend                   |
| Spring Boot    | Backend REST API           |
| PostgreSQL     | Persistent data            |

---

# 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for CI/CD.

```text
Developer
    │
    ▼
Git Push
    │
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Build
    ├── Test
    ├── Docker Build
    └── Deploy
            │
            ▼
         AWS EC2
            │
            ▼
      Docker Compose
            │
      ┌─────┴─────┐
      ▼           ▼
   Frontend     Backend
   + Nginx    Spring Boot
      │           │
      └─────┬─────┘
            ▼
        PostgreSQL
            │
            ▼
      Live Application
```

## CI/CD Flow

```text
1. Developer pushes code
          ↓
2. GitHub Actions starts
          ↓
3. Backend build
          ↓
4. Unit / Integration tests
          ↓
5. Frontend build
          ↓
6. Docker image build
          ↓
7. Deployment
          ↓
8. AWS EC2
          ↓
9. Containers updated
          ↓
10. Application becomes live
```

---

# 🧪 Testing

The project includes:

### Unit Testing

Tests individual business logic such as:

* Service logic
* Resume matching
* Validation

### Integration Testing

Tests interaction between application layers:

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Testing is included in the CI/CD workflow before deployment.

---

# 🗄️ Database

The application uses **PostgreSQL** for persistent data.

Main entities:

```text
User
JobPost
JobApplication
```

Application metadata and resume references are stored in PostgreSQL, while actual resume files are stored separately.

---

# 🌐 Frontend

The frontend is built using React.js.

Important components include:

```text
Navbar
AllPosts
Login
Register
JobDetails
Create
Edit
UserDashboard
RecruiterDashboard
Applicants
MyJobs
AdminDashboard
```

React Router handles client-side routing and Axios handles communication with the Spring Boot REST API.

---

# 🔌 Frontend ↔ Backend

```text
React Frontend
      │
      │ Axios / HTTP
      ▼
Spring Boot REST API
      │
      ▼
Spring Security
      │
      ▼
Service Layer
      │
      ▼
PostgreSQL
```

Protected requests include JWT authentication.

---

# 📁 Resume Storage

```text
Backend/
└── uploads/
    └── resumes/
        ├── UUID-resume.pdf
        ├── UUID-resume.docx
        └── ...
```

The database stores application metadata and resume references, while the actual files are stored in the configured upload directory.

---

# 🔒 Security

Security features include:

* Spring Security
* JWT authentication
* Google OAuth2
* Role-based authorization
* Protected REST APIs
* CORS configuration
* Password authentication
* File type validation
* File size validation
* Unique resume filenames
* Duplicate application prevention
* Recruiter-specific resume access
* Backend-side authorization

Sensitive credentials such as database passwords, JWT secrets, and Google OAuth credentials should be provided through environment variables/secrets and never committed to GitHub.

---

# 🚀 Local Development

## Prerequisites

* Java 21+
* Node.js
* npm
* PostgreSQL
* Docker
* Docker Compose
* Git

## Clone

```bash
git clone https://github.com/Devanshuraj1/job-portal-system.git

cd job-portal-system
```

## Backend

```bash
cd Backend

./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8084
```

## Frontend

```bash
cd Frontend

npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

## Docker

From the project root:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

Stop:

```bash
docker compose down
```

Logs:

```bash
docker compose logs backend
docker compose logs frontend
```

---

# 📌 End-to-End Deployment Flow

```text
Developer
    │
    ▼
GitHub
    │
    ▼
GitHub Actions
    │
    ├── Build
    ├── Test
    └── Docker
          │
          ▼
       AWS EC2
          │
     Docker Compose
          │
     ┌────┴────┐
     ▼         ▼
Frontend     Backend
React        Spring Boot
   │
 Nginx
   │
   └──────────┐
              ▼
         PostgreSQL
              │
              ▼
       Live Application
```

---

# 📈 Project Highlights

* Full-stack React + Spring Boot application
* REST API architecture
* JWT authentication
* Google OAuth2 for USER accounts
* Role-based Applicant / Recruiter / Admin workflows
* Resume upload and processing
* PDF/DOCX text extraction
* Skill-based resume matching
* PostgreSQL persistence
* Docker containerization
* **Nginx production frontend**
* GitHub Actions CI/CD
* AWS EC2 deployment
* Unit and integration testing

---

# 👨‍💻 Author

**Devanshu Raj**

Full-Stack Developer

**Technologies:** Java | Spring Boot | React.js | PostgreSQL | Docker | Nginx | AWS

### GitHub

https://github.com/Devanshuraj1/job-portal-system

---

# ⭐ Project Summary

**Job Portal System** demonstrates a complete software development and deployment lifecycle:

```text
Development
     ↓
Git / GitHub
     ↓
Testing
     ↓
Dockerization
     ↓
Nginx Production Frontend
     ↓
GitHub Actions CI/CD
     ↓
AWS EC2
     ↓
Live Application
```

The project combines secure authentication, role-based authorization, resume processing, skill matching, containerization, CI/CD, and cloud deployment into a single production-oriented full-stack application.
