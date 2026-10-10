from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Webdev Template API", version="0.1.0")


class HealthResponse(BaseModel):
    status: Literal["ok"]


class MessageResponse(BaseModel):
    message: str


@app.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return HealthResponse(status="ok")


@app.get("/api/message", response_model=MessageResponse)
async def message() -> MessageResponse:
    return MessageResponse(message="Hello from FastAPI.")
