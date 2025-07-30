#  Development Roadmap – Jiseti App

This document tracks the technical progress of the Jiseti project. It complements the wireframes, API, and vision documents.

---

## ✅ Completed So Far

### 🧩 User Models & Schemas
Created SQLAlchemy `User` model with fields:
- `id` (UUID)
- `username`
- `email`
- `password_hash`
- `is_verified`
- `is_admin`
- `avatar`
- `streak`

###  Created Pydantic Schemas
- `UserBase`
- `UserCreate`
- `UserLogin`
- `UserOut`
- `UserUpdate`
- `FullUser`

---

###  User Routes
- User registration
- User login with JWT tokens
- Password hashing and validation
- Profile update route (username, avatar)

---

##  Email System (In Progress)
Started `email_utils.py` in `utils/`:
- [ ] Set up email verification system (via Mailtrap or Ethereal)
- [ ] Send welcome or verification email on register
- [ ] Handle email token confirmation

---

## Next Tasks
- [ ] Password reset flow
- [ ] Anonymous posting (hide name/email)
- [ ] Notifications system
- [ ] Admin privileges and controls

---

##  Folder Structure Snapshot

app/
├── models/
│ └── user.py
├── schemas/
│ └── user_schema.py
├── routes/
│ └── user_route.py
├── utils/
│ └── email_utils.py


---