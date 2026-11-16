from loguru import logger
from pipecat.processors.aggregators.llm_context import LLMContext

from scheduling_agent.clinic_api.calls import complete_call
from scheduling_agent.conversation.opening import CALL_OPENING
from scheduling_agent.conversation.transcript import transcript_turns


async def report_call(call_id: str, conversation: LLMContext) -> None:
    turns = transcript_turns(conversation, CALL_OPENING)
    await complete_call(call_id, turns)
    logger.info(f"Call {call_id} completed with {len(turns)} turns")
