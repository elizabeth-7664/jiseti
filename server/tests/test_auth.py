import sys
import os
import pytest
import pytest_asyncio
from httpx import AsyncClient

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app')))
from main import app

pytestmark = pytest.mark.asyncio

@pytest.mark.asyncio
async def test_register_user(async_client: AsyncClient):
    response = await async_client.post(
        "/api/auth/register",
        json={
            "email": "test3@example.com",
            "username": "testuser3",
            "password": "strongpassword"
        }
    )
    assert response.status_code == 201

@pytest.mark.asyncio
async def test_verify_user_email(async_client: AsyncClient):
    response = await async_client.get("/api/auth/verify-email?token=valid_token")
    assert response.status_code == 200
@pytest.mark.asyncio
async def test_login_user():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/auth/login",
            data={"username": "testuser3", "password": "strongpassword"},
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_forgot_password(async_client: AsyncClient):
    response = await async_client.post(
        "/api/auth/forgot-password",
        json={
            "email": "test@example.com"
        }
    )
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_reset_password(async_client: AsyncClient):
    response = await async_client.post(
        "/api/auth/reset-password",
        json={
            "token": "valid_token",
            "new_password": "newpassword"
        }
    )
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_db_connection(async_client: AsyncClient):
    response = await async_client.get("/api/auth/check-db")
    assert response.status_code == 200