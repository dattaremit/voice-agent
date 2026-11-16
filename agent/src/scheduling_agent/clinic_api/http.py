import httpx

from scheduling_agent.config import get_settings


def _client() -> httpx.AsyncClient:
    settings = get_settings()
    return httpx.AsyncClient(
        base_url=settings.web_app_url,
        headers={"Authorization": f"Bearer {settings.agent_webhook_secret}"},
        timeout=10,
    )


async def post(path: str, payload: dict | None = None) -> httpx.Response:
    async with _client() as client:
        return await client.post(path, json=payload)


async def post_ok(path: str, payload: dict | None = None) -> httpx.Response:
    response = await post(path, payload)
    response.raise_for_status()
    return response
