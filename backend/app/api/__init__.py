"""
API routes package.
"""

from fastapi import APIRouter
from app.api.business import router as business_router
from app.api.locations import router as locations_router
from app.api.listings import router as listings_router
from app.api.auth import router as auth_router
from app.api.ads import router as ads_router
from app.api.analytics import router as analytics_router
from app.api.media import router as media_router

router = APIRouter()

router.include_router(auth_router, prefix="/auth", tags=["auth"])
router.include_router(business_router, prefix="/businesses", tags=["businesses"])
router.include_router(locations_router, prefix="/locations", tags=["locations"])
router.include_router(listings_router, prefix="/listings", tags=["listings"])
router.include_router(ads_router, prefix="/ads", tags=["ads"])
router.include_router(analytics_router, prefix="/analytics", tags=["analytics"])
router.include_router(media_router, prefix="/media", tags=["media"])
