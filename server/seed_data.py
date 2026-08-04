import asyncio
import uuid
from app.db import AsyncSessionLocal
from app.models.user import User
from app.models.report import Report, RecordType, ReportStatus
import bcrypt
from sqlalchemy import select

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password=pwd_bytes, salt=salt)
    return hashed_password.decode('utf-8')

async def seed():
    async with AsyncSessionLocal() as db:
        # Check if we already have mock users
        result = await db.execute(select(User).where(User.email == "mockuser1@jiseti.com"))
        existing_user = result.scalars().first()
        if existing_user:
            print("Database already seeded with mock users.")
            return

        print("Seeding database...")
        
        # Create Users
        users = [
            User(
                id=uuid.uuid4(),
                username="john_citizen",
                email="mockuser1@jiseti.com",
                hashed_password=get_password_hash("password123"),
                is_verified=True,
                is_admin=False
            ),
            User(
                id=uuid.uuid4(),
                username="jane_activist",
                email="mockuser2@jiseti.com",
                hashed_password=get_password_hash("password123"),
                is_verified=True,
                is_admin=False
            )
        ]
        
        for u in users:
            db.add(u)
        await db.commit()
        
        print("Added mock users.")
        
        # Create Reports
        reports = [
            Report(
                title="Misappropriation of Funds in Road Project",
                description="The newly allocated funds for the Main Street road repair seem to have disappeared. No work has started and the contractor is missing.",
                category=RecordType.RED_FLAG,
                location="Main Street, Downtown",
                latitude=-1.286389,
                longitude=36.817223,
                status=ReportStatus.UNDER_INVESTIGATION,
                author_id=users[0].id
            ),
            Report(
                title="Bribery Allegation at Licensing Office",
                description="Officers are demanding a 'facilitation fee' of $50 to process standard business licenses. Have recorded evidence.",
                category=RecordType.INTERVENTION,
                location="City Hall, West Wing",
                latitude=-1.2921,
                longitude=36.8219,
                status=ReportStatus.RESOLVED,
                author_id=users[1].id
            ),
            Report(
                title="Illegal Dumping in River",
                description="A local factory is dumping untreated chemical waste into the river at night. The water has turned green and smells toxic.",
                category=RecordType.RED_FLAG,
                location="River Road Industrial Area",
                latitude=-1.2754,
                longitude=36.8341,
                status=ReportStatus.DRAFT,
                author_id=users[0].id
            ),
            Report(
                title="Ghost Workers in County Payroll",
                description="Leaked documents show that over 200 non-existent employees are receiving salaries every month.",
                category=RecordType.RED_FLAG,
                location="County Government Offices",
                latitude=-1.3005,
                longitude=36.8012,
                status=ReportStatus.UNDER_INVESTIGATION,
                author_id=users[1].id
            ),
            Report(
                title="Stalled Hospital Construction",
                description="The construction of the new maternity wing has stalled for 2 years despite full budget allocation. Materials are rotting on site.",
                category=RecordType.INTERVENTION,
                location="County General Hospital",
                latitude=-1.2890,
                longitude=36.8050,
                status=ReportStatus.RESOLVED,
                author_id=users[0].id
            )
        ]
        
        for r in reports:
            db.add(r)
        await db.commit()
        
        print("Added mock reports.")
        print("Database seeding complete!")

if __name__ == "__main__":
    asyncio.run(seed())
