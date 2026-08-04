import asyncio
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.db import AsyncSessionLocal, async_engine
from app.models.user import User
from app.core.security import get_password_hash

ADMIN_EMAIL = "admin@jiseti.com"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "adminpassword123"

async def seed_admin():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == ADMIN_EMAIL))
        admin = result.scalars().first()

        hashed_pw = get_password_hash(ADMIN_PASSWORD)

        if admin:
            admin.username = ADMIN_USERNAME
            admin.hashed_password = hashed_pw
            admin.is_admin = True
            admin.is_verified = True
            print(f"Updated existing admin user ({ADMIN_EMAIL})")
        else:
            admin = User(
                id=uuid.uuid4(),
                username=ADMIN_USERNAME,
                email=ADMIN_EMAIL,
                hashed_password=hashed_pw,
                is_admin=True,
                is_verified=True
            )
            session.add(admin)
            print(f"Created new admin user ({ADMIN_EMAIL})")

        await session.commit()
        print("\nAdmin credentials:")
        print(f"Email: {ADMIN_EMAIL}")
        print(f"Username: {ADMIN_USERNAME}")
        print(f"Password: {ADMIN_PASSWORD}")

if __name__ == "__main__":
    asyncio.run(seed_admin())
