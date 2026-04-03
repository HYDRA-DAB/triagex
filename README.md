<div align="center">

<br />

<img src="https://img.icons8.com/fluency/96/heart-monitor.png" width="80" alt="TriageX Logo" />

# TriageX

### Smarter Health Starts With Understanding

AI-powered health intelligence platform for symptom analysis,<br />medical search, and real-time hospital discovery.

<br />

[![GitHub Stars](https://img.shields.io/github/stars/HYDRA-DAB/triagex?style=for-the-badge&logo=github&logoColor=white&labelColor=0D1117&color=7C3AED)](https://github.com/HYDRA-DAB/triagex/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/HYDRA-DAB/triagex?style=for-the-badge&logo=git&logoColor=white&labelColor=0D1117&color=4F46E5)](https://github.com/HYDRA-DAB/triagex/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/HYDRA-DAB/triagex?style=for-the-badge&logo=github&logoColor=white&labelColor=0D1117&color=EC4899)](https://github.com/HYDRA-DAB/triagex/issues)
[![Last Commit](https://img.shields.io/github/last-commit/HYDRA-DAB/triagex?style=for-the-badge&logo=git&logoColor=white&labelColor=0D1117&color=06B6D4)](https://github.com/HYDRA-DAB/triagex/commits)
[![License](https://img.shields.io/github/license/HYDRA-DAB/triagex?style=for-the-badge&labelColor=0D1117&color=10B981)](https://opensource.org/licenses/ISC)

<br />

<p>
  <img src="https://skillicons.dev/icons?i=react,vite,tailwind,nodejs,express,supabase,js,html,css&theme=dark" alt="Tech Stack" />
</p>

<br />

[Features](#-features) · [Tech Stack](#-tech-stack) · [Get Started](#%EF%B8%8F-installation--setup) · [Usage](#%EF%B8%8F-usage) · [Contributing](#-contributing)

<br />

---

</div>

<br />

## 🚀 Features

<table>
<tr>
<td width="50%">

### 🧬 SymptomX
Interactive, Akinator-style AI triage that asks adaptive follow-up questions, classifies risk levels, and suggests the right specialist based on body-part-aware diagnosis logic.

</td>
<td width="50%">

### 🗺️ FinderX
Real-time geolocation-based hospital finder with interactive Leaflet maps, facility cards, distance filtering, and pan-India search via OpenStreetMap.

</td>
</tr>
<tr>
<td width="50%">

### 📖 DictionaryX
Medical term search engine powered by Wikipedia and an Express backend, with prescription/report upload for AI-driven plain-English explanations.

</td>
<td width="50%">

### 📊 Dashboard
Authenticated health hub with vitals tracking, symptom severity charts, recovery indicators, medical records, and health timeline.

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Supabase Auth
Google OAuth and email/password authentication with session persistence and protected routes.

</td>
<td width="50%">

### ⚡ Production Backend
Express 5 server with TTL caching, rate limiting, robust JSON parsing, and non-blocking Supabase telemetry logging.

</td>
</tr>
</table>

<br />

## 🧠 Problem Statement

Patients often struggle to understand medical terminology, assess the severity of their symptoms, or find nearby healthcare facilities during urgent situations. The gap between experiencing a health concern and receiving actionable guidance creates unnecessary anxiety and delays in care.

## 💡 Solution

TriageX bridges this gap by combining AI-driven symptom analysis, intelligent medical search, and real-time hospital discovery into a unified platform. Users can describe symptoms in plain language, receive adaptive clinical follow-ups, understand complex medical terms, and locate the nearest care — all before stepping into a clinic.

<br />

## 🛠 Tech Stack

<div align="center">

| Layer | Technology | Badge |
|:------|:-----------|:------|
| **Frontend** | React 19, Vite 8, TailwindCSS 3.4 | ![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white) ![Tailwind](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **Routing** | React Router v7 | ![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter&logoColor=white) |
| **Backend** | Node.js, Express 5 | ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white) |
| **AI Engine** | OpenAI GPT-4o-mini + local fallback | ![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=flat-square&logo=openai&logoColor=white) |
| **Maps** | Leaflet, OpenStreetMap Nominatim | ![Leaflet](https://img.shields.io/badge/Leaflet-1.9-199900?style=flat-square&logo=leaflet&logoColor=white) |
| **Auth & DB** | Supabase (Auth, PostgreSQL) | ![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3FCF8E?style=flat-square&logo=supabase&logoColor=white) |
| **Icons** | Lucide React | ![Lucide](https://img.shields.io/badge/Lucide-Icons-F56565?style=flat-square) |
| **HTTP** | Axios, Fetch API | ![Axios](https://img.shields.io/badge/Axios-HTTP-5A29E4?style=flat-square&logo=axios&logoColor=white) |
| **Security** | express-rate-limit, CORS | ![Security](https://img.shields.io/badge/Rate%20Limited-Protected-10B981?style=flat-square&logo=cloudflare&logoColor=white) |
| **Upload** | Multer | ![Multer](https://img.shields.io/badge/Multer-File%20Upload-FF6F00?style=flat-square) |

</div>

<br />

## 📂 Project Structure

```
triagex/
├── public/                     # Static assets (images, favicon)
├── server.js                   # Express backend (DictionaryX API, caching, Supabase logging)
├── index.html                  # Vite entry point
├── vite.config.js              # Vite config with API proxy
├── tailwind.config.js
├── postcss.config.js
├── src/
│   ├── main.jsx                # React entry
│   ├── App.jsx                 # Root router + auth state
│   ├── App.css                 # Global styles
│   ├── index.css               # Design system tokens
│   ├── lib/
│   │   └── supabaseClient.js   # Supabase SDK init
│   ├── services/
│   │   └── symptomxService.js  # AI triage engine (OpenAI + local diagnosis map)
│   ├── utils/
│   │   ├── finderxUtils.js     # Hospital fetch & geolocation utils
│   │   └── ncbiUtils.js        # NCBI PubMed integration
│   ├── pages/
│   │   ├── Auth.jsx            # Login / Signup (Google OAuth)
│   │   ├── Dashboard.jsx       # Health overview dashboard
│   │   ├── SymptomX.jsx        # AI symptom analysis page
│   │   ├── DictionaryX.jsx     # Medical dictionary + report upload
│   │   ├── FinderX.jsx         # Hospital finder with map
│   │   └── SOS.jsx             # Emergency module (WIP)
│   └── components/
│       ├── NavBar.jsx
│       ├── Hero.jsx
│       ├── FeatureShowcase.jsx
│       ├── WhyTriageX.jsx
│       ├── auth/               # AuthCard, AuthButton, AuthInput, AuthTabs
│       ├── symptomx/           # SymptomHeader, SymptomInput, SymptomResult, HealthTrajectoryGraph
│       ├── finderx/            # MapView, FacilityCard, FacilityList, InfoPanel, SearchComponent
│       ├── dictionaryx/        # useDictionary hook, API client, helpers
│       └── sos/                # Emergency UI components (WIP)
```

<br />

## ⚙️ Installation & Setup

> **Prerequisites** — Node.js >= 18, npm >= 9, a Supabase project, and an OpenAI API key (optional — the app falls back to local diagnosis if absent).

### 1. Clone the repository

```bash
git clone git@github.com:HYDRA-DAB/triagex.git
cd triagex
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Backend (Node.js / Express)
OPENAI_API_KEY=your_openai_api_key
GOOGLE_API_KEY=your_google_api_key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_key

# Frontend (Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Start the development servers

```bash
# Terminal 1 — Backend
npm start

# Terminal 2 — Frontend
npm run dev
```

> The frontend runs on `http://localhost:5173` and proxies `/api` requests to port `3001`.

<br />

## ▶️ Usage

| Action | How |
|:-------|:----|
| **Analyze symptoms** | Navigate to `/symptomx`, enter a symptom, and follow the AI triage |
| **Find hospitals** | Navigate to `/finderx` — location is auto-detected |
| **Search medical terms** | Navigate to `/dictionaryx` and search or upload a prescription |
| **View health dashboard** | Sign in via `/auth`, then access `/dashboard` |

<br />

## 📸 Screenshots

> Screenshots will be added here once the UI is finalized.
>
> _Placeholder: Landing page · SymptomX triage flow · FinderX map view · DictionaryX results_

<br />

## 🔮 Future Improvements

- **SOS Module** — One-tap emergency alerts with live location sharing and emergency contact notifications
- **Treatment Tracking** — Medication reminders, dosage logging, and adherence analytics
- **Multi-language Support** — Hindi, Marathi, and other regional language interfaces
- **Voice Input** — Hands-free symptom entry via Web Speech API
- **PDF Report Export** — Downloadable triage reports for sharing with doctors
- **Persistent Health History** — Cloud-synced symptom and consultation records via Supabase
- **Wearable Integration** — Connect with health data from smartwatches and fitness bands

<br />

## 🤝 Contributing

Contributions are welcome. To get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to the branch: `git push origin feature/your-feature`
5. **Open** a Pull Request

Please follow the existing code style and ensure the app builds without errors before submitting.

<br />

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

<br />

---

<div align="center">

<br />

### 👨‍💻 Author

**HYDRA-DAB**

[![GitHub](https://img.shields.io/badge/GitHub-HYDRA--DAB-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/HYDRA-DAB)

<br />

⭐ Star this repo if you found it useful!

<sub>Built with purpose. Designed for impact.</sub>

<br />

</div>
