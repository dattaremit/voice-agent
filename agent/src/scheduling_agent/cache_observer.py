from loguru import logger
from pipecat.frames.frames import MetricsFrame
from pipecat.metrics.metrics import LLMTokenUsage, LLMUsageMetricsData
from pipecat.observers.base_observer import BaseObserver, FramePushed


class PromptCacheObserver(BaseObserver):
    def __init__(self) -> None:
        super().__init__()
        self._seen_frames: set[int] = set()
        self._responses = 0

    async def on_push_frame(self, data: FramePushed) -> None:
        frame = data.frame
        if not isinstance(frame, MetricsFrame) or frame.id in self._seen_frames:
            return
        self._seen_frames.add(frame.id)
        for metrics in frame.data:
            if isinstance(metrics, LLMUsageMetricsData):
                self._report(metrics.value)

    def _report(self, usage: LLMTokenUsage) -> None:
        self._responses += 1
        logger.info(
            f"Prompt cache response {self._responses}: read={usage.cache_read_input_tokens} "
            f"written={usage.cache_creation_input_tokens} uncached={usage.prompt_tokens}"
        )
        if self._responses > 1 and not usage.cache_read_input_tokens:
            logger.warning("Prompt cache miss after the first response")
