from pydantic_settings import BaseSettings
from pydantic import Extra

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

    class Config:
        extra = Extra.forbid  
        env_file = ".env"

settings = Settings()

print("Loaded settings:", settings.dict())

