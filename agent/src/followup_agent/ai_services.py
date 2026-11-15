from pipecat.services.anthropic.llm import AnthropicLLMService
from pipecat.services.cartesia.tts import CartesiaTTSService
from pipecat.services.deepgram.flux.stt import DeepgramFluxSTTService

from followup_agent.config import Settings

MAX_REPLY_TOKENS = 400


def create_stt(settings: Settings) -> DeepgramFluxSTTService:
    return DeepgramFluxSTTService(
        api_key=settings.deepgram_api_key,
        settings=DeepgramFluxSTTService.Settings(model=settings.deepgram_model),
    )


def create_llm(settings: Settings, system_prompt: str) -> AnthropicLLMService:
    return AnthropicLLMService(
        api_key=settings.anthropic_api_key,
        settings=AnthropicLLMService.Settings(
            model=settings.anthropic_call_model,
            system_instruction=system_prompt,
            enable_prompt_caching=True,
            max_tokens=MAX_REPLY_TOKENS,
        ),
    )


def create_tts(settings: Settings) -> CartesiaTTSService:
    return CartesiaTTSService(
        api_key=settings.cartesia_api_key,
        settings=CartesiaTTSService.Settings(
            model=settings.cartesia_model,
            voice=settings.cartesia_voice_id,
        ),
    )
