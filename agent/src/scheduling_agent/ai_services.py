from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.deepgram.flux.stt import DeepgramFluxSTTService
from pipecat.services.openai.responses.llm import OpenAIResponsesLLMService, OpenAIResponsesReasoningConfig
from pipecat.utils.text.transforms.replacements import replace_text

from scheduling_agent.config import Settings

MAX_REPLY_TOKENS = 1500
CALL_REASONING = OpenAIResponsesReasoningConfig(effort="low")

SPOKEN_FORMS = replace_text([(r"\b911\b", "nine one one")])


def create_stt(settings: Settings) -> DeepgramFluxSTTService:
    return DeepgramFluxSTTService(
        api_key=settings.deepgram_api_key,
        settings=DeepgramFluxSTTService.Settings(model=settings.deepgram_model),
    )


def create_llm(settings: Settings, system_prompt: str) -> OpenAIResponsesLLMService:
    return OpenAIResponsesLLMService(
        api_key=settings.openai_api_key,
        settings=OpenAIResponsesLLMService.Settings(
            model=settings.openai_call_model,
            system_instruction=system_prompt,
            max_completion_tokens=MAX_REPLY_TOKENS,
            reasoning=CALL_REASONING,
        ),
    )


def create_tts(settings: Settings) -> CartesiaTTSService:
    return CartesiaTTSService(
        api_key=settings.cartesia_api_key,
        settings=CartesiaTTSService.Settings(
            model=settings.cartesia_model,
            voice=settings.cartesia_voice_id,
        ),
        text_transforms=[("*", SPOKEN_FORMS)],
    )
