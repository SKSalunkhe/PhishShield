# 🛡️ PhishShield AI — Vernacular Phishing Detection

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-00e5b8.svg)](https://opensource.org/licenses/ISC)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933.svg?logo=node.js)](https://nodejs.org/)
[![Framework: Express](https://img.shields.io/badge/Framework-Express.js%20v5-blue.svg)](https://expressjs.com/)
[![AI Engine: Groq Llama 3.3](https://img.shields.io/badge/AI-Groq%20Llama%203.3%2070B-ffaa00.svg)](https://groq.com/)
[![DB: Supabase](https://img.shields.io/badge/Database-Supabase-3ecf8e.svg)](https://supabase.com/)
[![Extension: Chrome MV3](https://img.shields.io/badge/Extension-Chrome%20MV3-4285F4.svg?logo=googlechrome)](https://developer.chrome.com/docs/extensions/mv3/)

**An AI-powered, multilingual cybersecurity platform that detects phishing scams targeting Indian citizens — in real-time, across text, audio, and URLs.**

*Built for a Hackathon by a team of 4 | Production Ready 🚀*

</div>

---

## 📖 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Key Features](#-key-features)
- [How It Works](#-how-it-works)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#%EF%B8%8F-installation--setup)
- [Browser Extension Setup](#-browser-extension-setup)
- [API Reference](#-api-reference)
- [Supported Languages](#-supported-languages)
- [Risk Level System](#-risk-level-system)
- [Security & Privacy](#-security--privacy)
- [Project Status](#-project-status)
- [Team](#-team)
- [License](#-license)

---

## 🌐 Overview

India loses **₹1.25 lakh crore annually** to cyber fraud. Over 92% of Indians receive phishing attempts monthly — delivered through WhatsApp, SMS, and phone calls — increasingly in **regional languages** that traditional antivirus tools cannot understand.

**PhishShield AI** is built to close this gap. It combines:
- A **3-layer detection engine** (hard-coded rules → keyword patterns → Groq Llama 3.3 LLM)
- Support for **9+ Indian languages** (Hindi, Marathi, Tamil, Bengali, Telugu, Punjabi, Gujarati, Malayalam, English)
- A **Chrome Extension** for real-time browser protection
- A **full web dashboard** with scan history, charts, and downloadable PDF reports

---

## 🎯 Live Demo

```bash
npm install && npm start
# → Open http://localhost:3000
```

---

## ✨ Key Features

### 🔍 3-Layer Threat Detection Engine
| Layer | Method | Speed | Coverage |
|-------|--------|-------|----------|
| 1 — Hard Pre-check | Exact phrase matching (OTP, PIN, bank details) | Instant | High-confidence threats |
| 2 — Pattern Pre-check | Keyword / scam-pattern matching (KYC, click links, loan offers) | Instant | Suspicious patterns |
| 3 — Groq LLM | Llama 3.3 70B semantic analysis | ~500ms | Complex/novel threats |

### 🌍 Multilingual Semantic Analysis
Detects scam intent across **9+ Indian languages**:
- English, Hindi, Marathi, Tamil, Bengali, Telugu, Punjabi, Gujarati, Malayalam
- Language is **auto-detected** from input — no user selection required
- Vernacular-specific threat phrases and OTP/PIN request patterns per language

### 🎙️ Audio Scam Intelligence
- Upload call recordings (`.mp3`, `.wav`, `.ogg`, etc.)
- Keyword extraction from filenames and mock transcript analysis
- Detects high-risk audio indicators: OTP requests, bank impersonation, loan fraud

### 🔗 Brand Spoof / URL Intelligence
- Detects impersonation of major Indian brands: **SBI, HDFC, Amazon, KBC/Sony**
- Compares link hostnames against official domains
- Flags mismatched domains as `CRITICAL` risk automatically

### 📊 Real-time Analytics Dashboard
- **Risk Score**: 0–100 probability gauge per scan
- **Live stats**: total scans, threats blocked, suspicious flags, safe scans
- **Chart.js visualizations**: donut charts, bar graphs, trend lines
- **Activity Feed**: timestamped scan history from Supabase cloud DB
- **Clear History**: one-click database reset

### 🔔 Intelligent Alert System
- **Toast notifications**: slide-in banners for every scan result
- **Inline alert banners**: color-coded (🔴 HIGH_RISK / 🟡 SUSPICIOUS / 🟢 SAFE)
- **Manipulation tactics meter**: Urgency, Authority, Fear, Greed scores
- **Highlighted phrases**: exact flagged text from the scanned message

### 🛡️ Chrome Browser Extension (Manifest V3)
- Popup UI to scan the **current webpage URL** with one click
- **Manual text input** for SMS/link analysis from the extension
- Background `content.js` that auto-scans all links on every page visited
- Visual highlighting of suspicious links (dashed red border + tooltip)

### 📄 PDF Report Generation
- Download professional security reports for any scan
- Powered by `jspdf` — fully client-side, no server required

---

## ⚙️ How It Works

```
User Input (Text / Audio / URL)
        │
        ▼
┌─────────────────────────────┐
│  Layer 1: Hard Pre-Check    │  ← OTP, PIN, CVV, bank details in 9 languages
│  (Instant pattern matching) │
└──────────┬──────────────────┘
           │ No match?
           ▼
┌─────────────────────────────┐
│  Layer 2: Suspicious Check  │  ← KYC, click links, free offers, loan fraud
│  (Keyword pattern matching) │
└──────────┬──────────────────┘
           │ No match?
           ▼
┌─────────────────────────────┐
│  Layer 3: Groq LLM (AI)     │  ← Llama 3.3 70B semantic understanding
│  (Deep NLP analysis)        │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  URL Intelligence Overlay   │  ← Brand spoof check on any URLs in message
└──────────┬──────────────────┘
           │
           ▼
   Result: SAFE / SUSPICIOUS / HIGH_RISK
   (Risk Score 0–100, Reasons, Highlighted Phrases)
           │
           ▼
   Saved to Supabase → Dashboard Updated
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | HTML5, CSS3 (Dark glassmorphism UI), Vanilla JS, Chart.js |
| **Backend** | Node.js, Express.js v5, Multer (file uploads) |
| **AI Engine** | Groq API → Llama 3.3 70B (NLP / semantic analysis) |
| **Database** | Supabase (PostgreSQL, cloud-hosted) |
| **Extension** | Chrome Extension Manifest V3 |
| **PDF Export** | jspdf (client-side) |
| **Fonts** | Syne (headings), DM Sans (body) via Google Fonts |
| **OCR (planned)** | Tesseract.js + trained data for Bengali, Hindi, Marathi, Tamil, Telugu |

---

## 📂 Project Structure

```
PhishShield/
│
├── backend/
│   └── server.js           # Express server, all API routes, AI logic
│
├── extension/
│   ├── manifest.json       # Chrome MV3 manifest
│   ├── popup.html          # Extension popup UI
│   ├── popup.js            # Popup logic (scan current tab / manual text)
│   ├── content.js          # Background link scanner (injected on all pages)
│   └── icons/              # Extension icons (16px, 48px, 128px)
│
├── public/
│   ├── index.html          # Main web dashboard (SPA with sidebar navigation)
│   ├── about.html          # About page (team, tech stack, mission)
│   └── auth.html           # Authentication page (archived, not active)
│
├── *.traineddata           # Tesseract OCR language models (ben, eng, hin, mar, tam, tel)
│
├── .env                    # Environment variables (API keys — NOT committed)
├── .gitignore
├── package.json
├── phishshield.db          # Local SQLite DB (legacy, Supabase is primary)
└── README.md
```

---

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** v18 or higher
- A [**Groq Cloud**](https://console.groq.com/) account and API key
- A [**Supabase**](https://supabase.com/) project with a `scans` table

### Supabase Table Schema
Create a table named `scans` in your Supabase project:
```sql
create table scans (
  id bigserial primary key,
  type text,           -- 'TEXT' or 'AUDIO'
  content text,        -- First 500 chars of scanned content
  risk_level text,     -- 'HIGH_RISK', 'SUSPICIOUS', 'SAFE'
  risk_score integer,  -- 0-100
  language text,       -- Detected language
  summary text,        -- One-line summary
  tactics text,        -- JSON string of manipulation tactics
  timestamp timestamptz default now()
);
```

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/phishshield.git
cd phishshield
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the **root directory**:
```env
PORT=3000
GROK_API_KEY=your_groq_api_key_here
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
```

> ⚠️ **Never commit your `.env` file.** It is already in `.gitignore`.

### 4. Start the Server
```bash
# Production
npm start

# Development (with auto-reload via nodemon)
npm run dev
```

**Open:** `http://localhost:3000`

---

## 🔌 Browser Extension Setup

1. Open **Google Chrome** and go to `chrome://extensions/`
2. Enable **Developer Mode** (toggle in the top-right corner)
3. Click **"Load unpacked"**
4. Select the `extension/` folder from this project
5. Pin the PhishShield icon to your toolbar

> **Note:** The extension connects to `http://localhost:3000` — the backend server must be running for extension scans to work.

---

## 📡 API Reference

### Base URL
```
http://localhost:3000
```

### `GET /api/health`
Health check — returns server uptime, API key status, and timestamp.

**Response:**
```json
{
  "status": "ok",
  "uptime": 123.45,
  "port": 3000,
  "apiKeyConfigured": true,
  "timestamp": "2026-06-13T10:00:00.000Z"
}
```

---

### `POST /api/analyze/text`
Analyze a text message, SMS, or URL for phishing.

**Request Body:**
```json
{
  "text": "Your SBI account has been blocked. Share your OTP immediately.",
  "language": "auto-detect"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "riskLevel": "HIGH_RISK",
    "riskScore": 95,
    "language": "English",
    "threats": 1,
    "links": 0,
    "tactics": 1,
    "reasons": ["Requesting sensitive information: 'otp'", "Sharing this is NEVER safe"],
    "highlighted_phrases": ["Share your OTP"],
    "summary": "Message requests OTP — this is a phishing attempt",
    "recommendation": "🚨 DO NOT share any information. Block and report immediately."
  }
}
```

---

### `POST /api/analyze/audio`
Upload an audio file for scam analysis.

**Request:** `multipart/form-data` with field `files[]`

**Response:**
```json
{
  "success": true,
  "result": {
    "overallRiskLevel": "HIGH_RISK",
    "overallRiskScore": 92,
    "summary": "Audio analyzed - high_risk detected",
    "files": [...],
    "manipulationTactics": { "Urgency": 90, "Authority": 85 },
    "recommendation": "BLOCK & REPORT"
  }
}
```

---

### `GET /api/history`
Fetch the last 50 scan records from Supabase.

### `POST /api/history/clear`
Delete all scan history records from the database.

---

## 🌐 Supported Languages

| Language | Script | OTP Phrase Detection | Keyword Detection |
|----------|--------|----------------------|-------------------|
| English | Latin | ✅ | ✅ |
| Hindi | Devanagari | ✅ | ✅ |
| Marathi | Devanagari | ✅ | ✅ |
| Tamil | Tamil | ✅ | ✅ |
| Bengali | Bengali | ✅ | ✅ |
| Telugu | Telugu | ✅ | ✅ |
| Punjabi | Gurmukhi | ✅ | ✅ |
| Gujarati | Gujarati | ✅ | ✅ |
| Malayalam | Malayalam | ✅ | ✅ |

---

## 🎯 Risk Level System

| Level | Score Range | Meaning | Action |
|-------|-------------|---------|--------|
| 🔴 **HIGH_RISK** | 70–100 | OTP/PIN/bank request, impersonation, arrest threat | Block & report immediately |
| 🟡 **SUSPICIOUS** | 35–69 | Urgency, unverified links, vague offers | Verify through official channels |
| 🟢 **SAFE** | 0–34 | Normal conversation, no demands | No action needed |

---

## 🔒 Security & Privacy

- **No PII Retention**: PhishShield analyzes message *intent*, not personal identity. Only the first 500 characters of a message are stored.
- **Transparency**: Every scan generates a detailed report explaining *why* a message was flagged, with exact highlighted phrases.
- **API Key Security**: All credentials are stored in `.env` and never exposed to the client.
- **Cloud DB**: Supabase with Row-Level Security (RLS) support for production hardening.

---

## 🏆 Project Status

| Feature | Status |
|---------|--------|
| Text Phishing Analysis | ✅ Stable |
| Audio Upload Analysis | ✅ Stable |
| Browser Extension (MV3) | ✅ Stable |
| Multilingual Detection (9 languages) | ✅ Stable |
| Supabase Cloud DB Integration | ✅ Stable |
| PDF Report Generation | ✅ Stable |
| Brand Spoof / URL Intelligence | ✅ Stable |
| Real-time Dashboard & Charts | ✅ Stable |
| Vision / OCR Image Scanning | 🚧 In Development |
| Mobile App | 🔮 Planned |

---

## 👥 Team

Built with ❤️ for a Hackathon focused on Cyber-Secure India.

| Name | Role | Contribution |
|------|------|--------------|
| **Sushant** | Full Stack Developer | Core architecture, backend APIs, full-stack integration |
| **Akansha** | Full Stack Developer | Dashboard UI, responsive design, user experience |
| **Pranjali** | Frontend Developer | AI integration, NLP processing, keyword detection |
| **Pratikk** | UI/UX Designer | Dark theme design, component styling, visual consistency |

---

## 📄 License

This project is licensed under the **ISC License**.

---

<div align="center">

*Built with ❤️ for Cyber-Secure India 🇮🇳*

**PhishShield AI — Protecting Every Indian, In Every Language.**

</div>
