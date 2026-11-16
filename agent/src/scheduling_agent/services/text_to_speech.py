from pipecat.services.cartesia.tts import CartesiaTTSService

from scheduling_agent.config import Settings
from scheduling_agent.services.spoken_forms import SPOKEN_FORMS


def create_text_to_speech(settings: Settings) -> CartesiaTTSService:
    return CartesiaTTSService(
        api_key=settings.cartesia_api_key,
        settings=CartesiaTTSService.Settings(model=settings.cartesia_model, voice=settings.cartesia_voice_id),
        text_transforms=[("*", SPOKEN_FORMS)],
    )
