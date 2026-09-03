"""
Listings platform integration routes.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import Optional


class ListingSubmission(BaseModel):
    business_id: int
    platform: str
    credentials: Optional[dict] = None


class ListingResponse(BaseModel):
    id: int
    business_id: int
    platform: str
    status: str
    submitted_at: Optional[str] = None


router = APIRouter()


@router.post(
    "/submit", response_model=ListingResponse, status_code=status.HTTP_201_CREATED
)
async def submit_listing(submission: ListingSubmission) -> ListingResponse:
    """Submit a business listing to a supported directory platform."""
    valid_platforms = ["google", "bing", "justdial", "indiamart", "yelp", "apple"]
    if submission.platform.lower() not in valid_platforms:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid platform. Valid options: {valid_platforms}",
        )
    return ListingResponse(
        id=1,
        business_id=submission.business_id,
        platform=submission.platform.lower(),
        status="pending",
    )


@router.get("/platforms")
async def get_supported_platforms() -> dict:
    """Get list of supported listing platforms."""
    return {
        "platforms": [
            {"name": "google", "label": "Google Business Profile"},
            {"name": "bing", "label": "Bing Places"},
            {"name": "justdial", "label": "JustDial"},
            {"name": "indiamart", "label": "IndiaMart"},
            {"name": "yelp", "label": "Yelp"},
            {"name": "apple", "label": "Apple Business Connect"},
        ]
    }


@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing_status(listing_id: int) -> ListingResponse:
    """Get listing submission status."""
    return ListingResponse(
        id=listing_id, business_id=1, platform="google", status="published"
    )
