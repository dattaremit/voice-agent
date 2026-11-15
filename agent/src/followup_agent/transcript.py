from typing import Any

from pipecat.processors.aggregators.llm_context import LLMContext

SPEAKERS = {"user": "patient", "assistant": "agent"}
TURN_MARKERS = "●◐○ "


def _text(content: Any) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return " ".join(block.get("text", "") for block in content if isinstance(block, dict) and block.get("type") == "text")
    return ""


def transcript_turns(conversation: LLMContext, opening: str) -> list[dict[str, str]]:
    turns = []
    for message in conversation.get_messages():
        if not isinstance(message, dict) or message.get("role") not in SPEAKERS:
            continue
        text = _text(message.get("content")).strip().lstrip(TURN_MARKERS)
        if text and text != opening:
            turns.append({"role": SPEAKERS[message["role"]], "text": text})
    return turns
