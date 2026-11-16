from typing import Any

import httpx

from scheduling_agent.call_context import CallContext
from scheduling_agent.config import get_settings


def _client() -> httpx.AsyncClient:
    settings = get_settings()
    return httpx.AsyncClient(
        base_url=settings.web_app_url,
        headers={"Authorization": f"Bearer {settings.agent_webhook_secret}"},
        timeout=10,
    )


async def _post(path: str, payload: dict | None = None) -> httpx.Response:
    async with _client() as client:
        return await client.post(path, json=payload)


async def _post_ok(path: str, payload: dict | None = None) -> httpx.Response:
    response = await _post(path, payload)
    response.raise_for_status()
    return response


async def call_api(call_id: str, action: str, payload: dict) -> dict[str, Any]:
    response = await _post(f"/api/calls/{call_id}/{action}", payload)
    if response.status_code == 204:
        return {"ok": True}
    return response.json()


async def start_call(call_id: str) -> CallContext:
    response = await _post_ok(f"/api/calls/{call_id}/start")
    return CallContext.model_validate(response.json())


async def record_answer(call_id: str, question_key: str, value: str) -> None:
    await _post_ok(f"/api/calls/{call_id}/answers", {"questionKey": question_key, "value": value})


async def complete_call(call_id: str, turns: list[dict[str, str]]) -> None:
    await _post_ok(f"/api/calls/{call_id}/complete", {"turns": turns})
