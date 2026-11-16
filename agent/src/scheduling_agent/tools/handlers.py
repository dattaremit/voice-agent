from collections.abc import Awaitable, Callable
from typing import Any

from loguru import logger
from pipecat.frames.frames import EndWorkerFrame, FunctionCallResultProperties
from pipecat.services.llm_service import FunctionCallParams, LLMService

from scheduling_agent.clinic_api.calls import call_action, record_answer
from scheduling_agent.conversation.outcomes import OUTCOME_KEY, RED_FLAG_KEY
from scheduling_agent.tools import schemas

Handler = Callable[[FunctionCallParams], Awaitable[None]]


class CallTools:
    def __init__(self, call_id: str) -> None:
        self._call_id = call_id

    def register(self, llm: LLMService) -> None:
        handlers: dict[str, Handler] = {
            schemas.IDENTIFY_PATIENT.name: self._identify_patient,
            schemas.RECORD_INTAKE.name: self._record_intake,
            schemas.FIND_AVAILABLE_SLOTS.name: self._find_available_slots,
            schemas.BOOK_APPOINTMENT.name: self._book_appointment,
            schemas.CANCEL_APPOINTMENT.name: self._cancel_appointment,
            schemas.REPORT_RED_FLAG.name: self._report_red_flag,
            schemas.END_CALL.name: self._end_call,
        }
        for name, handler in handlers.items():
            llm.register_function(name, handler)

    async def _action(self, params: FunctionCallParams, action: str, payload: dict[str, Any]) -> None:
        await params.result_callback(await call_action(self._call_id, action, payload))

    async def _save(self, params: FunctionCallParams, key: str, value: str) -> None:
        await record_answer(self._call_id, key, value)
        await params.result_callback({"saved": key})

    async def _identify_patient(self, params: FunctionCallParams) -> None:
        args = params.arguments
        await self._action(params, "identify", {"name": args["full_name"], "dateOfBirth": args["date_of_birth"]})

    async def _record_intake(self, params: FunctionCallParams) -> None:
        await self._save(params, params.arguments["field"], params.arguments["answer"])

    async def _find_available_slots(self, params: FunctionCallParams) -> None:
        args = params.arguments
        filters = {
            "clinicianId": args.get("clinician_id"),
            "specialty": args.get("specialty"),
            "date": args.get("date"),
            "partOfDay": args.get("part_of_day") or "any",
        }
        await self._action(params, "availability", {key: value for key, value in filters.items() if value})

    async def _book_appointment(self, params: FunctionCallParams) -> None:
        args = params.arguments
        payload = {"clinicianId": args["clinician_id"], "startsAt": args["starts_at"], "reason": args["reason"]}
        await self._action(params, "appointments", payload)

    async def _cancel_appointment(self, params: FunctionCallParams) -> None:
        await self._action(params, "cancellations", {"appointmentId": params.arguments["appointment_id"]})

    async def _report_red_flag(self, params: FunctionCallParams) -> None:
        logger.warning(f"Red flag on call {self._call_id}: {params.arguments['symptom']}")
        await self._save(params, RED_FLAG_KEY, params.arguments["symptom"])

    async def _end_call(self, params: FunctionCallParams) -> None:
        outcome = params.arguments["outcome"]
        await record_answer(self._call_id, OUTCOME_KEY, outcome)
        await params.result_callback({"ended": outcome}, properties=FunctionCallResultProperties(run_llm=False))
        await params.llm.push_frame(EndWorkerFrame(reason=outcome))
