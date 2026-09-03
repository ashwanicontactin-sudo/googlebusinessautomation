"""
Locations endpoint routes.
"""

from fastapi import APIRouter, status
from pydantic import BaseModel, ConfigDict
from typing import Optional


class LocationBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    place_id: Optional[str] = None
    source: Optional[str] = None


class LocationCreate(LocationBase):
    pass


class LocationResponse(LocationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


router = APIRouter()

mock_locations: dict[int, LocationResponse] = {}
next_loc_id = 1


@router.get("/", response_model=list[LocationResponse])
async def list_locations() -> list[LocationResponse]:
    """List all saved locations."""
    return list(mock_locations.values())


@router.post("/", response_model=LocationResponse, status_code=status.HTTP_201_CREATED)
async def create_location(location: LocationCreate) -> LocationResponse:
    """Save a new location."""
    global next_loc_id
    new_loc = LocationResponse(id=next_loc_id, **location.model_dump())
    next_loc_id += 1
    mock_locations[new_loc.id] = new_loc
    return new_loc
