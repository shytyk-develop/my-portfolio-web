from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    version: str
    timestamp: float


class StatusResponse(BaseModel):
    online: bool
    region: str
    latency_ms: int
    message: str
    uptime: int


class SessionInitResponse(BaseModel):
    security_key: str
    token: str
    session_id: str


class VerifyKeyRequest(BaseModel):
    submitted: str = Field(min_length=8, max_length=32)
    stored: str = Field(min_length=8, max_length=32)


class VerifyKeyResponse(BaseModel):
    valid: bool


class SessionKeyResponse(BaseModel):
    security_key: str
    session_id: str
    expires_at: int


class ContactRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(min_length=5, max_length=120, pattern=r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
    message: str = Field(min_length=10, max_length=2000)


class ContactResponse(BaseModel):
    ticket_id: str


class MetricsResponse(BaseModel):
    api_version: str
    projects_indexed: int
    stack_modules: int
    experience_chapters: int
