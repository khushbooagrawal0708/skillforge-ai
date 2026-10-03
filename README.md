# SkillForge AI • Adaptive Psychometric Learning & Exam Generator

SkillForge is a full-stack, AI-powered adaptive exam engine designed to assess technical mastery with precision. Built using modern **React (Vite + Tailwind CSS)** and a **Node.js/Express** backend, SkillForge pairs **Item Response Theory (IRT 2PL)** with **Google Gemini AI** to deliver personalized diagnostic assessments that adapt in real time.

---

## ⚡ Key Architectural Features

### 1. Item Response Theory (IRT 2-Parameter Logistic Model)
Traditional exams assign a fixed list of static questions. SkillForge dynamically calibrates test items to each student's latent ability ($\theta$):
* **Probability Model**:
  $$P_i(\theta) = \frac{1}{1 + e^{-D \cdot a_i \cdot (\theta - b_i)}}$$
  where $a_i$ is question discrimination power, $b_i$ is difficulty, and $D = 1.702$.
* **Maximum Fisher Information (MFI) Selection**:
  $$I_i(\theta) = D^2 \cdot a_i^2 \cdot P_i(\theta) \cdot (1 - P_i(\theta))$$
  The engine dynamically queries or synthesizes candidate questions that maximize diagnostic information at the student's current proficiency level.
* **Bayesian Maximum A Posteriori (MAP) Updating**:
  Latent ability $\theta$ is continuously updated after every single response, factoring in standard error of measurement (SEM) and confidence intervals ($[\theta - 1.96 \cdot \text{SEM}, \theta + 1.96 \cdot \text{SEM}]$).

### 2. Hybrid AI & Psychometric Fallback Architecture
* **Google Gemini Integration**: Dynamically generates novel technical questions calibrated to exact target difficulty parameters and cognitive levels across Bloom's Taxonomy (*Remember, Understand, Apply, Analyze, Evaluate*).
* **Zero-Setup Offline Fallback**: If an API key is not provided, the application runs on a pre-calibrated bank of 25+ psychometrically verified questions and procedural algorithmic generators—guaranteeing 100% operational uptime without API dependencies.
* **In-App API Key Manager**: Allows users to enter or test their Gemini API key with live server verification directly from the UI.

### 3. Real-Time Test Taking Experience
* **Live Dynamic Ability Gauge**: Interactive visual HUD displaying ability updates ($\theta \in [-3.0, +3.0]$), difficulty tiers (*Novice*, *Developing*, *Competent*, *Proficient*, *Master*), and SEM.
* **Timed Mode & Instant Explanations**: Configurable per-question countdown timer (60s) with auto-submission and deep architectural rationales.
* **Bloom's Cognitive Indicator**: Identifies the cognitive depth of every problem in real time.

### 4. Post-Exam Analytics & Remediation Dashboard
* **Dynamic Trajectory Graph**: Visual step-by-step curve showing how difficulty adapted to the user's answers.
* **Cognitive Bloom Breakdown**: Accuracy across *Remembering*, *Understanding*, *Applying*, *Analyzing*, and *Evaluating*.
* **Skill Mastery Breakdown**: Proficiency ratings across tested subtopics.
* **AI Remediation Roadmap**: Actionable 3-step study plan with recommended practice tasks and estimated hours to mastery.
* **Psychometric Item Audit**: Complete accordion review of all questions, user choices, time spent, and architectural explanations.
* **Print & Export Support**: Printable diagnostic assessment report.

---

## 🛠️ Tech Stack

* **Frontend**: React 19, Vite 8, Tailwind CSS v4, Lucide React, Canvas Confetti.
* **Backend**: Node.js (v24), Express, `@google/generative-ai`, UUID.
* **Persistence**: In-memory session database with JSON file backup (`sessions_store.json`).

---

## 🚀 Getting Started

The project is located at:
```
C:\Users\HP\.gemini\antigravity\scratch\skillforge-ai
```

### 1. Running the Backend
From the `backend` folder:
```powershell
cd backend
npm run dev
```
Backend runs at `http://localhost:5000`.

### 2. Running the Frontend
From the `frontend` folder:
```powershell
cd frontend
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 3. Running with Gemini API (Optional)
To enable live dynamic question generation with Google Gemini:
* Create a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
* Either add `GEMINI_API_KEY=your_key_here` to `backend/.env`, or enter your key directly in the web app by clicking the **"API Key"** button in the top navigation bar.

---

## 📂 Project Directory Structure

```
skillforge-ai/
├── backend/
│   ├── package.json
│   └── src/
│       ├── server.js               # Express server entrypoint
│       ├── config.js               # Port and Gemini API configuration
│       ├── routes/
│       │   └── exams.js            # Exam sessions, grading, and history endpoints
│       ├── services/
│       │   ├── adaptiveEngine.js   # IRT 2PL psychometric engine & Bayesian estimator
│       │   ├── geminiService.js    # Gemini AI question generator & fallback synthesizer
│       │   ├── analyticsService.js # Bloom breakdown, trajectory, and skill metrics
│       │   └── questionBank.js     # Calibrated multi-domain item bank
│       └── store/
│           └── inMemoryDb.js       # Session database with JSON file persistence
├── frontend/
│   ├── package.json
│   ├── vite.config.js             # Vite configuration with proxy to backend (port 5000)
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                # Root app state machine
│       ├── index.css              # Tailwind CSS styles and glassmorphism utilities
│       ├── services/
│       │   └── api.js             # Frontend API client
│       └── components/
│           ├── Navbar.jsx               # Header with connection badge & controls
│           ├── ExamConfigurator.jsx     # Topic selection & parameter setup
│           ├── ActiveExamHUD.jsx        # Real-time difficulty & ability gauge
│           ├── QuestionCard.jsx         # Question display, code snippet & hints
│           ├── ExamResultsDashboard.jsx # Trajectory chart, Bloom & AI remediation
│           ├── ApiKeyModal.jsx          # Gemini API key configuration
│           └── ExamHistoryModal.jsx     # Past attempt history
└── README.md
```
