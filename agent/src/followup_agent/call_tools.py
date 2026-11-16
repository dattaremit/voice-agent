from loguru import logger
from pipecat.adapters.llm.schemas.function_schema import FunctionSchema
from pipecat.adapters.llm.schemas.tools_schema import ToolsSchema
from pipecat.frames.frames import EndWorkerFrame, FunctionCallResultProperties
from pipecat.services.llm_service import FunctionCallParams, LLMService

from followup_agent.questions import CALL_OUTCOMES, QUESTION_KEYS
from followup_agent.web_app import record_answer

RED_FLAG_KEY = "red_flag"
OUTCOME_KEY = "call_outcome"

RECORD_ANSWER = FunctionSchema(
    name="record_answer",
    description="Save the answer the patient just gave to one follow-up question. Only call it after the patient has answered.",
    properties={
        "question_key": {"type": "string", "enum": list(QUESTION_KEYS), "description": "The question answered."},
        "answer": {"type": "string", "description": "Short factual summary of the answer in the patient's words."},
    },
    required=["question_key", "answer"],
)

REPORT_RED_FLAG = FunctionSchema(
    name="report_red_flag",
    description="Alert the care team about an emergency symptom the patient mentioned.",
    properties={"symptom": {"type": "string", "description": "The symptom in the patient's words."}},
    required=["symptom"],
)

END_CALL = FunctionSchema(
    name="end_call",
    description="Hang up the call. Required right after every goodbye; the call stays open until this is called.",
    properties={"outcome": {"type": "string", "enum": list(CALL_OUTCOMES), "description": "Why the call ended."}},
    required=["outcome"],
)

CALL_TOOLS_SCHEMA = ToolsSchema(standard_tools=[RECORD_ANSWER, REPORT_RED_FLAG, END_CALL])


class CallTools:
    def __init__(self, call_id: str) -> None:
        self._call_id = call_id

    def register(self, llm: LLMService) -> None:
        llm.register_function(RECORD_ANSWER.name, self._record_answer)
        llm.register_function(REPORT_RED_FLAG.name, self._report_red_flag)
        llm.register_function(END_CALL.name, self._end_call)

    async def _save(self, params: FunctionCallParams, key: str, value: str) -> None:
        await record_answer(self._call_id, key, value)
        await params.result_callback({"saved": key})

    async def _record_answer(self, params: FunctionCallParams) -> None:
        await self._save(params, params.arguments["question_key"], params.arguments["answer"])

    async def _report_red_flag(self, params: FunctionCallParams) -> None:
        logger.warning(f"Red flag on call {self._call_id}: {params.arguments['symptom']}")
        await self._save(params, RED_FLAG_KEY, params.arguments["symptom"])

    async def _end_call(self, params: FunctionCallParams) -> None:
        outcome = params.arguments["outcome"]
        await record_answer(self._call_id, OUTCOME_KEY, outcome)
        await params.result_callback({"ended": outcome}, properties=FunctionCallResultProperties(run_llm=False))
        await params.llm.push_frame(EndWorkerFrame(reason=outcome))
