"""
Listing service layer for platform integrations.
"""

import requests
from app.config import settings


class ListingService:
    """Service for managing business listing submissions to external platforms."""

    PLATFORMS = ["google", "bing", "justdial", "indiamart", "yelp"]

    def __init__(self) -> None:
        self.supported_platforms = self.PLATFORMS

    def submit_to_platform(self, platform: str, business_data: dict) -> dict:
        """Submit business data to a specific listing platform.

        This is a stub implementation. Real integrations would use each
        platform's API with stored OAuth credentials.
        """
        if platform.lower() not in [p.lower() for p in self.PLATFORMS]:
            return {"success": False, "error": "Unsupported platform"}

        return {
            "success": True,
            "platform": platform,
            "status": "submitted",
            "reference_id": f"{platform}_{hash(str(business_data))}",
        }

    def geocode_address(self, address: str) -> tuple[float, float]:
        """Geocode an address using OpenStreetMap Nominatim.

        Falls back gracefully if the service is unavailable.
        """
        try:
            url = f"{settings.OPENSTREETMAP_NOMINATIM_URL}/search"
            params = {"q": address, "format": "json", "limit": 1}
            headers = {"User-Agent": "BusinessListingPlatform/1.0"}
            response = requests.get(url, params=params, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            if data and len(data) > 0:
                return float(data[0]["lat"]), float(data[0]["lon"])
        except (requests.RequestException, KeyError, ValueError) as e:
            print(f"Geocoding error: {e}")
        return 0.0, 0.0
