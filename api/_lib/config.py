import os
from functools import lru_cache


@lru_cache
def get_settings():
    return {
        "jwt_secret": os.getenv("JWT_SECRET", "dev-architect-os-change-in-production"),
        "jwt_ttl_hours": int(os.getenv("JWT_TTL_HOURS", "24")),
        "cors_origins": [
            o.strip()
            for o in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
            if o.strip()
        ],
        "contact_webhook": os.getenv("CONTACT_WEBHOOK", "").strip(),
    }
