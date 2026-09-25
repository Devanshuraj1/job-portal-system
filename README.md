# 💼 Job Portal System

A full-stack **Job Portal System** built with **React.js, Spring Boot, PostgreSQL, Spring Security, JWT, Google OAuth2, Docker, GitHub Actions, and AWS EC2**.

The platform provides separate workflows for **Applicants, Recruiters, and Admins**, including job management, job approval, resume upload, applicant management, and skill-based resume matching.

---

## 🔗 Live Project

| Resource             | Link                                                                   |
| -------------------- | ---------------------------------------------------------------------- |
| 🌐 Live Application  | http://13.203.214.42                                                   | 
| 💻 GitHub Repository | [Job Portal System](https://github.com/Devanshuraj1/job-portal-system) |



---

# ✨ Features

## 👤 Applicant

* User registration and login
* JWT authentication
* Google OAuth2 login
* Browse available jobs
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

# 🛠️ Technology Stack

| Category          | Technology                        |
| ----------------- | --------------------------------- |
| Frontend          | React.js, JavaScript              |
| Routing           | React Router                      |
| HTTP Client       | Axios                             |
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
       └──────┬───────┘            └──────┬───────┘
              │                           │
              │ REST API                  │
              │                           ▼
              │                    ┌──────────────┐
              │                    │  PostgreSQL  │
              │                    └──────────────┘
              │
              └──────────────┐
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

The general request flow is:

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

The application supports two authentication mechanisms:

* **JWT-based authentication**
* **Google OAuth2 authentication**

The application has three roles:

```text
USER
RECRUITER
ADMIN
```

## JWT Authentication Flow

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

Google OAuth2 is available **only for normal USER accounts**.

A user who signs in through Google is authenticated as:

```text
Google OAuth2
      ↓
    USER
```

Google OAuth2 does **not** automatically create or assign:

```text
RECRUITER
ADMIN
```

### Google Login Flow

```text
User
 ↓
Google Login
 ↓
Google Authentication
 ↓
OAuth2 Success Handler
 ↓
Backend Verifies Google User
 ↓
USER Role Assigned
 ↓
JWT Generated
 ↓
Frontend Receives Token
 ↓
Authenticated USER
```

Role separation:

```text
Google Login       ───────► USER

Recruiter Account  ───────► RECRUITER

Admin Account      ───────► ADMIN
```

This ensures that Google authentication does not grant privileged recruiter or administrator permissions.

---

# 🛡️ Role-Based Authorization

Authorization is handled on the backend using Spring Security.

```text
                    Authentication
                          │
                          ▼
                        JWT
                          │
                          ▼
                      JwtFilter
                          │
                          ▼
                     User + Role
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
            USER      RECRUITER      ADMIN
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

# 👥 Role-Based Application Flow

## Applicant

```text
Register / Login
       ↓
Authentication
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
Recruiter Login
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
Admin Login
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

### Processing Flow

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

### PDF Processing

```text
PDF
 ↓
Apache PDFBox
 ↓
Extract Resume Text
```

### DOCX Processing

```text
DOCX
 ↓
Apache POI
 ↓
Extract Resume Text
```

---

# 📊 Resume Matching

The application calculates a skill-based matching percentage between the job requirements and the applicant's resume.

Example:

```text
Job Requirements:

Java
Spring Boot
React
PostgreSQL
```

Resume contains:

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

The matching logic is handled by:

```text
ResumeMatchingService
```

---

# 🐳 Docker Architecture

The application is containerized using Docker and Docker Compose.

```text
                  Docker Compose
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
         Frontend            Backend
         Container           Container
              │                 │
           Nginx            Spring Boot
              │                 │
           Port 80           Port 8084
              │                 │
              └────────┬────────┘
                       │
                       ▼
                  PostgreSQL
```

## Frontend

```text
React Source
     ↓
npm run build
     ↓
Production Build
     ↓
Nginx
```

## Backend

```text
Spring Boot
     ↓
Java 21 Runtime
     ↓
REST APIs
```

Docker provides a consistent environment for development and deployment.

---

# ☁️ AWS EC2 Deployment

The application is deployed on an **AWS EC2 instance**.

Production flow:

```text
                         Internet
                            │
                            ▼
                     AWS EC2 Instance
                            │
                      Docker Compose
                            │
               ┌────────────┴────────────┐
               │                         │
               ▼                         ▼
          Frontend                    Backend
          React/Nginx                Spring Boot
               │                         │
               └────────────┬────────────┘
                            ▼
                       PostgreSQL
```

The EC2 server runs the Dockerized application and provides the production environment for the project.

---

# 🔄 CI/CD Pipeline

The project uses **GitHub Actions** for CI/CD automation.

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
    │
    ├── Test
    │
    ├── Docker Build
    │
    └── Deploy
          │
          ▼
       AWS EC2
          │
          ▼
    Docker Compose
          │
          ▼
 Updated Application
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
9. Docker containers updated
          ↓
10. Application becomes live
```

---

# 🧪 Testing

The project includes automated testing at two levels.

## Unit Testing

Unit tests validate individual business logic components.

Examples:

```text
Service Logic
Resume Matching
Validation
```

## Integration Testing

Integration tests verify communication between multiple application layers.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Testing is also integrated into the CI/CD workflow before deployment.

---

# 🗄️ Database

The application uses **PostgreSQL** for persistent data.

Main application entities include:

```text
User
JobPost
JobApplication
```

The database stores application data and resume references, while uploaded resume files are stored separately.

---

# 🌐 Frontend

The frontend is built with React.js.

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

React Router is used for client-side routing and Axios is used for backend API communication.

---

# 🔌 Frontend ↔ Backend Communication

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

Protected requests include the JWT authentication token.

---

# 📁 Resume Storage

Uploaded resumes are stored separately from the database.

```text
Backend/
└── uploads/
    └── resumes/
        ├── UUID-resume.pdf
        ├── UUID-resume.docx
        └── ...
```

PostgreSQL stores the application metadata and resume reference, while the actual resume file is stored in the configured file storage directory.

---

# 🔒 Security

Security features implemented in the application include:

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

Sensitive credentials such as:

```text
Database Password
JWT Secret
Google Client ID
Google Client Secret
```

are configured through environment variables/secrets and should not be committed to GitHub.

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

## Clone Repository

```bash
git clone https://github.com/Devanshuraj1/job-portal-system.git

cd job-portal-system
```

## Run Backend

```bash
cd Backend

./mvnw spring-boot:run
```

Backend:

```text
http://localhost:8084
```

## Run Frontend

```bash
cd Frontend

npm install
npm start
```

Frontend:

```text
http://localhost:3000
```

## Run with Docker

From the project root:

```bash
docker compose up -d --build
```

Check containers:

```bash
docker compose ps
```

Stop containers:

```bash
docker compose down
```

View logs:

```bash
docker compose logs backend
docker compose logs frontend
```

---

# 📌 Project Highlights

```text
React.js
     +
Spring Boot
     +
PostgreSQL
     +
Spring Security
     +
JWT
     +
Google OAuth2
     +
Resume Processing
     +
Skill Matching
     +
Docker
     +
GitHub Actions
     +
AWS EC2
```

The project demonstrates an end-to-end software development and deployment workflow:

```text
Development
     ↓
Git / GitHub
     ↓
Testing
     ↓
Dockerization
     ↓
GitHub Actions
     ↓
CI/CD
     ↓
AWS EC2
     ↓
Production Deployment
```

---

# 👨‍💻 Author

**Devanshu Raj**

Full-Stack Developer

**Technologies:** Java | Spring Boot | React.js | PostgreSQL | Docker | AWS

### GitHub

https://github.com/Devanshuraj1/job-portal-system

---

# ⭐ Project Summary

**Job Portal System** is a full-stack production-deployed application that demonstrates:

* Secure authentication and authorization
* Role-based Applicant, Recruiter, and Admin workflows
* Google OAuth2 for USER accounts
* Resume upload and processing
* Skill-based resume matching
* REST API architecture
* PostgreSQL persistence
* Unit and integration testing
* Docker containerization
* GitHub Actions CI/CD
* AWS EC2 deployment

The project follows a complete development-to-production workflow:

```text
Code
 ↓
GitHub
 ↓
CI/CD
 ↓
Docker
 ↓
AWS EC2
 ↓
Live Application

