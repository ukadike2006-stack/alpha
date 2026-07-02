# ALPHA Platform — Digital Entrepreneurship Ecosystem
### Nigerian British University — COS 309 | Stanford & Shawn

ALPHA is a production-grade full-stack digital entrepreneurship ecosystem designed to connect African early-stage founders (0–5 years in business) with funding opportunities, investors, and mentors.

The project features a **Next.js 14** frontend and a **Spring Boot 3** REST API backend, architected for high performance, security, and scalability.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14 (App Router), TypeScript, Tailwind CSS, Axios |
| **Backend** | Spring Boot 3.2.5, Java 21, Spring Security + JWT |
| **Database** | PostgreSQL (Production via Supabase) / H2 (Development) |
| **Auth** | JWT (jjwt 0.12.5) with BCrypt hashing |
| **Deployment** | Vercel (Frontend), Railway (Backend), Supabase (Database) |

---

## Architecture Overview

```
┌────────────────────────────────────────────────────────────┐
│                    ALPHA Platform Stack                    │
├──────────────────┬──────────────────┬──────────────────────┤
│  VERCEL          │  RAILWAY         │  SUPABASE            │
│  Next.js 14      │  Spring Boot 3   │  PostgreSQL DB       │
│  (Frontend/UI)   │  (REST API)      │  (Managed Database)  │
└──────────────────┴──────────────────┴──────────────────────┘
```

---

## Features

- **Automated Eligibility Engine:** 10-point TEF-aligned compliance checks.
- **Intelligent Matching:** Scored algorithm (max 100 pts) matching founders to funding.
- **Role-Based Access:** FOUNDER, INVESTOR, MENTOR, and ADMIN dashboards.
- **Messaging:** Built-in platform communication between ecosystem stakeholders.
- **Application Tracking:** Real-time status updates from DRAFT to FUNDED.

---

## Getting Started (Local Development)

### 1. Prerequisites
- Java 21+
- Node.js 20+
- Maven 3.8+

### 2. Running the Backend
```bash
cd backend
mvn spring-boot:run
# API available at http://localhost:8080
```

### 3. Running the Frontend
```bash
cd frontend
npm install
npm run dev
# UI available at http://localhost:3000
```

---

## Deployment Guide

### Vercel (Frontend)
- Link your repository to [Vercel](https://vercel.com/ukadike2006-stacks-projects).
- Set the root directory to `frontend`.
- Environment Variable: `NEXT_PUBLIC_API_URL` (your backend URL).

### Railway (Backend)
- Deploy the `backend` folder to Railway.
- Railway will automatically detect the `Dockerfile` and `railway.json`.
- Configure Environment Variables (see `backend/src/main/resources/application.properties`).

---

## Demo Test Credentials

| Role | Email | Password |
|---|---|---|
| ADMIN | `admin@alpha.com` | `Admin@1234` |
| INVESTOR | `investor@alpha.com` | `Invest@1234` |
| MENTOR | `mentor@alpha.com` | `Mentor@1234` |
| FOUNDER | `founder@alpha.com` | `Found@1234` |

---

## Project Structure

```
alpha/
├── backend/            # Spring Boot REST API
│   ├── Dockerfile      # Railway deployment
│   ├── src/            # Java source code
│   └── pom.xml         # Maven configuration
└── frontend/           # Next.js 14 Application
    ├── src/app/        # App Router pages
    ├── src/components/ # UI components
    └── package.json    # Node dependencies
```
