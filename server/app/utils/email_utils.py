import os
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

conf = ConnectionConfig(
    MAIL_USERNAME = os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD"),
    MAIL_FROM = os.getenv("MAIL_FROM", "jiseti@example.com"),
    MAIL_PORT = 2525,
    MAIL_SERVER = "smtp.mailtrap.io",
    MAIL_TLS = True,
    MAIL_SSL = False,
    USE_CREDENTIALS = True,
)

async def send_verification_email(email: str, username: str, token: str):
    html = f"<p>Hi {username},</p><p>Click <a href='{os.getenv('FRONTEND_URL')}/verify?token={token}'>here</a> to verify your email.</p>"
    message = MessageSchema(subject="Verify your Jiseti account", recipients=[email], html=html)
    fm = FastMail(conf)
    await fm.send_message(message)
