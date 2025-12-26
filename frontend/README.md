# AI Hiring Platform – Frontend

A modern, **Notion-inspired, glassmorphic frontend** for a hiring technology company.
This repository contains **frontend-only** code built with **React (Vite), JSX, Tailwind CSS, and Framer Motion**.

---

## 🧠 Project Philosophy

* **Company-first marketing website**

  * The landing page markets the **company & vision**, not just a single AI product.
  * The AI Interview Platform is positioned as **one product in a larger ecosystem**.

* **Calm, editorial UI**

  * Inspired by **Notion, Linear, and Stripe**
  * Minimal, content-first, and highly readable
  * Subtle glassmorphism (not flashy “AI glow”)

* **Developer-friendly**

  * MERN-oriented structure
  * JSX (no TypeScript lock-in)
  * Simple, readable folders
  * Easy to extend later with APIs

---

## 🎨 Design System (High-Level)

* **Style:** Editorial Glass (Notion-inspired)
* **UI Pattern:** Glassmorphism (used subtly)
* **Typography:** Inter / Plus Jakarta Sans (clean sans-serif)
* **Motion:** Minimal micro-interactions via Framer Motion
* **Responsiveness:** Mobile-first, fully responsive

Glass effects are used mainly for:

* Navbar
* Cards
* App panels
* Modals

---

## 🧱 Tech Stack

* **Framework:** React (Vite)
* **Language:** JavaScript (JSX)
* **Styling:** Tailwind CSS
* **Animation:** Framer Motion
* **Routing:** React Router 

---

## 📁 Folder Structure

```
src/
│
├── app/                     # App (post-login) UI
│   ├── layouts/
│   │   ├── AppLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   │
│   │   ├── interviews/
│   │   │   ├── InterviewsList.jsx
│   │   │   ├── InterviewSession.jsx
│   │   │   └── InterviewSummary.jsx
│   │   │
│   │   ├── candidates/
│   │   │   └── Candidates.jsx
│   │   │
│   │   └── settings/
│   │       └── Settings.jsx
│   │
│   └── components/
│       ├── sidebar/
│       ├── topbar/
│       ├── cards/
│       ├── tables/
│       └── modals/
│
├── marketing/               # Public-facing company website
│   ├── pages/
│   │   └── Landing.jsx
│   │
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── WhatWeDo.jsx
│   │   ├── Products.jsx
│   │   ├── WhyUs.jsx
│   │   ├── About.jsx
│   │   └── Careers.jsx
│   │
│   └── components/
│       ├── Navbar.jsx
│       └── Footer.jsx
│
├── shared/                  # Reusable UI & design system
│   ├── ui/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── GlassPanel.jsx
│   │   └── Badge.jsx
│   │
│   ├── motion/
│   │   └── animations.js
│   │
│   └── typography/
│       └── Text.jsx
│
├── routes/
│   └── AppRoutes.jsx
│
├── styles/
│   └── globals.css
│
├── assets/
│   ├── logos/
│   └── icons/
│
├── App.jsx
└── main.jsx
```

---

## 🧭 Application Structure Overview

### 1. Marketing Website (`/marketing`)

* Company vision & positioning
* Product overview (AI Interview Platform shown as one product)
* About, Careers, Trust sections
* Calm, editorial layout

### 2. Application UI (`/app`)

* Dashboard (Admin / HR / Candidate views – UI only)
* Interviews list & interview session screens
* Candidate management UI
* Settings & profile pages

---