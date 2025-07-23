# Jiseti API Endpoints

## User Endpoints

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

    POST /posts – Create a new public issue or post

    PATCH /posts/{id} – Update or mark as solved

    DELETE /posts/{id} – Delete post by author or admin

Comment Endpoints 

    POST /comments – Add a comment to a post

    GET /comments/post/{post_id} – Get all comments for a post

    DELETE /comments/{id} – Delete own comment or by admin

Notifications (Planned)

    Notify users when:

        Their post is resolved

        Someone comments or donates

Media Upload (Planned)

    Allow attaching images/media to a post

    Store file metadata in DB and link to post