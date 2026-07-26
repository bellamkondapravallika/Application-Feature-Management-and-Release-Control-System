import os

os.environ.setdefault("DATABASE_URL", "sqlite:///./test_feature_flags.db")

from fastapi.testclient import TestClient

from app.database import Base, engine
from app.main import app


def setup_module():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_signup_login_and_profile_flow():
    client = TestClient(app)

    signup_response = client.post(
        "/auth/signup",
        json={"username": "Test User", "email": "test@example.com", "password": "password123"},
    )
    assert signup_response.status_code == 200, signup_response.text

    login_response = client.post(
        "/auth/login",
        data={"username": "test@example.com", "password": "password123"},
    )
    assert login_response.status_code == 200, login_response.text
    token = login_response.json()["access_token"]
    assert token

    profile_response = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert profile_response.status_code == 200, profile_response.text
    assert profile_response.json()["email"] == "test@example.com"
