"""
Shared utilities and types between frontend and backend.
"""

# Shared constants
PLATFORM_GOOGLE = "google"
PLATFORM_BING = "bing"
PLATFORM_JUSTDIAL = "justdial"
PLATFORM_INDIAART = "indiamart"
PLATFORM_YELP = "yelp"

SUPPORTED_PLATFORMS = [
    PLATFORM_GOOGLE,
    PLATFORM_BING,
    PLATFORM_JUSTDIAL,
    PLATFORM_INDIAART,
    PLATFORM_YELP,
]

# Tier constants
TIER_FREE = "free"
TIER_PREMIUM = "premium"
TIER_ENTERPRISE = "enterprise"

# Default values
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
