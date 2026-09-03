"""Plan catalog and checkout endpoints."""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel


class CheckoutRequest(BaseModel):
    plan_tier: str
    email: str


router = APIRouter()

PLANS = [
    {"id": "free", "name": "Free", "price": 0, "interval": "month", "description": "One public listing with core contact and location details."},
    {"id": "premium", "name": "Premium", "price": 9, "interval": "month", "description": "SEO tools, logo, media, analytics and priority publishing."},
    {"id": "enterprise", "name": "Enterprise", "price": 29, "interval": "month", "description": "Multiple locations, developer API access and advanced reporting."},
]


@router.get("/plans")
async def list_plans() -> dict[str, list[dict[str, object]]]:
    """Return the transparent plan catalog."""
    return {"plans": PLANS}


@router.post("/checkout")
async def start_checkout(request: CheckoutRequest) -> dict[str, object]:
    """Create a checkout placeholder until a payment provider is configured."""
    plan = next((item for item in PLANS if item["id"] == request.plan_tier), None)
    if plan is None:
        raise HTTPException(status_code=400, detail="Invalid plan")
    return {
        "status": "checkout_pending",
        "message": "Payment provider is not configured yet. No payment was charged.",
        "plan": plan,
        "email": request.email,
    }