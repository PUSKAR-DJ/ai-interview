# AI Interview Platform – Backend Architecture & API (README)

> **Scope:** Backend-only documentation for the AI Interview Platform
> **Stack:** Node.js + Express + MongoDB (Mongoose)
> **Auth:** JWT (httpOnly cookies)
> **API Style:** REST
> **Audience:** Backend developers, full‑stack developers, reviewers

---

## 1. Backend Overview

The backend is designed as a **secure, role-driven REST API** that acts as the **single source of truth** for authentication, authorization, interview lifecycle enforcement, and data scoping.

Key responsibilities:

* Enforce **role-based access** (Admin / HR / Candidate)
* Enforce **one-interview-per-candidate** rule
* Scope HR access strictly to their **department**
* Provide clean, predictable APIs for frontend consumption

The frontend never decides business rules — it only reacts to backend state.

---

## 2. Core Design Principles

1. **Backend is authoritative** – frontend cannot override rules
2. **JWT via httpOnly cookies** – no tokens in JS
3. **Department-level data isolation** for HR
4. **Interview lifecycle is state-driven**
5. **Pragmatic architecture** – business logic currently resides in controllers for simplicity

---

## 3. Technology Stack (Backend)

| Layer            | Technology                |
| ---------------- | ------------------------- |
| Runtime          | Node.js                   |
| Framework        | Express.js                |
| Database         | MongoDB                   |
| ODM              | Mongoose                  |
| Authentication   | JWT                       |
| Password Hashing | bcrypt                    |
| CORS             | cors middleware           |
| Deployment       | Vercel / Render / Railway |

---

## 4. High-Level Architecture

```
Client (Browser)
   ↓
Express API
   ↓
Auth Middleware (JWT)
   ↓
Role Middleware (Admin / HR / Student)
   ↓
Controllers
   ↓
Services (Business Rules)
   ↓
Mongoose Models
   ↓
MongoDB
```

---

## 5. User Roles

### Roles Defined

* `admin` – system-wide control
* `hr` – department-scoped control
* `student` – interview participant

Role information is embedded in the JWT payload and revalidated per request.

---

## 6. Data Models (Schemas)

> **Note:** The current implementation uses a simplified model set. Legacy models such as `Job` and `Candidate` have been deprecated in favor of a unified `User` model (role-based).

### 6.1 User Model

```js
User {
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'admin' | 'hr' | 'student',
  departmentId: ObjectId | null,
  interviewStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED',
  createdAt
}
```

**Rules:**

* `admin` → no department
* `hr` → department required
* `student` → department required

---

### 6.2 Department Model

```js
Department {
  name: String (unique),
  createdAt
}
```

> Departments currently store only the department name. Ownership/audit fields (e.g., `createdBy`) can be added later if multi-admin auditing is required.

---

### 6.3 Interview Model

```js
Interview {
  candidateId: ObjectId (unique),
  departmentId: ObjectId,
  hrId: ObjectId (optional),
  status: 'IN_PROGRESS' | 'COMPLETED',
  questions: [],
  remarks: [],
  feedback: String,
  audioUrl: String,
  score: Number,
  createdAt,
  completedAt
}
```

**DB Constraint:**

* One interview per candidate (unique index on `candidateId`)

---

## 7. Authentication & Authorization Flow

### 7.1 Login Flow

```
POST /api/auth/login
 → Validate credentials
 → Sign JWT { id, role }
 → Set httpOnly cookie (token)
```

Cookie configuration:

```js
httpOnly: true
secure: true
sameSite: 'None'
```

---

### 7.2 Profile Fetch (Critical Endpoint)

```
GET /api/auth/profile
 → JWT verified
 → Return role, departmentId, interviewStatus
```

This endpoint drives **all frontend routing decisions**.

---

## 8. Backend Folder Structure (Current)

```
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── config/
│   │   ├── db.js
│   │   └── jwt.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Department.js
│   │   └── Interview.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── admin.controller.js
│   │   ├── hr.controller.js
│   │   └── interview.controller.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── admin.routes.js
│   │   ├── hr.routes.js
│   │   └── interview.routes.js
│   │
│   └── utils/
│       └── logger.js
│
├── .env
├── package.json
└── README.md
```

> **Note:** Business logic is intentionally kept inside controllers for clarity and simplicity. A `services/` layer can be introduced later if complexity increases.

---

## 9. Middleware Responsibilities

### Auth Middleware

* Verifies JWT
* Attaches `req.user`

### Role Middleware

* `isAdmin`
* `isHR`
* `isStudent`

### Department Guard

* Ensures HR only accesses their department

---

## 10. API Routes & Responsibilities

### 10.1 Auth Routes (`/api/auth`)

| Method | Route     | Description                    |
| ------ | --------- | ------------------------------ |
| POST   | /register | Create user (Admin/HR/Student) |
| POST   | /login    | Login & set cookie             |
| POST   | /logout   | Clear cookie                   |
| GET    | /profile  | Return role + interviewStatus  |

---

### 10.2 Admin Routes (`/api/admin`)

| Method | Route           | Description                 |
| ------ | --------------- | --------------------------- |
| GET    | /overview       | Global stats                |
| POST   | /departments    | Create department           |
| GET    | /departments    | List departments            |
| POST   | /users          | Create HR / Student         |
| GET    | /users          | List users                  |
| GET    | /interviews/:id | Candidate interview history |

---

### 10.3 HR Routes (`/api/hr`)

| Method | Route           | Description              |
| ------ | --------------- | ------------------------ |
| GET    | /overview       | Dept dashboard           |
| POST   | /candidates     | Create candidate         |
| GET    | /candidates     | List dept candidates     |
| DELETE | /candidates/:id | Remove candidate         |
| GET    | /interviews/:id | Interview history (dept) |

---

### 10.4 Interview Routes (`/api/interview`)

| Method | Route           | Description      |
| ------ | ------- | ---------------- |
| POST   | /start  | Start interview  |
| POST   | /submit | Submit interview |
| GET    | /me     | Candidate result |

---

## 11. Interview Lifecycle Enforcement

```
NOT_STARTED
  ↓ (POST /start)
IN_PROGRESS
  ↓ (POST /submit)
COMPLETED
```

Backend blocks:

* Starting interview twice
* Submitting without start
* Accessing others' interviews

---

## 12. Error Handling Strategy

* Central error middleware
* Consistent JSON errors
* 401 → Auth errors
* 403 → Authorization errors
* 404 → Resource not found

---

## 13. Security Considerations

* No JWT in localStorage
* CORS restricted to frontend domain
* Cookies marked `secure` + `sameSite=None`
* Role + department enforced server-side

---

## 14. Deployment Notes

* Backend must be HTTPS
* CORS origin must match frontend exactly (no trailing slash)
* Preflight (`OPTIONS`) must be allowed

---

## 15. Current Backend Status

### Implemented

* Auth & role enforcement (Admin / HR / Student)
* Department-scoped HR access
* Interview lifecycle enforcement (single interview per candidate)
* Admin & HR APIs aligned with frontend routing logic

### Cleaned / Deprecated

* Legacy models such as `Job` and `Candidate` have been removed.
* Unused services (`geminiService.js`, `cloudinaryService.js`) have been removed for simplicity.

### Possible Future Enhancements

* Introduce a `services/` layer if business logic grows
* Add audit fields (e.g., `createdBy`) to Department
* Refresh tokens & rate limiting

---

> This README now reflects the **current backend implementation accurately**, without idealized layers that are not yet present.
