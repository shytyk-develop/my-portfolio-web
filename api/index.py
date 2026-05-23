"""FastAPI backend — Vercel serverless ASGI entry."""

from __future__ import annotations

import secrets
import time
from typing import Annotated

import httpx
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import ORJSONResponse

from _lib.config import get_settings
from _lib.schemas import (
    ContactRequest,
    ContactResponse,
    HealthResponse,
    MetricsResponse,
    SessionInitResponse,
    SessionKeyResponse,
    StatusResponse,
    VerifyKeyRequest,
    VerifyKeyResponse,
)
from _lib.security import create_session_token, generate_security_key, key_from_token

API_VERSION = "2.1.0"
_START = time.time()

app = FastAPI(
    title="SHYTYK_DEV API",
    version=API_VERSION,
    default_response_class=ORJSONResponse,
)

settings = get_settings()
app.add_middleware(GZipMiddleware, minimum_size=500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings["cors_origins"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", version=API_VERSION, timestamp=time.time())


@app.get("/api/status", response_model=StatusResponse)
def status(request: Request) -> StatusResponse:
    uptime = int(time.time() - _START)
    return StatusResponse(
        online=True,
        region="eu-central",
        latency_ms=12,
        message=f"ARCHITECT_OS online — uptime {uptime}s",
        uptime=uptime,
    )


@app.get("/api/metrics", response_model=MetricsResponse)
def metrics() -> MetricsResponse:
    return MetricsResponse(
        api_version=API_VERSION,
        projects_indexed=6,
        stack_modules=4,
        experience_chapters=4,
    )


@app.post("/api/session/init", response_model=SessionInitResponse)
def session_init() -> SessionInitResponse:
    key = generate_security_key()
    token, session_id = create_session_token(key)
    return SessionInitResponse(security_key=key, token=token, session_id=session_id)


@app.post("/api/session/verify", response_model=VerifyKeyResponse)
def session_verify(body: VerifyKeyRequest) -> VerifyKeyResponse:
    valid = body.submitted.strip().upper() == body.stored.strip().upper()
    return VerifyKeyResponse(valid=valid)


@app.get("/api/session/key", response_model=SessionKeyResponse)
def session_key(authorization: Annotated[str | None, Header()] = None) -> SessionKeyResponse:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing session token")

    token = authorization[7:].strip()
    security_key = key_from_token(token)
    if not security_key:
        raise HTTPException(status_code=401, detail="Invalid or expired session")

    from _lib.security import decode_session_token

    decoded = decode_session_token(token) or {}
    return SessionKeyResponse(
        security_key=security_key,
        session_id=str(decoded.get("sid", "")),
        expires_at=int(decoded.get("exp", 0)),
    )


@app.post("/api/contact", response_model=ContactResponse)
async def contact(body: ContactRequest, request: Request) -> ContactResponse:
    ticket_id = secrets.token_hex(4).upper()
    cfg = get_settings()
    webhook = cfg["contact_webhook"]

    if webhook:
        try:
            async with httpx.AsyncClient(timeout=8.0) as client:
                await client.post(
                    webhook,
                    json={
                        "name": body.name,
                        "email": body.email,
                        "message": body.message,
                        "ticket": ticket_id,
                        "host": request.client.host if request.client else "unknown",
                    },
                )
        except Exception:
            pass

    return ContactResponse(ticket_id=ticket_id)
