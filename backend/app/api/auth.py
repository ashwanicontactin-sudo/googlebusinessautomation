"""
Authentication endpoint routes.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from urllib.parse import urlencode
from app.config import settings


class LoginRequest(BaseModel):
    username: str
    password: str


class RegisterRequest(LoginRequest):
    email: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str


router = APIRouter()


@router.get("/oauth/{provider}")
async def start_oauth(provider: str) -> dict[str, str]:
    """Return an OAuth authorization URL for Google or Meta (Facebook/Instagram)."""
    providers = {
        "google": (
            settings.GOOGLE_OAUTH_CLIENT_ID,
            settings.GOOGLE_OAUTH_REDIRECT_URI,
            "https://accounts.google.com/o/oauth2/v2/auth",
            "openid email profile",
        ),
        "meta": (
            settings.META_OAUTH_APP_ID,
            settings.META_OAUTH_REDIRECT_URI,
            "https://www.facebook.com/v19.0/dialog/oauth",
            "public_profile,email",
        ),
    }
    if provider not in providers:
        raise HTTPException(status_code=404, detail="Unsupported OAuth provider")
    client_id, redirect_uri, authorization_url, scope = providers[provider]
    if not client_id:
        raise HTTPException(
            status_code=503,
            detail=f"{provider.title()} OAuth is not configured. Add its client ID to .env.",
        )
    return {
        "provider": provider,
        "authorization_url": authorization_url + "?" + urlencode({
            "client_id": client_id,
            "redirect_uri": redirect_uri,
            "response_type": "code",
            "scope": scope,
        }),
    }


@router.post("/login", response_model=TokenResponse)
async def login(credentials: LoginRequest) -> TokenResponse:
    """Authenticate user and return access token."""
    return TokenResponse(access_token="dummy-token", token_type="bearer")


@router.post(
    "/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED
)
async def register(credentials: RegisterRequest) -> TokenResponse:
    """Register a new user account."""
    return TokenResponse(access_token="dummy-token", token_type="bearer")
