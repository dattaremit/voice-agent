from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ENV_FILE = Path(__file__).resolve().parents[3] / ".env"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=ENV_FILE, extra="ignore")

    openai_api_key: str
    openai_call_model: str
    deepgram_api_key: str
    deepgram_model: str
    cartesia_api_key: str
    cartesia_model: str
    cartesia_voice_id: str
    agent_host: str = "localhost"
    agent_port: int = 7860
    web_app_url: str
    agent_webhook_secret: str


@lru_cache
def get_settings() -> Settings:
    return Settings()
