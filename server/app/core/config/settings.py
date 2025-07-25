from pydantic_settings import BaseSettings
from sqlalchemy.ext.asyncio import create_async_engine

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str = "your_default_secret"
    ALGORITHM: str = "HS256"

    FRONTEND_URL: str
    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_FROM_NAME: str
    MAIL_STARTTLS: bool
    MAIL_SSL_TLS: bool
    USE_CREDENTIALS: bool
    VALIDATE_CERTS: bool

    model_config={
        "extra": "forbid",
        "env_file": ".env"
    }

settings = Settings()
engine = create_async_engine(settings.DATABASE_URL, echo=True)

print("Loaded settings:", settings.model_dump())

