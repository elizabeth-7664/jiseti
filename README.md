# Jiseti 🧭

**Jiseti** is a full-stack civic engagement platform that allows users to report corruption or request government intervention in public services. It empowers citizens by enabling transparency and accountability through geotagged reports, while giving administrators tools to track, verify, and respond to these reports.

## 🔗 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Future Improvements](#future-improvements)
- [Contributors](#contributors)

---

## ✅ Features

### Users
- Create an account & log in.
- Submit reports with geolocation (latitude & longitude).
- View and edit your reports before approval.
- View status updates on submitted reports.

### Admin
- View all submitted reports.
- Approve, reject, or update the status of any report.
- Filter reports by category or location.

### General
- RESTful API with full CRUD support.
- Media uploads (optional).
- Notifications (optional).
- Role-based access control.
- JWT-based authentication.
- Frontend state management with Redux Toolkit.
- Location tagging via map integration.

---

## 🛠 Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** SQLite (dev), PostgreSQL (prod-ready)
- **ORM:** SQLAlchemy (Async)
- **Auth:** OAuth2 + JWT
- **Tools:** Alembic, Uvicorn, Pydantic

### Frontend
- **Library:** React + React Router
- **State Management:** Redux Toolkit
- **Styling:** Bootstrap / Custom CSS
- **Testing:** Jest

---

## 🚀 Setup Instructions

### Backend (FastAPI)
1. **Clone the repo**
   ```bash
   git clone https://github.com/elizabeth-7664/jiseti.git/
  
2. **Create virtual environment**
    ```bash
    python -m venv venv
    source venv/bin/activate
    
3. **Install dependencies**
    ```bash
    pip install -r requirements.txt

4. **Run the server**
    ```bash
    uvicorn app.main:app --reload
    
---
5. **View API Docs**

Swagger UI: http://localhost:8000/docs

ReDoc: http://localhost:8000/redoc

---
### Frontend (React)
1. Navigate to client folder
    ```bash
    cd jiseti/client
    

2. **Install dependencies**

    ```bash
    bun install
    ```
3. **Run the app**

    ```bash
    bun run dev

---

## 📡 API Endpoints

| Method | Endpoint         | Description               |
|--------|------------------|---------------------------|
| POST   | /auth/register   | Register a new user       |
| POST   | /auth/login      | Login and get token       |
| GET    | /reports/        | Get all reports (admin)   |
| POST   | /reports/        | Submit a new report       |
| PATCH  | /reports/{id}    | Update report             |
| GET    | /users/me        | Get current user profile  |

### 📁 Project Structure
```bash
jiseti/
├── server/                        # FastAPI backend
│   ├── app/
│   │   ├── models/                # SQLAlchemy models
│   │   ├── core/                  # Core app settings, auth utils, config
│   │   ├── schemas/               # Pydantic schemas
│   │   ├── api/                   # API route handlers
│   │   ├── services/              # Business logic
│   │   └── main.py                # FastAPI entry point
│   ├── tests/                     # Backend unit tests
│   ├── requirements.txt           # Backend dependencies
│   └── .env                       # Environment variables
├── client/                        # React frontend
│   ├── src/
│   │   ├── components/            # UI Components
│   │   ├── pages/                 # Page views
│   │   ├── redux/                 # Redux Toolkit store and slices
│   │   └── App.jsx                # Root app component
├── README.md                      # Project documentation
└── .env                           # Global environment file
```
### Future Improvements
- Notification system via email or SMS
- Admin dashboard analytics (charts, stats)
- PDF/CSV report exports

## 👥 Contributors

- [Elizabeth Ndinda](https://github.com/elizabeth-7664)
- [Yvonne Nyambura](https://github.com/Yvonne-del)
- [Lewis Nakhungu](https://github.com/lewisnakhungu)
- [William Wambugu Ndiritu](https://github.com/TheWilliams254)


### License

This project is licensed under the MIT License - see the LICENSE file for details.
