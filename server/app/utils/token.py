from itsdangerous import URLSafeTimedSerializer
from app.core.config.settings import settings
serializer = URLSafeTimedSerializer(settings.SECRET_KEY)

def generate_email_token(email: str) -> str:
    return serializer.dumps(email, salt="email-confirm")

def verify_email_token(token: str, max_age: int = 3600) -> str:
    try:
        email = serializer.loads(token, salt="email-confirm", max_age=max_age)
        return email
    except Exception:
        return None
