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

## 7. Folder Structure (Latest)

```text
src/
├── api/
│   ├── axios.js
│   ├── auth.api.js
│   ├── admin.api.js
│   ├── dashboard.api.js
│   ├── hr.api.js
│   ├── interview.api.js
│   └── question.api.js        # [NEW] Question Bank CRUD
│
├── context/
│   └── AuthContext.jsx
│
├── hooks/
│   ├── useAuth.js
│   ├── useDashboard.js
│   └── useInterview.js        # Core logic for audio & timer
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
│       ├── Products.jsx
│       ├── About.jsx
│       └── Philosophy.jsx
│
├── app/
│   ├── layouts/
│   │   └── AppLayout.jsx
│   │
│   ├── components/
│   │   ├── sidebar/           # Sidebar.jsx
│   │   ├── topbar/            # TopBar.jsx
│   │   ├── dashboard/         # StatsGrid.jsx, ActivityList.jsx
│   │   ├── interview/         # InterviewHeader.jsx, QuestionPanel.jsx
│   │   ├── interview-summary/ # SectionFeedback.jsx
│   │   ├── candidates/        # CandidatesList.jsx, AddCandidateModal.jsx
│   │   └── questions/         # QuestionModal.jsx
│   │
│   └── pages/
│       ├── dashboard/         # Dashboard.jsx, HRDashboard.jsx
│       ├── interviews/        # InterviewSession.jsx, InterviewResult.jsx
│       ├── candidates/        # Candidates.jsx, CandidateDetails.jsx
│       ├── admin/             # AdminDashboard.jsx, Departments.jsx, HRManager.jsx
│       └── questions/         # Questions.jsx (Management Room)
│
├── styles/
│   └── globals.css            # Indigo Design System definitions
│
├── App.jsx
└── main.jsx
```

---

## 8. UX & Design System

### The Indigo Theme
The application has been synchronized with a premium **Indigo Accent** theme.
- **Glassmorphism**: High-blur panels with subtle `white/5` borders.
- **High Contrast**: Optimized accessibility for dark-theme result pages and light-theme management rooms.
- **Micro-interactions**: Uses `framer-motion` for page transitions and interactive hover states.

---

## 9. Interview Session Mechanics

The interview room is a focus-oriented environment featuring:
1. **Audio Integrity Check**: Verifies microphone presence before starting.
2. **Dynamic Questioning**: Injects a mix of AI-generated and Bank-saved questions.
3. **Automated Submission**: Audio blobs are sent to Cloudinary, then analyzed by **Gemini 2.5 Flash** for native audio-to-JSON scoring.

---

## 10. Role-Based Capabilities

### Admin
- **Global Visibility**: Full access to all departments and interviews.
- **HR Management**: Create/Edit/Delete HR Manager accounts.
- **Department Management**: Scale the organization structure.

### HR Manager
- **Department Isolation**: Can only manage candidates within their assigned department.
- **Candidate Hub**: Bulk add candidates and track interview status.
- **Question Customization**: Manage the departmental "Question Bank" to influence AI interviewer behavior.

### Candidate
- **Zero Configuration**: Simply login and start the assessment.
- **Instant Results**: Access the **Interview Report** immediately after AI analysis.

---

## 11. Deployment & Optimization

- **Vercel Pipeline**: Fully optimized for `vite` deployment.
- **SPA Routing**: Handled via `vercel.json` rewrites.
- **Cookie Security**: Configured to work with `withCredentials: true` and `sameSite: "None"` for cross-domain auth reliability.

---

> This README is kept in sync with the live frontend implementation.