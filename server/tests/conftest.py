# conftest.py is configuration for shared fixtures for all text files
import sys
import os
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

# This path ensures app and db modules are importable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.db import get_db, AsyncSessionLocal
from main import app

# Ensure consistent asyncio loop across fixtures and tests
pytest_plugins = ("pytest_asyncio",)

def pytest_configure():
    pytest.asyncio_mode = "auto"
    
# Define DB override as a dependency-compatible generator
async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

# Automatically override dependency for every test
@pytest.fixture(autouse=True)
def apply_db_override():
    app.dependency_overrides[get_db] = override_get_db
    yield
    app.dependency_overrides.clear()

# AsyncClient fixture for making requests to FastAPI app
@pytest_asyncio.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://testserver") as client:
        yield client

import sqlalchemy
from sqlalchemy import text

# @pytest_asyncio.fixture(autouse=True)
# async def clear_db():
#     async with AsyncSessionLocal() as session:
#         await session.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
#         await session.commit()
