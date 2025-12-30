# AI Interview Platform – Frontend Architecture & Design (README)

> **Scope:** Frontend-only documentation for the AI Interview Platform.
> **Stack:** React (Vite) + JSX + Tailwind CSS + Framer Motion
> **Audience:** Frontend developers, full‑stack MERN developers, reviewers

---

## 1. Project Overview

This frontend is a **modern, role‑based SaaS application** designed for an AI‑powered interview platform. The UI emphasizes **clarity, calmness, and focus**, inspired by tools like **Notion** and **Linear**.

The application has **two major surfaces**:

1. **Marketing Website (Public)** – company‑first branding
2. **Application Interface (Authenticated)** – role‑based workflows

Backend logic is intentionally decoupled and consumed via REST APIs.

---

## 2. Design Principles

### Visual Style

* **Glassmorphism** for emphasis surfaces
* Soft borders, subtle shadows
* Editorial spacing (generous whitespace)
* Minimal visual noise

### UX Philosophy

* Content over decoration
* Calm dashboards (no chart overload)
* Focus‑first interview experience
* Clear role separation (Admin / HR / Candidate)

### Accessibility

* High contrast text
* Large click targets
* Keyboard‑safe navigation
* Mobile‑first responsiveness

---

## 3. Technology Stack (Frontend Only)

| Layer        | Technology       |
| ------------ | ---------------- |
| Framework    | React 18 (Vite)  |
| Styling      | Tailwind CSS     |
| Animations   | Framer Motion    |
| Routing      | React Router DOM |
| State (Auth) | React Context    |
| HTTP         | Axios            |
| Environment  | Vite `.env`      |
| Deployment   | Vercel           |

---

## 4. High‑Level Architecture

```
Browser
  ↓
React App (Vite)
  ↓
React Router (SPA)
  ↓
AuthContext (role + status)
  ↓
ProtectedRoute (logic enforcement)
  ↓
Pages → Components → UI Primitives
```

**Golden Rule:**

> UI components never call APIs directly. Only hooks/pages do.

---

## 5. User Roles & Flow

### Roles

* **Admin** – system‑wide control
* **HR** – department‑scoped control
* **Candidate (Student)** – interview participant

---

### Candidate Flow

```
Login
  ↓
Profile Fetch (/auth/profile)
  ↓
interviewStatus === NOT_STARTED
  → Interview Session
  → Submit Interview
  → interviewStatus === COMPLETED
  ↓
Result Page
```

**Key Rule:** Candidate can interview **only once**.

---

### HR Flow

```
Login
  ↓
Profile Fetch (role=hr, departmentId)
  ↓
HR Dashboard (Dept‑Scoped)
  ↓
Manage Candidates
  ↓
View Interview History (Dept Only)
```

---

### Admin Flow

```
Login
  ↓
Profile Fetch (role=admin)
  ↓
Admin Dashboard
  ↓
Manage Departments
Manage HRs
Manage Candidates
View All Interviews
```

---

## 6. Routing & Auth Logic

### Authentication Strategy

* JWT stored in **httpOnly cookies**
* `AuthContext` fetches `/auth/profile` on app load
* No token stored in localStorage

### Route Guarding

**ProtectedRoute enforces:**

1. Authentication
2. Role authorization
3. Business rules (interview completion)

---

## 7. Folder Structure (Final)

```
src/
├── api/
│   ├── axios.js
│   ├── auth.api.js
│   ├── dashboard.api.js
│   └── interview.api.js
│
├── context/
│   └── AuthContext.jsx
│
├── routes/
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
│
├── shared/
│   └── ui/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── GlassPanel.jsx
│       └── index.js
│
├── marketing/
│   ├── pages/
│   │   ├── Landing.jsx
│   │   └── Login.jsx
│   └── sections/
│       ├── Hero.jsx
│       ├── WhatWeBuild.jsx
│       ├── Products.jsx
│       └── Careers.jsx
│
├── app/
│   ├── layouts/
│   │   └── AppLayout.jsx
│   │
│   ├── components/
│   │   ├── sidebar/
│   │   │   └── Sidebar.jsx
│   │   ├── topbar/
│   │   │   └── TopBar.jsx
│   │   ├── dashboard/
│   │   │   ├── StatsGrid.jsx
│   │   │   └── ActivityList.jsx
│   │   └── interview/
│   │       ├── InterviewHeader.jsx
│   │       ├── QuestionPanel.jsx
│   │       ├── ProgressIndicator.jsx
│   │       └── ControlBar.jsx
│   │
│   └── pages/
│       ├── dashboard/
│       │   └── Dashboard.jsx
│       ├── interviews/
│       │   ├── InterviewSession.jsx
│       │   └── InterviewResult.jsx (pending)
│       ├── candidates/
│       │   └── Candidates.jsx (pending)
│       └── admin/
│           └── AdminDashboard.jsx (pending)
│
├── styles/
│   └── globals.css
│
├── App.jsx
└── main.jsx
```

---

## 8. Wireframe Summary (Textual)

### Marketing Landing

* Hero (value proposition)
* What We Build
* Products
* Careers
* Footer

### App Layout

```
Sidebar | TopBar
----------------
Main Content
```

### Interview Session (Focus Mode)

```
Interview Header (Role + Timer)

Glass Question Panel

Progress Indicator

Control Bar (Next / Submit)
```

---

## 9. Component Mapping

### Shared UI

* `Button` – primary / secondary / ghost
* `Card` – neutral surfaces
* `GlassPanel` – emphasis surfaces

### Layout

* `AppLayout`
* `Sidebar`
* `TopBar`

### Interview

* `InterviewSession`
* `InterviewHeader`
* `QuestionPanel`
* `ProgressIndicator`
* `ControlBar`

### Dashboards

* `Dashboard` (generic base)
* `AdminDashboard` (pending)
* `HRDashboard` (pending)

---

## 10. State & Data Flow

```
AuthContext
  ↓
ProtectedRoute
  ↓
Page Component
  ↓
Hook (API call)
  ↓
Render UI
```

---

## 11. Deployment Notes (Frontend)

* Deployed on **Vercel**
* Requires `vercel.json` for SPA routing
* Requires backend with:

  * CORS enabled
  * `sameSite: 'None'` cookies

---

## 12. Current Status

### Completed

* Marketing website
* App shell
* Auth & routing logic
* Interview session UI
* Shared design system
* Candidate Result page
* HR Dashboard
* Admin Dashboard & HR Manager
* Candidate Management (Admin/HR)
* Interview history details
* Mobile Responsiveness & Layout Polish
* Advanced animations (Micro-interactions)

### Pending

* None (Ready for Launch 🚀)

---

## 13. Next Steps

1. Final end-to-end testing
2. Deployment to production environment
3. Gather user feedback for V2

---

> This README documents the **entire frontend architecture and design system** and is safe to share with developers, reviewers, or maintainers.