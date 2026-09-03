"""
Test suite for backend application.
"""

from fastapi.testclient import TestClient
from app.main import app


class TestHealthCheck:
    def test_health(self) -> None:
        client = TestClient(app)
        response = client.get("/api/v1/health" if False else "/health")
        assert response.status_code == 200
        assert response.json()["status"] == "healthy"


class TestBusinessRoutes:
    def test_list_businesses(self) -> None:
        client = TestClient(app)
        response = client.get("/api/v1/businesses/")
        assert response.status_code == 200
        assert response.json() == []

    def test_created_business_has_public_listing_slug(self) -> None:
        client = TestClient(app)
        response = client.post(
            "/api/v1/businesses/",
            json={
                "name": "Demo Cafe",
                "address": "1 Main Street",
                "city": "Pune",
                "state": "Maharashtra",
                "postal_code": "411001",
            },
        )
        assert response.status_code == 201
        assert response.json()["public_slug"] == "demo-cafe-1"

        public_response = client.get("/api/v1/businesses/public/demo-cafe-1")
        assert public_response.status_code == 200
        assert public_response.json()["name"] == "Demo Cafe"


class TestAuthRoutes:
    def test_login(self) -> None:
        client = TestClient(app)
        response = client.post(
            "/api/v1/auth/login", json={"username": "test", "password": "test"}
        )
        assert response.status_code == 200
        assert "access_token" in response.json()

    def test_register(self) -> None:
        client = TestClient(app)
        response = client.post(
            "/api/v1/auth/register",
            json={"username": "new-user", "password": "secret", "email": "new@example.com"},
        )
        assert response.status_code == 201
        assert response.json()["token_type"] == "bearer"

    def test_unconfigured_google_oauth_is_explicit(self) -> None:
        client = TestClient(app)
        response = client.get("/api/v1/auth/oauth/google")
        assert response.status_code == 503
        assert "not configured" in response.json()["detail"]


class TestListingRoutes:
    def test_apple_business_connect_is_supported(self) -> None:
        client = TestClient(app)
        response = client.post(
            "/api/v1/listings/submit",
            json={"business_id": 1, "platform": "apple"},
        )
        assert response.status_code == 201
        assert response.json()["platform"] == "apple"
