# 💰 Finance AI Coach

An AI-powered personal finance management platform that helps users analyze bank statements, track expenses, monitor spending habits, and gain actionable financial insights.

---

## 🚀 Features

### 🔐 Authentication

* User Signup
* User Login
* JWT Authentication
* Protected APIs

### 📄 Bank Statement Analysis

* Upload PDF bank statements
* Automatic text extraction using PDF processing
* Transaction detection and categorization
* Secure transaction storage

### 📊 Dashboard

* Total Income
* Total Expenses
* Total Savings
* Transaction Count
* Recent Transactions Table

### 🤖 AI Insights

* Spending breakdown by category
* Food spending analysis
* Travel spending analysis
* Shopping spending analysis
* Personalized financial recommendations

### 📈 Analytics

* Expense Breakdown Pie Chart
* Category-wise spending analysis
* Financial trend visualization

### 🔒 Privacy First

* User data stored securely
* JWT-based authorization
* Individual user transaction isolation
* No financial data sharing

---

## 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Recharts

### Backend

* FastAPI
* Python
* SQLAlchemy
* JWT Authentication

### Database

* PostgreSQL

### PDF Processing

* pdfplumber

---

## 📂 Project Structure

finance-coach/

├── backend/

│ ├── app/

│ │ ├── routes/

│ │ ├── services/

│ │ ├── models.py

│ │ ├── database.py

│ │ └── main.py

│

├── frontend/

│ ├── src/

│ │ ├── pages/

│ │ ├── components/

│ │ └── App.tsx

│

└── README.md

---

## ⚙️ Installation

### Clone Repository

```bash
git clone <repository-url>
cd finance-coach
```

### Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

python -m uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

```http
POST /signup
POST /login
```

### Dashboard

```http
GET /dashboard
```

### Transactions

```http
GET /transactions
```

### Insights

```http
GET /insights
```

### Statement Upload

```http
POST /upload-statement
```

---

## Future Enhancements

* OpenAI-powered financial advisor
* Monthly spending trends
* Goal-based savings planner
* Mutual fund recommendations
* Budget forecasting
* Mobile application
* Email financial reports
* Multi-bank support

---

## Author

**Aayush Mittal**

B.Tech Student | Full Stack Developer

Built with ❤️ using React, FastAPI, PostgreSQL, and AI.
