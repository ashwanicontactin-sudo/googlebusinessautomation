"""
Ads management endpoint routes.
Allows users to run and manage ad campaigns on the platform.
"""

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import date


class AdCampaignBase(BaseModel):
    business_id: int
    title: str
    budget: float
    daily_budget: float
    start_date: date
    end_date: Optional[date] = None


class AdCampaignCreate(AdCampaignBase):
    pass


class AdCampaignUpdate(BaseModel):
    title: Optional[str] = None
    budget: Optional[float] = None
    daily_budget: Optional[float] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None


class AdCampaignResponse(AdCampaignBase):
    id: int
    status: str
    impressions: int
    clicks: int
    model_config = ConfigDict(from_attributes=True)


class KeywordResponse(BaseModel):
    id: int
    keyword: str
    category: str
    search_volume: Optional[int] = None


router = APIRouter()

mock_ads: dict[int, AdCampaignResponse] = {}
next_ad_id = 1

mock_keywords: list[KeywordResponse] = [
    KeywordResponse(
        id=1, keyword="restaurant", category="Food & Dining", search_volume=99
    ),
    KeywordResponse(
        id=2, keyword="plumber", category="Home Services", search_volume=85
    ),
    KeywordResponse(id=3, keyword="hair salon", category="Beauty", search_volume=78),
    KeywordResponse(id=4, keyword="gym", category="Fitness", search_volume=92),
    KeywordResponse(id=5, keyword="hotel", category="Travel", search_volume=88),
    KeywordResponse(
        id=6, keyword="coffee shop", category="Food & Dining", search_volume=76
    ),
    KeywordResponse(id=7, keyword="lawyer", category="Legal", search_volume=65),
    KeywordResponse(id=8, keyword="dentist", category="Healthcare", search_volume=72),
]


@router.get("/", response_model=list[AdCampaignResponse])
async def list_ads() -> list[AdCampaignResponse]:
    """List all ad campaigns."""
    return list(mock_ads.values())


@router.get("/{ad_id}", response_model=AdCampaignResponse)
async def get_ad(ad_id: int) -> AdCampaignResponse:
    """Get a single ad campaign."""
    if ad_id not in mock_ads:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ad campaign not found"
        )
    return mock_ads[ad_id]


@router.post(
    "/", response_model=AdCampaignResponse, status_code=status.HTTP_201_CREATED
)
async def create_ad(ad: AdCampaignCreate) -> AdCampaignResponse:
    """Create a new ad campaign."""
    global next_ad_id
    new_ad = AdCampaignResponse(
        id=next_ad_id,
        status="draft",
        impressions=0,
        clicks=0,
        **ad.model_dump(),
    )
    next_ad_id += 1
    mock_ads[new_ad.id] = new_ad
    return new_ad


@router.patch("/{ad_id}", response_model=AdCampaignResponse)
async def update_ad(ad_id: int, update: AdCampaignUpdate) -> AdCampaignResponse:
    """Update an ad campaign."""
    if ad_id not in mock_ads:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ad campaign not found"
        )
    stored = mock_ads[ad_id]
    update_data = update.model_dump(exclude_unset=True)
    updated = stored.model_copy(update=update_data)
    mock_ads[ad_id] = updated
    return updated


@router.post("/{ad_id}/launch", response_model=AdCampaignResponse)
async def launch_ad(ad_id: int) -> AdCampaignResponse:
    """Launch an ad campaign (set status to active)."""
    if ad_id not in mock_ads:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ad campaign not found"
        )
    ad = mock_ads[ad_id]
    ad.status = "active"
    return ad


@router.post("/{ad_id}/pause", response_model=AdCampaignResponse)
async def pause_ad(ad_id: int) -> AdCampaignResponse:
    """Pause an ad campaign."""
    if ad_id not in mock_ads:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Ad campaign not found"
        )
    ad = mock_ads[ad_id]
    ad.status = "paused"
    return ad


@router.get("/keywords/search", response_model=list[KeywordResponse])
async def search_keywords(query: str = "") -> list[KeywordResponse]:
    """Search for user-friendly SEO keywords by category or keyword."""
    if not query:
        return mock_keywords
    query_lower = query.lower()
    return [
        kw
        for kw in mock_keywords
        if query_lower in kw.keyword.lower() or query_lower in kw.category.lower()
    ]


@router.get("/keywords", response_model=list[KeywordResponse])
async def list_keywords() -> list[KeywordResponse]:
    """List all available SEO keywords by category."""
    return mock_keywords


@router.get("/platforms", response_model=dict)
async def ad_platforms() -> dict:
    """Get supported external ad platform integrations."""
    return {
        "platforms": [
            {"name": "google_ads", "label": "Google Ads"},
            {"name": "meta_ads", "label": "Meta / Facebook Pixel"},
            {"name": "apple_search_ads", "label": "Apple Search Ads"},
            {"name": "bing_ads", "label": "Microsoft Advertising (Bing Ads)"},
            {"name": "linkedin_ads", "label": "LinkedIn Ads"},
        ]
    }


class AnalyticsConfig(BaseModel):
    business_id: int
    google_analytics_id: Optional[str] = None
    google_ads_conversion_id: Optional[str] = None
    meta_pixel_id: Optional[str] = None
    apple_search_ads_id: Optional[str] = None


@router.post(
    "/analytics-config",
    response_model=AnalyticsConfig,
    status_code=status.HTTP_201_CREATED,
)
async def set_analytics_config(config: AnalyticsConfig) -> AnalyticsConfig:
    """Set analytics and ad tracking configuration for a business."""
    return config
