from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from app.core.config.settings import settings

# 1. Use the async DATABASE_URL
DATABASE_URL = settings.DATABASE_URL

# 2. Create the async engine
async_engine = create_async_engine(DATABASE_URL, echo=True)

# 3. Use async_sessionmaker (not regular sessionmaker)
AsyncSessionLocal = async_sessionmaker(
    bind=async_engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

# 4. Base class for models
Base = declarative_base()

# 5. Dependency for FastAPI routes
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
