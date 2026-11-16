from loguru import logger
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.runner import PipelineRunner
from pipecat.runner.types import RunnerArguments
from pipecat.runner.utils import create_transport
from pipecat.transports.base_transport import TransportParams

from scheduling_agent.call_report import report_call
from scheduling_agent.clinic_api.calls import start_call
from scheduling_agent.config import get_settings
from scheduling_agent.pipeline.session import build_call_session

TRANSPORT_PARAMS = {
    "webrtc": lambda: TransportParams(audio_in_enabled=True, audio_out_enabled=True),
}


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
    await report_call(call_id, session.conversation)
