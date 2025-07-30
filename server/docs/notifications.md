    Notify users when:

        Their post is resolved

        Someone comments or donates


---

##  `docs/roadmap.md`

```markdown
# Jiseti Roadmap – The Road So Far

##  Completed
- Set up FastAPI backend
- Created `User` model with:
  - Email
  - Password (hashed)
  - Is_verified
  - UUID
- Created authentication routes:
  - /register (with email verification logic)
  - /login (returns JWT)
- JWT & OAuth2 login
- Email verification logic with token
- Refactored using SQLAlchemy `Base`, `Session`, and `models/`
- Started initial planning and documentation structure

##  Upcoming
- Add `Post` model (issue reports)
- Add endpoints for creating/viewing posts
- Setup frontend directory (Vite + React)
- Enable CORS and connect backend/frontend
- Add donation model (optional)
- Set up notifications system (optional)
