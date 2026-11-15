from dataclasses import dataclass

from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import (
    LLMContextAggregatorPair,
    LLMUserAggregatorParams,
)
from pipecat.transports.base_transport import BaseTransport
from pipecat.turns.user_turn_strategies import (
    FilterIncompleteUserTurnStrategies,
    MergeMode,
    UserTurnStrategiesParams,
)

from followup_agent.ai_services import create_llm, create_stt, create_tts
from followup_agent.cache_observer import PromptCacheObserver
from followup_agent.call_tools import CALL_TOOLS_SCHEMA, CallTools
from followup_agent.call_context import CallContext
from followup_agent.config import Settings
from followup_agent.prompt import build_system_prompt

CALL_OPENING = "The patient has just answered the phone. Begin the call."


def _user_params() -> LLMUserAggregatorParams:
    return LLMUserAggregatorParams(
        vad_analyzer=SileroVADAnalyzer(),
        user_turn_strategies=FilterIncompleteUserTurnStrategies(),
        user_turn_strategies_params=UserTurnStrategiesParams(stop_merge_mode=MergeMode.EXTEND),
    )


@dataclass(frozen=True)
class CallSession:
    task: PipelineTask
    conversation: LLMContext


def build_call_session(transport: BaseTransport, context: CallContext, settings: Settings) -> CallSession:
    conversation = LLMContext(messages=[{"role": "user", "content": CALL_OPENING}], tools=CALL_TOOLS_SCHEMA)
    aggregators = LLMContextAggregatorPair(conversation, user_params=_user_params())
    llm = create_llm(settings, build_system_prompt(context))
    CallTools(context.call_id).register(llm)
    pipeline = Pipeline(
        [
            transport.input(),
            create_stt(settings),
            aggregators.user(),
            llm,
            create_tts(settings),
            transport.output(),
            aggregators.assistant(),
        ]
    )
    task = PipelineTask(
        pipeline,
        params=PipelineParams(enable_metrics=True, enable_usage_metrics=True),
        observers=[PromptCacheObserver()],
    )
    return CallSession(task=task, conversation=conversation)
