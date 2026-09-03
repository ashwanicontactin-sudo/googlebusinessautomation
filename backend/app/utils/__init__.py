"""
Utility functions and helpers.
"""

import hashlib
import re
from datetime import datetime


def generate_id(prefix: str = "blp") -> str:
    """Generate a unique ID with a prefix."""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    hash_part = hashlib.md5(str(datetime.now().timestamp()).encode()).hexdigest()[:8]
    return f"{prefix}_{timestamp}_{hash_part}"


def clean_phone_number(phone: str) -> str:
    """Remove non-digit characters from a phone number."""
    return re.sub(r"\D", "", phone)


def validate_email(email: str) -> bool:
    """Basic email validation."""
    pattern = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return bool(re.match(pattern, email))


def format_business_name(name: str) -> str:
    """Format a business name for display."""
    return name.strip().title()
