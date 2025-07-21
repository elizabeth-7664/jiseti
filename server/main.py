from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.auth import router as auth_router
from app.models import * 

import os
from dotenv import load_dotenv

load_dotenv()

from app.utils.email_utils import send_email  

app = FastAPI()

# CORS configuration
origins = [os.getenv("FRONTEND_URL")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Backend is working! Welcome to Jiseti"}

@app.get("/test-email")
async def test_email():
    try:
        await send_email(
            subject="Jiseti Test Email",
            body="Hello, this is a test email from your FastAPI backend.",
            email_to=os.getenv("TEST_RECEIVER_EMAIL", "test@example.com")
        )
        return {"status": "Email sent successfully"}
    except Exception as e:
        return {"error": str(e)}
    
app.include_router(auth_router, prefix="/api/auth", tags=["Authentication"])
