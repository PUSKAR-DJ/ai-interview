# 🚀 AI-Powered Interview & Assessment Platform

**An automated recruitment solution that leverages Multimodal AI to conduct, analyze, and score technical interviews at scale.**

---

## 📖 Executive Summary

This platform streamlines the recruitment process by automating the first round of technical interviews. Instead of scheduling synchronous calls, candidates complete a voice-based assessment. The system utilizes **Google's Gemini 2.5 Flash** to analyze audio responses natively (without traditional speech-to-text), providing HR teams with deep insights into a candidate's technical accuracy and communication style.

---

## ✨ Key Features

### 🏢 For HR & Admins

* **Bulk Candidate Onboarding:** Invite hundreds of candidates instantly via CSV upload (Email, Name, Job Role).


* **AI-Driven Dashboards:** View automated summaries, technical scores (1-10), and behavioral keywords for every applicant.


* **Secure Playback:** Listen to candidate audio responses via secure, time-limited signed URLs.



### 🎤 For Candidates

* **Seamless Interface:** A clean, step-by-step interview wizard with audio system checks.


* **Voice-First Assessment:** Answer questions naturally using voice recording.



### 🛡️ Security & Integrity

* **Anti-Cheating Mechanisms:** Monitors tab switching and enforces full-screen mode during interviews.


* **Role-Based Access Control:** Strict data isolation ensures Candidates only see their session, and HR only sees assigned data.



---

## 🛠️ Technical Architecture

### Core Stack 

* **Frontend:** React.js + Tailwind CSS (Glassmorphism UI).
* **Backend:** Node.js + Express.js.
* **Database:** MongoDB (Mongoose ODM).
* **Authentication:** JWT (Stateless).

### AI & Cloud Pipeline

1. **Audio Capture:** Frontend records audio blobs.
2. **Storage:** Audio is uploaded to **Cloudinary**.
3. **Processing:** The backend fetches the file, converts it to Base64, and sends it to **Gemini 2.5 Flash** with a structured system prompt.
4. **Analysis:** Gemini returns a JSON object containing the transcript summary, score, and keywords.

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* MongoDB Atlas Account
* Google Cloud Platform Account (Gemini API Key)
* Cloudinary Account

### 1. Clone the Repository

```bash
git clone https://github.com/PUSKAR-DJ/ai-interview.git
cd ai-interview

```

### 2. Backend Setup

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secure_secret
GEMINI_API_KEY=your_google_gemini_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

```

Start the server:

```bash
npm run dev

```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev

```

---

## 📂 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── controllers/   # Logic for Auth, Admin, Candidate, HR
│   │   ├── models/        # Mongoose Schemas 
│   │   ├── services/      # Gemini AI & Cloudinary Services
│   │   └── routes/        # API Endpoints
|
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI (Recorders, Tables)
│   │   └── pages/         # Landing, Dashboard, Interview Room

```

---

## 🤖 AI System Prompting

We utilize a specific prompt structure to ensure consistent JSON output from Gemini:

> "You are an expert technical interviewer. Listen to the attached audio response... Output a JSON object containing: transcript_summary, technical_accuracy (1-10), communication_style, and keywords_detected." 

---

## 👥 Contributors

* [Raj Sharma](https://github.com/rajsha10)
* [Subhadip Mandal](https://github.com/Subhadip1001)
* [Pronay Sarkar](https://github.com/PronaySarkar)
* [Puskar Saha](https://github.com/PUSKAR-DJ)
