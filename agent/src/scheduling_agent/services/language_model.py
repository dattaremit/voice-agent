from pipecat.services.openai.responses.llm import OpenAIResponsesLLMService, OpenAIResponsesReasoningConfig

from scheduling_agent.config import Settings

MAX_REPLY_TOKENS = 1500
CALL_REASONING = OpenAIResponsesReasoningConfig(effort="low")


def create_language_model(settings: Settings, system_prompt: str) -> OpenAIResponsesLLMService:
    return OpenAIResponsesLLMService(
        api_key=settings.openai_api_key,
        settings=OpenAIResponsesLLMService.Settings(
            model=settings.openai_call_model,
            system_instruction=system_prompt,
            max_completion_tokens=MAX_REPLY_TOKENS,
            reasoning=CALL_REASONING,
        ),
    )
