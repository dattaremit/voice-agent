import httpx

from followup_agent.call_context import CallContext
from followup_agent.config import get_settings


def _client() -> httpx.AsyncClient:
    settings = get_settings()
    return httpx.AsyncClient(
        base_url=settings.web_app_url,
        headers={"Authorization": f"Bearer {settings.agent_webhook_secret}"},
        timeout=10,
    )


async def _post(path: str, payload: dict | None = None) -> httpx.Response:
    async with _client() as client:
        response = await client.post(path, json=payload)
        response.raise_for_status()
        return response


async def start_call(call_id: str) -> CallContext:
    response = await _post(f"/api/calls/{call_id}/start")
    return CallContext.model_validate(response.json())


async def record_answer(call_id: str, question_key: str, value: str) -> None:
    await _post(f"/api/calls/{call_id}/answers", {"questionKey": question_key, "value": value})


async def complete_call(call_id: str, turns: list[dict[str, str]]) -> None:
    await _post(f"/api/calls/{call_id}/complete", {"turns": turns})
