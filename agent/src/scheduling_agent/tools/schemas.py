from pipecat.adapters.llm.schemas.function_schema import FunctionSchema
from pipecat.adapters.llm.schemas.tools_schema import ToolsSchema

from scheduling_agent.conversation.intake import INTAKE_KEYS
from scheduling_agent.conversation.outcomes import CALL_OUTCOMES

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
