#  Jiseti API Endpoints

##  User Endpoints

### POST /register
- Create a new user
- Body:
```json
{
  "email": "liz@example.com",
  "password": "secret123"
}

    Returns:

{
  "message": "User created. Please verify your email."
}

POST /login

    Authenticates user, returns access token

    Body:

{
  "email": "liz@example.com",
  "password": "secret123"
}

GET /me

    Get current user details (JWT required)

    Headers:

Authorization: Bearer <token>

 Post/Report Endpoints (Planned)
POST /posts

    Create a new public issue or post

PATCH /posts/{id}

    Update or mark as solved

DELETE /posts/{id}

    Delete post by author or admin

 Notifications (Planned)

    Notify users when:

        Their post is resolved

        Someone comments or donates


---

##  `docs/roadmap.md`

```markdown
# Jiseti Roadmap – The Road So Far

## Completed
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
