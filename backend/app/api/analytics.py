"""
Traffic analytics endpoint routes.
Tracks traffic from listing platforms to the business.
"""

from fastapi import APIRouter, status
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class TrafficEvent(BaseModel):
    business_id: int
    source: str
    event_type: str = "visit"


class TrafficResponse(BaseModel):
    business_id: int
    source: str
    total_visits: int
    date: str


router = APIRouter()

traffic_data: list[TrafficResponse] = [
    TrafficResponse(
        business_id=1,
        source="google",
        total_visits=1250,
        date=datetime.now().strftime("%Y-%m-%d"),
    ),
    TrafficResponse(
        business_id=1,
        source="bing",
        total_visits=432,
        date=datetime.now().strftime("%Y-%m-%d"),
    ),
    TrafficResponse(
        business_id=1,
        source="justdial",
        total_visits=890,
        date=datetime.now().strftime("%Y-%m-%d"),
    ),
    TrafficResponse(
        business_id=1,
        source="indiamart",
        total_visits=654,
        date=datetime.now().strftime("%Y-%m-%d"),
    ),
    TrafficResponse(
        business_id=1,
        source="yelp",
        total_visits=276,
        date=datetime.now().strftime("%Y-%m-%d"),
    ),
]


@router.get("/", response_model=list[TrafficResponse])
async def get_traffic(
    business_id: Optional[int] = None, source: Optional[str] = None
) -> list[TrafficResponse]:
    """Get traffic analytics data from listing platforms."""
    results = traffic_data
    if business_id is not None:
        results = [t for t in results if t.business_id == business_id]
    if source is not None:
        results = [t for t in results if t.source == source]
    return results


@router.post("/track", status_code=status.HTTP_201_CREATED)
async def track_traffic(event: TrafficEvent) -> dict:
    """Track a traffic event from a listing platform."""
    existing = next(
        (
            t
            for t in traffic_data
            if t.business_id == event.business_id and t.source == event.source
        ),
        None,
    )
    if existing:
        existing.total_visits += 1
    else:
        traffic_data.append(
            TrafficResponse(
                business_id=event.business_id,
                source=event.source,
                total_visits=1,
                date=datetime.now().strftime("%Y-%m-%d"),
            )
        )
    return {"tracked": True, "event_type": event.event_type}
