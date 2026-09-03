"""
Media management endpoint routes.
Supports photos, videos, and HTML ad uploads for business listings.
"""

from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form
from pydantic import BaseModel
from typing import Optional
import os
import shutil
from uuid import uuid4


class MediaResponse(BaseModel):
    id: int
    business_id: int
    filename: str
    file_type: str
    url: str
    media_type: str  # "photo", "video", or "html_ad"
    caption: Optional[str] = None
    is_ad: bool = False
    embed_code: Optional[str] = None
    sort_order: int = 0


class AdEmbedRequest(BaseModel):
    business_id: int
    title: str
    html_content: str
    width: Optional[int] = 300
    height: Optional[int] = 250
    media_type: str = "html_ad"


router = APIRouter()

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

mock_media: dict[int, MediaResponse] = {}
next_media_id = 1


@router.get("/business/{business_id}", response_model=list[MediaResponse])
async def list_business_media(business_id: int) -> list[MediaResponse]:
    """List all media for a business."""
    return [m for m in mock_media.values() if m.business_id == business_id]


@router.post(
    "/upload", response_model=MediaResponse, status_code=status.HTTP_201_CREATED
)
async def upload_media(
    business_id: int = Form(...),
    file: UploadFile = File(...),
    caption: str = Form(None),
    media_type: str = Form("photo"),
    is_ad: bool = Form(False),
) -> MediaResponse:
    """Upload a photo or video for a business listing."""
    global next_media_id

    if media_type not in ("photo", "video"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="media_type must be 'photo' or 'video'",
        )

    file_ext = os.path.splitext(file.filename or "")[1]
    stored_filename = f"{uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, stored_filename)

    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    new_media = MediaResponse(
        id=next_media_id,
        business_id=business_id,
        filename=file.filename or "unnamed",
        file_type=file_ext,
        url=f"/uploads/{stored_filename}",
        media_type=media_type,
        caption=caption,
        is_ad=bool(is_ad),
    )
    next_media_id += 1
    mock_media[new_media.id] = new_media
    return new_media


@router.post(
    "/embed", response_model=MediaResponse, status_code=status.HTTP_201_CREATED
)
async def create_html_ad(ad: AdEmbedRequest) -> MediaResponse:
    """Create an HTML ad embed for a business (supports all formats)."""
    global next_media_id

    embed_code = (
        f'<div class="blp-ad" data-media-id="{next_media_id}">{ad.html_content}</div>'
    )

    new_media = MediaResponse(
        id=next_media_id,
        business_id=ad.business_id,
        filename=f"html_ad_{next_media_id}",
        file_type=".html",
        url=f"/embed/{next_media_id}",
        media_type="html_ad",
        caption=ad.title,
        is_ad=True,
        embed_code=embed_code,
    )
    next_media_id += 1
    mock_media[new_media.id] = new_media
    return new_media


@router.get("/{media_id}", response_model=MediaResponse)
async def get_media(media_id: int) -> MediaResponse:
    """Get media by ID."""
    if media_id not in mock_media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Media not found"
        )
    return mock_media[media_id]


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(media_id: int) -> None:
    """Delete media by ID."""
    if media_id not in mock_media:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Media not found"
        )
    del mock_media[media_id]
