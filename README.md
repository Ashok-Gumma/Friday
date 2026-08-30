# 🤖 Friday AI — Emotional AI Companion & Adaptive ML Workspace

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248.svg)](https://www.mongodb.com/)
[![Machine Learning](https://img.shields.io/badge/ML-Naive%20Bayes%20%2B%20TF--IDF-orange.svg)]()
[![Design](https://img.shields.io/badge/Design-Notion%20Dark%20%26%20Light-black.svg)]()

> **Friday AI** is an intelligent, emotionally adaptive AI companion designed to understand not just what you say, but *how you feel*. Powered by a custom **Multinomial Naive Bayes Machine Learning Engine with TF-IDF vectorization**, Friday detects emotional sentiment in real-time and dynamically modulates its empathy, conversational tone, and speech cadence.

---

## ✨ Key Features

- **🧠 Real-Time ML Emotion Engine**: 100K-sample trained Multinomial Naive Bayes model with Laplace smoothing ($α=0.5$) and TF-IDF feature weighting detecting 7 primary emotion states (*Happy, Sad, Angry, Motivated, Calm, Anxious, Neutral*).
- **🎭 9 Adaptive Mood Personas**: Switch between Motivated, Joyful, Sad, Angry, Relaxed, Calm, Focused, Compassionate, and Professional personas.
- **🌓 Notion Aesthetic & Theme Switcher**: Minimalist, clean black-and-white Notion design system with instant **Dark & Light mode toggle** persisted via `localStorage`.
- **🎨 Custom Notion Vector Cartoon Illustrations**: Beautiful, scalable vector cartoon artwork on every screen (*Home, Login, Signup, Chat empty state, Mood check-in modal, Profile*).
- **🎙️ Real-Time Voice Synthesis (TTS) & Speech Recognition**:
  - Live voice character selection with immediate audio previews.
  - Emotion-modulated speech cadence and pitch (e.g. soothing and deliberate for *Calm/Sad*, vibrant and upbeat for *Motivated/Joyful*).
- **📱 100% Mobile Reactive**: Responsive layout with dynamic viewports (`100dvh`), sliding overlay sidebar drawer, iOS auto-zoom prevention, and touch-friendly controls.
- **🔐 Secure Authentication**: JWT authentication + Google OAuth 2.0 integration with password hashing and user profiling.
- **⚡ Rapid Blinkit-Style Page Loader**: Fast cycling icons with smooth exit animations.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 + Vite
- **Routing**: React Router v6 with synchronous `AnimatePresence` page transitions
- **Styling**: Notion Design System (Vanilla CSS Custom Properties)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Speech**: Web Speech API (`SpeechSynthesis` & `webkitSpeechRecognition`)
- **OAuth**: `@react-oauth/google`

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Security**: JSON Web Tokens (`jsonwebtoken`), bcryptjs, Google Auth Library
- **ML & NLP**: Custom pure-JS Natural Language Preprocessor + Multinomial Naive Bayes Classifier with TF-IDF Vectorizer
- **Dialogue Engine**: Pure On-Device ML & Contextual Emotional Response Synthesis

---

## 🧠 Machine Learning Emotion Engine

The emotion engine is located in `backend/ml/`:
- **`nlpPreprocessor.js`**: Text normalization, tokenization, stopword removal, and negation preservation (e.g., `"not happy"` -> `"not_happy"`).
- **`modelTrainer.js`**: Implementation of Multinomial Naive Bayes:
  $$P(w|c) = \frac{\text{count}(w, c) \cdot \text{IDF}(w) + \alpha}{\sum_{w'} \text{count}(w', c) + \alpha \cdot |V|}$$
- **`moodPredictor.js`**: Lightweight cached inference module predicting user mood with softmax-normalized confidence scores in $< 1\text{ms}$.
- **`datasetGenerator.js`**: Generates and manages the stratified 100K training corpus across emotional domains.

To benchmark the ML model locally:
```bash
node backend/ml/test_inference.js
```

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account or local MongoDB instance

### 2. Clone Repository
```bash
git clone https://github.com/Ashok-Gumma/Hey-Jarvis.git
cd Hey-Jarvis
```

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see `backend/.env.example`):
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/friday_db?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
PORT=5000
RAPIDAPI_KEY=your_rapidapi_key
RAPIDAPI_HOST=open-ai21.p.rapidapi.com
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory (see `frontend/.env.example`):
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

### 5. Running Locally
In the root directory:
```bash
# Start Backend
cd backend && npm run dev

# In a separate terminal, start Frontend
cd frontend && npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 📁 Directory Structure

```
Friday/
├── backend/
│   ├── controllers/         # Auth and Chat controllers
│   ├── lib/                 # Database connection & Auth middleware
│   ├── ml/                  # Machine Learning Emotion Classifier
│   │   ├── data/            # Trained model & dataset
│   │   ├── modelTrainer.js  # Naive Bayes & TF-IDF trainer
│   │   ├── moodPredictor.js # Fast runtime inference engine
│   │   └── nlpPreprocessor.js
│   ├── models/              # Mongoose schemas (User, Chat)
│   ├── routes/              # Express API route handlers
│   ├── .env.example
│   └── server.js            # Express server entry point
├── frontend/
│   ├── public/              # Static assets & favicons
│   ├── src/
│   │   ├── components/      # UI components (Home, Chat, NotionArt, ThemeToggle, etc.)
│   │   ├── context/         # ThemeContext & LoadingContext
│   │   ├── pages/           # Profile page
│   │   ├── App.jsx          # Route definitions & transitions
│   │   └── main.jsx
│   ├── styles/              # Notion Light & Dark CSS tokens
│   ├── .env.example
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🔒 Security Best Practices
- Never commit `.env` or secret keys to version control.
- All sensitive tokens are securely excluded via `.gitignore`.
- Password hashes use `bcryptjs` with salt rounds.

---

## 📄 License
This project is licensed under the MIT License.
