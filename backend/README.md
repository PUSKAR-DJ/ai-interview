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

> **Note:** The current implementation uses a unified `User` model with roles and a specific `Question` bank for department-specific assessments.

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

---

### 6.3 Interview Model

```js
Interview {
  candidateId: ObjectId (unique),
  departmentId: ObjectId,
  hrId: ObjectId (optional),
  status: 'IN_PROGRESS' | 'COMPLETED',
  questions: [], // Mixed AI and DB questions
  messages: [],  // Full conversation transcript
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

### 6.4 Question Model

```js
Question {
  text: String,
  departmentId: ObjectId,
  difficulty: 'Easy' | 'Medium' | 'Hard',
  createdBy: ObjectId,
  createdAt
}
```

---

## 7. Authentication & Authorization Flow

### 7.1 Login Flow

```
POST /api/auth/login
 → Validate credentials
 → Sign JWT { id, role, departmentId }
 → Set httpOnly cookie (token)
```

Cookie configuration:

```js
httpOnly: true
secure: true
sameSite: 'None'
```

---

### 7.2 Profile Fetch

```
GET /api/auth/profile
 → JWT verified
 → Return user data with populated department
```

---

## 8. Backend Folder Structure (Current)

```text
backend/
├── src/
│   ├── app.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── hrController.js
│   │   ├── interviewController.js
│   │   └── questionController.js
│   │
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── roleMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Department.js
│   │   ├── Interview.js
│   │   └── Question.js
│   │
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── hrRoutes.js
│   │   ├── interviewRoutes.js
│   │   └── questionRoutes.js
│   │
│   ├── services/
│   │   └── geminiService.js   # AI Analysis & Question Generation
│   │
│   └── utils/
│       └── csvParser.js
│
├── server.js                  # Entry Point
├── .env
├── package.json
└── README.md
```

---

## 9. Middleware Responsibilities

### Auth Middleware
* Verifies JWT from cookies
* Populates `req.user` with department data

### Role Middleware
* `isAdmin`, `isHR`, `isCandidate`

### Upload Middleware
* Handles multi-part file uploads (Audio) via Cloudinary

---

## 10. API Routes & Responsibilities

### 10.1 Auth Routes (`/api/auth`)

| Method | Route     | Description                    |
| ------ | --------- | ------------------------------ |
| POST   | /register | Create user (Admin/HR/Student) |
| POST   | /login    | Login & set secure cookie      |
| POST   | /logout   | Clear secure cookie            |
| GET    | /profile  | Return authenticated user profile|

---

### 10.2 Admin Routes (`/api/admin`)

| Method | Route           | Description                 |
| ------ | --------------- | --------------------------- |
| GET    | /overview       | Global platform stats       |
| GET    | /departments    | List all departments        |
| POST   | /departments    | Create new department       |
| GET    | /users          | List all internal users     |
| PUT    | /users/:id      | Update HR/Staff details     |

---

### 10.3 HR Routes (`/api/hr`)

| Method | Route           | Description              |
| ------ | --------------- | ------------------------ |
| GET    | /candidates     | List dept candidates     |
| POST   | /candidates     | Create new candidate     |
| PUT    | /candidates/:id | Update candidate data    |
| DELETE | /candidates/:id | Remove candidate         |

---

### 10.4 Interview Routes (`/api/interview`)

| Method | Route           | Description                     |
| ------ | --------------- | ------------------------------- |
| POST   | /generate-questions | Get dynamic AI+DB quiz set  |
| POST   | /submit         | Process audio & AI Analysis     |
| GET    | /me             | Candidate result & transcript   |
| GET    | /candidate/:id  | HR/Admin view candidate report  |

---

### 10.5 Question Routes (`/api/questions`)

| Method | Route           | Description                    |
| ------ | --------------- | ------------------------------ |
| GET    | /               | List questions (Dept-scoped for HR)|
| POST   | /               | Add new technical question     |
| PUT    | /:id            | Edit question details          |
| DELETE | /:id            | Remove question from bank      |

---

## 11. Interview Lifecycle Enforcement

```
NOT_STARTED 
  → /generate-questions 
  → IN_PROGRESS 
  → /submit 
  → COMPLETED
```

AI analysis is triggered automatically upon submission, performing native audio analysis using **Gemini 2.5 Flash**.

---

## 12. Deployment

* Powered by **Vercel** (Serverless Functions)
* Database on **MongoDB Atlas**
* Asset storage on **Cloudinary**

---

> This README is kept in sync with the live backend implementation.
