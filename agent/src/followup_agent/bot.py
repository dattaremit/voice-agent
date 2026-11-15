from loguru import logger
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.runner import PipelineRunner
from pipecat.runner.types import RunnerArguments
from pipecat.runner.utils import create_transport
from pipecat.transports.base_transport import TransportParams

from followup_agent.config import get_settings
from followup_agent.pipeline import CALL_OPENING, CallSession, build_call_session
from followup_agent.transcript import transcript_turns
from followup_agent.web_app import complete_call, start_call

TRANSPORT_PARAMS = {
    "webrtc": lambda: TransportParams(audio_in_enabled=True, audio_out_enabled=True),
}


async def _finish(call_id: str, session: CallSession) -> None:
    turns = transcript_turns(session.conversation, CALL_OPENING)
    await complete_call(call_id, turns)
    logger.info(f"Call {call_id} completed with {len(turns)} turns")


async def bot(runner_args: RunnerArguments) -> None:
    call_id = (runner_args.body or {}).get("callId")
    if not call_id:
        logger.error("Session rejected: no callId in request body")
        return
    context = await start_call(call_id)
    transport = await create_transport(runner_args, TRANSPORT_PARAMS)
    session = build_call_session(transport, context, get_settings())

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        await session.task.queue_frames([LLMRunFrame()])

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        await session.task.cancel()

    await PipelineRunner(handle_sigint=runner_args.handle_sigint).run(session.task)
    await _finish(call_id, session)
