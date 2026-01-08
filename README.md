# CareerReadyAI 🚀

CareerReadyAI is a full-stack AI-powered application built with a **React (Vite) frontend** and a **FastAPI backend** for career analysis and feedback.

---

## ▶️ Run Locally

### 🔹 Prerequisites

* Node.js (v18+)
* Python (v3.9+)
* npm & pip installed

---

### 🔹 Frontend Setup

```bash
npm install
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

### 🔹 Backend Setup

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Backend will run at:

```
http://127.0.0.1:8000
```

---

## 🔗 Frontend ↔ Backend Communication

Ensure the frontend API base URL points to the backend:

```ts
http://127.0.0.1:8000
```

---

## 📂 Project Structure

```
CarrerReadyAI/
├── components/
├── pages/
├── utils/
├── App.tsx
├── main.py
├── package.json
├── requirements.txt
├── vite.config.ts
└── README.md
```

---

## 👨‍💻 Author

**Sudin Jain**
GitHub: [https://github.com/sudeenjain](https://github.com/sudeenjain)
