from pipecat.services.deepgram.flux.stt import DeepgramFluxSTTService

from scheduling_agent.config import Settings


def create_speech_to_text(settings: Settings) -> DeepgramFluxSTTService:
    return DeepgramFluxSTTService(
        api_key=settings.deepgram_api_key,
        settings=DeepgramFluxSTTService.Settings(model=settings.deepgram_model),
    )
