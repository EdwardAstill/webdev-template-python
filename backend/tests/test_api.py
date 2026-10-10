import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def test_health(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_example_message_contract(client: TestClient) -> None:
    response = client.get("/api/message")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/json"
    assert response.json() == {"message": "Hello from FastAPI."}


def test_unknown_route_is_not_forwarded(client: TestClient) -> None:
    response = client.get("/api/does-not-exist")

    assert response.status_code == 404


def test_message_is_read_only(client: TestClient) -> None:
    response = client.post("/api/message", json={"message": "changed"})

    assert response.status_code == 405
