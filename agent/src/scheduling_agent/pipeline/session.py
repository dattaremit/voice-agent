from dataclasses import dataclass

from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import LLMContextAggregatorPair
from pipecat.transports.base_transport import BaseTransport

from scheduling_agent.clinic_api.models import CallContext
from scheduling_agent.config import Settings
from scheduling_agent.conversation.opening import CALL_OPENING
from scheduling_agent.conversation.prompt import build_system_prompt
from scheduling_agent.pipeline.cache_observer import PromptCacheObserver
from scheduling_agent.pipeline.turn_taking import turn_taking_params
from scheduling_agent.services.language_model import create_language_model
from scheduling_agent.services.speech_to_text import create_speech_to_text
from scheduling_agent.services.text_to_speech import create_text_to_speech
from scheduling_agent.tools.handlers import CallTools
from scheduling_agent.tools.schemas import CALL_TOOLS_SCHEMA


@dataclass(frozen=True)
class CallSession:
    task: PipelineTask
    conversation: LLMContext


def build_call_session(transport: BaseTransport, context: CallContext, settings: Settings) -> CallSession:
    conversation = LLMContext(messages=[{"role": "user", "content": CALL_OPENING}], tools=CALL_TOOLS_SCHEMA)
    aggregators = LLMContextAggregatorPair(conversation, user_params=turn_taking_params())
    llm = create_language_model(settings, build_system_prompt(context))
    CallTools(context.call_id).register(llm)
    pipeline = Pipeline(
        [
            transport.input(),
            create_speech_to_text(settings),
            aggregators.user(),
            llm,
            create_text_to_speech(settings),
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
