<div align="center">

# 🌾 Bhasha Kisan  
### AI-Powered Multilingual Voice Assistant for Farmers  

Bringing **Artificial Intelligence to Indian Agriculture** — in the language farmers understand.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-blue)
![Backend](https://img.shields.io/badge/Backend-FastAPI-orange)
![AI](https://img.shields.io/badge/AI-Google%20Gemini-purple)
![Deployment](https://img.shields.io/badge/Deployment-Netlify%20%2B%20Docker-black)

</div>

---

## 🌟 What is Bhasha Kisan?

**Bhasha Kisan** is an **AI-powered multilingual voice assistant** built to help farmers get **instant agricultural guidance** using their **own language and voice**.

Instead of searching the internet or visiting experts, farmers can simply:
> Speak → Ask → Get AI-generated advice → Hear the response.

---

## 🎯 Problem We Solve

Farmers face three major barriers when using technology:
- ❌ English-only platforms  
- ❌ Complex mobile apps  
- ❌ Text-based interfaces  

**Bhasha Kisan removes all three.**

---

## 🚀 What It Can Do

- 🎤 Voice-based queries  
- 🌍 Multilingual support (Hindi, Marathi, etc.)  
- 🧠 AI-powered crop & farming advice  
- 🔊 Text-to-speech responses  
- ☁ Cloud-based backend  
- 📍 Location-aware suggestions  
- 🔐 Secure authentication with Firebase  

---

## 🧠 How It Works

```
Farmer speaks
      ↓
Speech to Text (Browser)
      ↓
FastAPI Backend
      ↓
Google Gemini AI
      ↓
Translated & Optimized Answer
      ↓
Text + Voice Response
```




---

## 🛠 Tech Stack

### Frontend
- ⚛ React (Vite)
- 🎨 Tailwind CSS
- 🎙 Web Speech API
- 🔊 Text-to-Speech
- 🌐 Netlify

### Backend
- 🐍 FastAPI
- 🤖 Google Gemini API
- 🔥 Firebase
- 🐳 Docker

---

## 📁 Project Structure
```
Bhasha_Kisan
│
├── Backend
│ ├── main.py
│ ├── gemini_service.py
│ ├── firebase_service.py
│ ├── requirements.txt
│ └── Dockerfile
│
├── Frontend
│ ├── src
│ │ ├── components
│ │ ├── hooks
│ │ └── App.jsx
│ ├── tailwind.config.js
│ ├── vite.config.js
│ └── package.json
│
└── netlify.toml
```


---

## ⚙️ Installation

1️⃣ Clone the repository
```bash
### git clone https://github.com/your-username/bhasha-kisan.git
cd bhasha-kisan
```

2️⃣ Backend Setup
```bash
cd Backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
3️⃣ Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```

🔐 Environment Variables

Create a .env file inside Backend/
```bash
GEMINI_API_KEY=your_api_key
FIREBASE_CREDENTIALS=your_firebase_credentials
```

🌍 Deployment

| Layer    | Platform                             |
| -------- | ------------------------------------ |
| Frontend | Netlify                              |
| Backend  | Docker / Cloud VM / Render / Railway |



