from typing import Any

from scheduling_agent.clinic_api.http import post, post_ok
from scheduling_agent.clinic_api.models import CallContext


def _path(call_id: str, action: str) -> str:
    return f"/api/calls/{call_id}/{action}"


async def call_action(call_id: str, action: str, payload: dict) -> dict[str, Any]:
    response = await post(_path(call_id, action), payload)
    return {"ok": True} if response.status_code == 204 else response.json()


async def start_call(call_id: str) -> CallContext:
    response = await post_ok(_path(call_id, "start"))
    return CallContext.model_validate(response.json())


async def record_answer(call_id: str, question_key: str, value: str) -> None:
    await post_ok(_path(call_id, "answers"), {"questionKey": question_key, "value": value})


async def complete_call(call_id: str, turns: list[dict[str, str]]) -> None:
    await post_ok(_path(call_id, "complete"), {"turns": turns})
