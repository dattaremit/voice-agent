from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.processors.aggregators.llm_response_universal import LLMUserAggregatorParams
from pipecat.turns.user_turn_strategies import (
    FilterIncompleteUserTurnStrategies,
    MergeMode,
    UserTurnStrategiesParams,
)


def turn_taking_params() -> LLMUserAggregatorParams:
    return LLMUserAggregatorParams(
        vad_analyzer=SileroVADAnalyzer(),
        user_turn_strategies=FilterIncompleteUserTurnStrategies(),
        user_turn_strategies_params=UserTurnStrategiesParams(stop_merge_mode=MergeMode.EXTEND),
    )
