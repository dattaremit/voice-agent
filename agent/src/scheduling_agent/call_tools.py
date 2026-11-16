from collections.abc import Awaitable, Callable
from typing import Any

from loguru import logger
from pipecat.adapters.llm.schemas.function_schema import FunctionSchema
from pipecat.adapters.llm.schemas.tools_schema import ToolsSchema
from pipecat.frames.frames import EndWorkerFrame, FunctionCallResultProperties
from pipecat.services.llm_service import FunctionCallParams, LLMService

from scheduling_agent.questions import CALL_OUTCOMES, INTAKE_KEYS
from scheduling_agent.web_app import call_api, record_answer

RED_FLAG_KEY = "red_flag"
OUTCOME_KEY = "call_outcome"

IDENTIFY_PATIENT = FunctionSchema(
    name="identify_patient",
    description="Look up the caller by full name and date of birth. Returns their upcoming appointments.",
    properties={
        "full_name": {"type": "string", "description": "The caller's full name."},
        "date_of_birth": {"type": "string", "description": "Date of birth as YYYY-MM-DD."},
    },
    required=["full_name", "date_of_birth"],
)

RECORD_INTAKE = FunctionSchema(
    name="record_intake",
    description="Save the answer the patient just gave to one intake question. Only call it after they answered.",
    properties={
        "field": {"type": "string", "enum": list(INTAKE_KEYS), "description": "The intake question answered."},
        "answer": {"type": "string", "description": "Short factual summary in the patient's words."},
    },
    required=["field", "answer"],
)

FIND_AVAILABLE_SLOTS = FunctionSchema(
    name="find_available_slots",
    description="Find open appointment times. Filter by clinician or specialty, and optionally a date and part of day.",
    properties={
        "clinician_id": {"type": "string", "description": "A clinician id from the clinician list."},
        "specialty": {"type": "string", "description": "A specialty from the clinician list."},
        "date": {"type": "string", "description": "A specific date as YYYY-MM-DD."},
        "part_of_day": {"type": "string", "enum": ["morning", "afternoon", "any"]},
    },
    required=[],
)

BOOK_APPOINTMENT = FunctionSchema(
    name="book_appointment",
    description="Book a slot returned by find_available_slots, after the patient confirmed it.",
    properties={
        "clinician_id": {"type": "string", "description": "The slot's clinician id."},
        "starts_at": {"type": "string", "description": "The slot's startsAt value, exactly as returned."},
        "reason": {"type": "string", "description": "Short reason for the visit."},
    },
    required=["clinician_id", "starts_at", "reason"],
)

CANCEL_APPOINTMENT = FunctionSchema(
    name="cancel_appointment",
    description="Cancel one of the identified patient's upcoming appointments.",
    properties={"appointment_id": {"type": "string", "description": "The appointment id to cancel."}},
    required=["appointment_id"],
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
    properties={"outcome": {"type": "string", "enum": list(CALL_OUTCOMES), "description": "How the call ended."}},
    required=["outcome"],
)

CALL_TOOLS_SCHEMA = ToolsSchema(
    standard_tools=[
        IDENTIFY_PATIENT,
        RECORD_INTAKE,
        FIND_AVAILABLE_SLOTS,
        BOOK_APPOINTMENT,
        CANCEL_APPOINTMENT,
        REPORT_RED_FLAG,
        END_CALL,
    ]
)

Handler = Callable[[FunctionCallParams], Awaitable[None]]


class CallTools:
    def __init__(self, call_id: str) -> None:
        self._call_id = call_id

    def register(self, llm: LLMService) -> None:
        handlers: dict[str, Handler] = {
            IDENTIFY_PATIENT.name: self._identify_patient,
            RECORD_INTAKE.name: self._record_intake,
            FIND_AVAILABLE_SLOTS.name: self._find_available_slots,
            BOOK_APPOINTMENT.name: self._book_appointment,
            CANCEL_APPOINTMENT.name: self._cancel_appointment,
            REPORT_RED_FLAG.name: self._report_red_flag,
            END_CALL.name: self._end_call,
        }
        for name, handler in handlers.items():
            llm.register_function(name, handler)

    async def _api(self, params: FunctionCallParams, action: str, payload: dict[str, Any]) -> None:
        await params.result_callback(await call_api(self._call_id, action, payload))

    async def _save(self, params: FunctionCallParams, key: str, value: str) -> None:
        await record_answer(self._call_id, key, value)
        await params.result_callback({"saved": key})

    async def _identify_patient(self, params: FunctionCallParams) -> None:
        args = params.arguments
        await self._api(params, "identify", {"name": args["full_name"], "dateOfBirth": args["date_of_birth"]})

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
        await self._api(params, "availability", {key: value for key, value in filters.items() if value})

    async def _book_appointment(self, params: FunctionCallParams) -> None:
        args = params.arguments
        payload = {"clinicianId": args["clinician_id"], "startsAt": args["starts_at"], "reason": args["reason"]}
        await self._api(params, "appointments", payload)

    async def _cancel_appointment(self, params: FunctionCallParams) -> None:
        await self._api(params, "cancellations", {"appointmentId": params.arguments["appointment_id"]})

    async def _report_red_flag(self, params: FunctionCallParams) -> None:
        logger.warning(f"Red flag on call {self._call_id}: {params.arguments['symptom']}")
        await self._save(params, RED_FLAG_KEY, params.arguments["symptom"])

    async def _end_call(self, params: FunctionCallParams) -> None:
        outcome = params.arguments["outcome"]
        await record_answer(self._call_id, OUTCOME_KEY, outcome)
        await params.result_callback({"ended": outcome}, properties=FunctionCallResultProperties(run_llm=False))
        await params.llm.push_frame(EndWorkerFrame(reason=outcome))
