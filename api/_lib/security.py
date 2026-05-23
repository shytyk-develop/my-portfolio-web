import secrets
import time

import jwt
from jwt import PyJWTError

from .config import get_settings

_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"


def generate_security_key(length: int = 16) -> str:
    return "".join(secrets.choice(_ALPHABET) for _ in range(length))


def create_session_token(security_key: str) -> tuple[str, str]:
    settings = get_settings()
    session_id = secrets.token_hex(8)
    payload = {
        "key": security_key.upper(),
        "sid": session_id,
        "exp": int(time.time()) + settings["jwt_ttl_hours"] * 3600,
    }
    token = jwt.encode(payload, settings["jwt_secret"], algorithm="HS256")
    return token, session_id


def decode_session_token(token: str) -> dict | None:
    settings = get_settings()
    try:
        return jwt.decode(token, settings["jwt_secret"], algorithms=["HS256"])
    except PyJWTError:
        return None


def key_from_token(token: str) -> str | None:
    payload = decode_session_token(token)
    if not payload:
        return None
    return str(payload.get("key", "")).upper() or None
