# SkillBridge AI — Bridge Your Skills. Build Your Future.

> **Transform your resume into a personalized career growth engine. Evaluate ATS readiness, discover critical skill gaps for target jobs, and follow AI-tailored roadmaps to land your next technical role.**

SkillBridge AI is a full-stack, enterprise-grade AI career development and job portal. Combining a **React 18 + Vite** frontend with a **Java 21 Spring Boot** backend, **Spring Data JPA**, **Spring Security + JWT**, **Apache Tika**, and **Google Gemini via Spring AI**, the platform helps job seekers transition from their current technical abilities toward their dream career.

---

## ✨ Core Features

### 🔐 1. Secure Authentication & Candidate Profile
* **Account Registration & Login:** Email and password registration with BCrypt hashing and stateless JWT Bearer token authentication.
* **Protected Routes & APIs:** Private candidate data (resumes, roadmaps, applications) is strictly isolated to authenticated users.
* **Persistent Candidate Profile:** Manage full name, target job role, experience level, available study hours per week, learning preferences (Project-based, Hands-on, Visual, Deep Theory), technical skills, education, and work experience.
* **Profile Readiness Meter:** Real-time calculation of profile completion percentage based on populated competency fields.

### 📊 2. Candidate Career Dashboard
* **Central Command Center:** Real-time overview of target role readiness, profile completion bar, and recent scores.
* **Active Learning Journey:** Displays current active roadmap, overall completion percentage, and the next recommended learning task.
* **Priority Skill Gaps Widget:** Live preview of top competency gaps.
* **Career Pipeline Metrics:** Track total resumes uploaded and total opportunities saved or applied.

### 📄 3. AI Resume Analyzer & ATS Scoring Studio
* **Document Parsing Engine:** Powered by **Apache Tika** to extract clean text from PDF, DOCX, DOC, TXT, and RTF documents.
* **Resume Quality Review:** Google Gemini generates a quality score (1–10), key demonstrated skills, exactly three actionable improvement suggestions, and a concise executive summary.
* **ATS Compatibility Matcher:** Compares resume text directly against any target job description. Produces an ATS match score (0–100), matched keywords, missing keywords, and an alignment summary.
* **Analysis History:** Authenticated candidates can view and re-examine past analyses.

### 🎯 4. Core Engine — AI Skill-Gap Analyzer
* **Competency Gap Detection:** Evaluates resume content against target roles or job descriptions to identify exact missing skills.
* **Prioritized Ranking:** Gaps are ordered by priority (High, Medium, Low) and importance (Critical, High, Medium, Low).
* **Proficiency Assessment:** Compares estimated current proficiency (*None, Beginner, Intermediate, Advanced*) against required target proficiency (*Intermediate, Advanced, Expert*).
* **Self-Assessed Correction:** Candidates can adjust their proficiency level in real time.
* **Categorized Status:** Gaps are categorized as *Demonstrated*, *Needs Improvement*, or *Not Demonstrated*.
* **Prerequisites & Actions:** Detailed prerequisite knowledge and recommended practical actions for every skill.
* **One-Click Roadmap Generation:** Directly transition from identified gaps into a custom learning roadmap.

### 🗺️ 5. Core Engine — Personalized AI Learning Roadmap
* **AI Career Growth Roadmap:** Week-by-week curriculum tailored to candidate's available study hours, experience level, and learning style.
* **Structured Milestones:** Each week includes clear objectives, estimated study hours, and granular tasks.
* **Task Categories:** Tasks are tagged as *Theory*, *Hands-on Practice*, *Mini-Project*, or *Portfolio Capstone Project*.
* **Interactive Progress Tracker:** Candidates check off tasks as they complete them. Progress percentage recalculates dynamically based on actual task statuses.
* **Verified Learning Resources:** Reliable documentation and tutorial references (e.g. spring.io, developer.mozilla.org, react.dev, docs.oracle.com).
* **Contextual AI Learning Assistant:** Built-in AI study tutor modal to answer questions, explain difficult concepts, and provide code examples and debugging help for any task.

### 💼 6. Job Discovery & Career Application Pipeline
* **Curated Job Board:** Browse verified software engineering, DevOps, full-stack, and AI engineering opportunities.
* **Search & Filter:** Search by job title, company name, location, or required technical skills.
* **Application Tracking:** Track opportunities across the candidate pipeline: *SAVED*, *APPLIED*, *INTERVIEWING*, *OFFERED*, or *REJECTED*.

---

## 🏗️ Technical Architecture

```text
                             ┌───────────────────────────────────────┐
                             │       SkillBridge AI Frontend         │
                             │       React 18 + Vite + Router        │
                             │                                       │
                             │ • Candidate Dashboard                 │
                             │ • Resume & ATS Studio                 │
                             │ • AI Skill-Gap Analyzer               │
                             │ • Personalized Roadmap & AI Tutor     │
                             │ • Job Board & Application Pipeline    │
                             └───────────────────┬───────────────────┘
                                                 │
                                            HTTP / JSON
                                    (JWT Bearer Authorization)
                                                 │
                                                 ▼
                             ┌───────────────────────────────────────┐
                             │       Spring Boot 3 / Java 21         │
                             │                                       │
                             │ • Spring Security + JwtAuthFilter     │
                             │ • Controllers: Auth, Profile, Skills, │
                             │   Roadmaps, Resume, Jobs              │
                             │ • Spring Data JPA + Hibernate         │
                             └───────────┬───────────────┬───────────┘
                                         │               │
                         ┌───────────────┘               └───────────────┐
                         ▼                                               ▼
             ┌───────────────────────┐                       ┌───────────────────────┐
             │   Data Persistence    │                       │     AI & Document     │
             │                       │                       │      Processing       │
             │ • H2 (Persistent File │                       │ • Apache Tika Parser  │
             │   ./data/skillbridge) │                       │ • Google Gemini API   │
             │ • Modular MySQL /     │                       │   (via Spring AI)     │
             │   PostgreSQL profile  │                       │ • Config: GEMINI_MODEL│
             └───────────────────────┘                       └───────────────────────┘
```

---

## 🛠️ Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18.3.1 | Functional components, custom hooks, context state |
| **Frontend Tooling** | Vite 5.4.1 | High-speed ESM bundling, dev server proxy |
| **Routing** | React Router DOM 6.28.0 | Public & protected route guards |
| **Icons** | Lucide React 0.460.0 | Accessible, modern iconography |
| **Backend Runtime** | Java 21 LTS | Eclipse Temurin / Oracle OpenJDK |
| **Backend Framework** | Spring Boot 4.1.0 / 3.x | RESTful API controllers, service layer |
| **Persistence** | Spring Data JPA + Hibernate | Relational ORM with transaction management |
| **Default Database** | H2 Database (File-based) | Zero-configuration local database (`./data/skillbridge_db`) |
| **Modular Production DB** | MySQL 8.0 / PostgreSQL | Pre-configured production profiles |
| **Security & Auth** | Spring Security + JJWT 0.12.6 | Stateless JWT authentication, BCrypt hashing |
| **Document Processing** | Apache Tika 2.9.x | Multi-format text extraction (PDF, DOCX, TXT, RTF) |
| **AI Integration** | Spring AI 2.0.0 | Structured prompt engineering with Google Gemini |
| **AI Model** | Google Gemini | Configurable via `GEMINI_MODEL` (default: `gemini-2.5-flash`) |

---

## 📁 Project Directory Structure

```text
SkillBridge-AI/
├── .env.example                               # Safe environment configuration template
├── Readme.md                                  # Complete project documentation
├── docker-compose.yml                         # Container deployment configuration
│
├── SkillSync/                                 # Spring Boot Backend Service
│   ├── mvnw & mvnw.cmd                        # Maven wrapper scripts
│   ├── pom.xml                                # Backend dependencies & build configuration
│   └── src/
│       ├── main/
│       │   ├── java/com/tushar/SkillSync/
│       │   │   ├── SkillSyncApplication.java  # Spring Boot entry point
│       │   │   ├── SkillSyncController.java   # Preserved resume endpoints & history
│       │   │   ├── config/                    # SecurityConfig, JwtAuthFilter, JwtService
│       │   │   ├── controller/                # Auth, Profile, SkillGap, Roadmap, Job controllers
│       │   │   ├── dto/                       # Request/Response data transfer objects
│       │   │   ├── entity/                    # User, Profile, Resume, SkillGap, Roadmap, Job entities
│       │   │   ├── exception/                 # GlobalExceptionHandler
│       │   │   ├── repository/                # 10 Spring Data JPA repositories
│       │   │   └── service/                   # Auth, Profile, Resume, Gemini, SkillGap, Roadmap, Job services
│       │   └── resources/
│       │       ├── application.properties     # Persistent H2 file DB & Gemini configuration
│       │       └── application-mysql.properties # Modular MySQL profile
│       └── test/
│           └── java/com/tushar/SkillSync/     # Application test suite
│
└── SkillSyncUI/                               # React + Vite Frontend Application
    ├── package.json                           # Dependencies (React, Router, Lucide)
    ├── vite.config.js                         # Vite dev proxy configuration
    ├── index.html                             # App HTML root with SkillBridge branding
    └── src/
        ├── App.jsx                            # AppShell & Route definitions
        ├── main.jsx                           # React DOM bootstrap
        ├── context/AuthContext.jsx            # Authentication state & session provider
        ├── services/api.js                    # Unified REST client with JWT Bearer injection
        ├── hooks/useAnalyzer.js               # Resume analyzer hook
        ├── utils/resumeUtils.js               # Helper utilities & score parsers
        ├── styles/global.css                  # Custom SaaS design tokens & component styling
        ├── components/
        │   ├── Navbar/Navbar.jsx              # Brand header & navigation
        │   ├── Footer/Footer.jsx              # Brand footer & status
        │   ├── ProtectedRoute/ProtectedRoute.jsx # Route security guard
        │   ├── Sidebar/                       # Score gauge & status pill
        │   ├── UploadCard/                    # File dropzone
        │   ├── ControlCard/                   # Mode switch & JD input
        │   └── ResultsPanel/                  # Analysis cards & JSON renderer
        └── pages/
            ├── Landing/LandingPage.jsx        # SaaS landing page & value props
            ├── Auth/LoginPage.jsx             # Sign in with demo credential autofill
            ├── Auth/RegisterPage.jsx          # User registration
            ├── Dashboard/DashboardPage.jsx    # Candidate career hub
            ├── Profile/ProfilePage.jsx        # Profile & preference editor
            ├── Resume/ResumeAnalyzerPage.jsx  # Resume & ATS analysis studio
            ├── Skills/SkillGapPage.jsx        # AI Skill-Gap Analyzer
            ├── Roadmap/RoadmapPage.jsx        # AI Learning Roadmap & Tutor
            └── Jobs/JobDiscoveryPage.jsx      # Job board & application pipeline
```

---

## 🚀 Quickstart Guide

### Prerequisites
* **Java 21 LTS** (`java -version`)
* **Node.js 18+** (`node -v`) and **npm** (`npm -v` or `npm.cmd -v`)
* A **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

---

### Step 1: Configure Environment Variables

Set these environment variables in the same terminal session used to start the backend:

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your_actual_gemini_api_key_here"
$env:GEMINI_MODEL="gemini-2.5-flash"

# Linux / macOS
export GEMINI_API_KEY="your_actual_gemini_api_key_here"
export GEMINI_MODEL="gemini-2.5-flash"
```

> **Note:** The backend includes a safe fallback for local development without an active key, allowing full testing of authentication, profile management, and database persistence. When Gemini AI operations are invoked without a key, the backend returns clear diagnostic error guidance.

---

### Step 2: Start the Backend Service

Open a terminal in `SkillSync/`:

```powershell
# Windows PowerShell / CMD
.\mvnw.cmd spring-boot:run

# Linux / macOS
./mvnw spring-boot:run
```

* Backend runs on **`http://localhost:8080`**.
* The backend is API-only; open the web application at **`http://localhost:5173`**.
* The persistent H2 database is created automatically under `./SkillSync/data/skillbridge_db`. Data survives server restarts.
* H2 Database Console is accessible at **`http://localhost:8080/h2-console`** (`JDBC URL: jdbc:h2:file:./data/skillbridge_db`, `User: sa`, `Password: [empty]`).

To run with **MySQL**:
```powershell
.\mvnw.cmd spring-boot:run -Dspring-boot.run.profiles=mysql
```

---

### Step 3: Start the Frontend Application

Open a second terminal in `SkillSyncUI/`:

```powershell
# Windows
npm.cmd install
npm.cmd run dev

# Linux / macOS
npm install
npm run dev
```

* Frontend runs on **`http://localhost:5173`**.
* Vite automatically proxies API requests from `/api/*` to `http://localhost:8080`.

---

## 🔑 Demo Account & Testing Credentials

You can create a new account in 5 seconds via the Registration page, or use the **"Fill Demo Credentials"** button on the Login page:

* **Email:** `candidate@skillbridge.ai`
* **Password:** `SkillBridge2026!`

---

## 🔌 API Endpoints Specification

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new user account & initialize candidate profile | No |
| `POST` | `/api/auth/login` | Authenticate with email/password; returns JWT token | No |
| `GET` | `/api/auth/me` | Retrieve currently authenticated user session | Yes (Bearer) |

### 2. Candidate Profile & Dashboard (`/api/profile`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/profile` | Retrieve candidate profile, skills, and readiness % | Yes (Bearer) |
| `PUT` | `/api/profile` | Update profile information, target role, study hours | Yes (Bearer) |
| `GET` | `/api/profile/dashboard` | Fetch aggregated dashboard metrics, active roadmap, next task | Yes (Bearer) |

### 3. Resume & ATS Analysis (`/api/resume`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/resume/analyze` | Upload resume file (`multipart/form-data`); returns quality review | Optional |
| `POST` | `/api/resume/ats-check` | Upload resume file + `jd` parameter; returns ATS keyword match | Optional |
| `GET` | `/api/resume/history` | List previous analyses associated with the candidate | Yes (Bearer) |
| `GET` | `/api/resume/my-resumes` | Retrieve uploaded resume records | Yes (Bearer) |

### 4. AI Skill-Gap Analyzer (`/api/skills`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/skills/analyze` | Request Gemini skill-gap evaluation for target role | Yes (Bearer) |
| `GET` | `/api/skills` | Retrieve identified skill gaps for candidate | Yes (Bearer) |
| `PATCH` | `/api/skills/{id}/proficiency` | Update self-assessed proficiency on a specific skill gap | Yes (Bearer) |

### 5. Personalized AI Roadmaps (`/api/roadmaps`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/roadmaps/generate` | Generate weekly milestones, tasks, and portfolio project | Yes (Bearer) |
| `GET` | `/api/roadmaps` | List candidate's learning roadmaps | Yes (Bearer) |
| `GET` | `/api/roadmaps/active` | Retrieve current active roadmap with milestones and tasks | Yes (Bearer) |
| `GET` | `/api/roadmaps/{id}` | Retrieve specific roadmap by ID | Yes (Bearer) |
| `PATCH` | `/api/roadmaps/tasks/{taskId}` | Toggle task completion status; recalculates roadmap progress | Yes (Bearer) |
| `POST` | `/api/roadmaps/assistant` | Query contextual AI study tutor for task guidance & code | Yes (Bearer) |

### 6. Job Discovery & Applications (`/api/jobs`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/jobs` | Browse active job listings (supports `?search=` query) | No |
| `GET` | `/api/jobs/{id}` | Get specific job details | No |
| `POST` | `/api/jobs/{id}/apply` | Save job or update application status (*SAVED*, *APPLIED*, etc.) | Yes (Bearer) |
| `GET` | `/api/jobs/applications` | List candidate's tracked application pipeline | Yes (Bearer) |

---

## 🔒 Security & Privacy Practices

* **No Exposed Secrets:** Google Gemini API keys are read exclusively by the backend via `GEMINI_API_KEY`. No API keys or backend credentials exist in frontend code or bundles.
* **Password Hashing:** Passwords are never stored in plaintext; all user credentials use `BCryptPasswordEncoder` with secure salt generation.
* **Strict Tenant Data Isolation:** Candidate profiles, resumes, analyses, skill gaps, roadmaps, and applications are queried strictly by authenticated `userId`.
* **CORS Protection:** Configured to allow only trusted origins during development with explicit header exposure.
* **File Validation:** Document uploads are inspected for size limitations (10MB max per file, 15MB total) and verified by Apache Tika parser.

---

## 🧪 Verification & Build Status

* **Backend Compilation:** Verified (`mvnw.cmd test-compile` — **BUILD SUCCESS**).
* **Backend Test Suite:** Verified (`mvnw.cmd test` — **1 test run, 0 failures, 0 errors, 10 JPA repositories bootstrapped, H2 file database verified**).
* **Frontend Compilation:** Verified (`npm.cmd run build` — **1602 modules transformed, built in 11.02s**).

---

## 👨‍💻 Author & Engineering Credits

### PRASHANT SINGH
**M.C.A | VIT VELLORE | Java Backend Developer**  
* GitHub: [prashant0088726](https://github.com/prashant0088726)  
* LinkedIn: [Prashant singh](https://www.linkedin.com/in/prashant-singh-77a839206/)  
* LeetCode: [Prashant singh](https://leetcode.com/u/prashant8630/)  

---

<p align="center">
  <strong>SkillBridge AI</strong> &bull; Bridge Your Skills. Build Your Future.<br />
  Built with Java 21, Spring Boot, Spring Security, React 18, Apache Tika, Spring AI &amp; Google Gemini.
</p>
