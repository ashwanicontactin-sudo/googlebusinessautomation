"""
Business endpoint routes.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional
import re


class BusinessBase(BaseModel):
    name: str
    description: Optional[str] = None
    description_seo: Optional[str] = Field(
        default=None,
        description="SEO-optimized description (min 50 characters recommended)",
    )
    address: str
    city: str
    state: str
    postal_code: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    category: Optional[str] = None
    keywords: list[str] = Field(
        default_factory=list,
        description="User-friendly SEO keywords for discoverability",
    )
    is_paid: bool = Field(
        default=False, description="Whether this business uses premium features"
    )
    plan_tier: str = Field(
        default="free", description="Subscription tier: free, premium, enterprise"
    )
    logo_url: Optional[str] = None
    published: bool = True


class BusinessCreate(BusinessBase):
    pass


class BusinessUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    description_seo: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    category: Optional[str] = None
    keywords: Optional[list[str]] = None
    is_paid: Optional[bool] = None
    plan_tier: Optional[str] = None
    logo_url: Optional[str] = None
    published: Optional[bool] = None


class BusinessResponse(BusinessBase):
    id: int
    public_slug: str
    model_config = ConfigDict(from_attributes=True)


router = APIRouter()

mock_businesses: dict[int, BusinessResponse] = {}
next_id = 1


def make_slug(name: str, business_id: int) -> str:
    """Create a stable, URL-safe public listing identifier."""
    base = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "business"
    return f"{base}-{business_id}"


@router.get("/", response_model=list[BusinessResponse])
async def list_businesses(skip: int = 0, limit: int = 100) -> list[BusinessResponse]:
    """List all businesses with pagination."""
    businesses = list(mock_businesses.values())[skip : skip + limit]
    return businesses


@router.get("/{business_id}", response_model=BusinessResponse)
async def get_business(business_id: int) -> BusinessResponse:
    """Get a single business by ID."""
    if business_id not in mock_businesses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Business not found"
        )
    return mock_businesses[business_id]


@router.get("/public/{public_slug}", response_model=BusinessResponse)
async def get_public_business(public_slug: str) -> BusinessResponse:
    """Return a published listing for its public profile page."""
    for business in mock_businesses.values():
        if business.public_slug == public_slug and business.published:
            return business
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND, detail="Published listing not found"
    )


@router.post("/", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
async def create_business(business: BusinessCreate) -> BusinessResponse:
    """Create a new business listing with optional SEO keywords and plan options."""
    global next_id
    new_business = BusinessResponse(
        id=next_id,
        public_slug=make_slug(business.name, next_id),
        **business.model_dump(),
    )
    next_id += 1
    mock_businesses[new_business.id] = new_business
    return new_business


@router.patch("/{business_id}", response_model=BusinessResponse)
async def update_business(business_id: int, update: BusinessUpdate) -> BusinessResponse:
    """Update an existing business listing."""
    if business_id not in mock_businesses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Business not found"
        )
    stored = mock_businesses[business_id]
    update_data = update.model_dump(exclude_unset=True)
    updated = stored.model_copy(update=update_data)
    mock_businesses[business_id] = updated
    return updated


@router.delete("/{business_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_business(business_id: int) -> None:
    """Delete a business listing."""
    if business_id not in mock_businesses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Business not found"
        )
    del mock_businesses[business_id]
