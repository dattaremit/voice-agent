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


async def start_call(call_id: str) -> CallContext:
    async with _client() as client:
        response = await client.post(f"/api/calls/{call_id}/start")
        response.raise_for_status()
        return CallContext.model_validate(response.json())
