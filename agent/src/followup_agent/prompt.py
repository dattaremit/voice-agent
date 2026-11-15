from followup_agent.call_context import CallContext, PreviousCall
from followup_agent.instructions import CALL_INSTRUCTIONS


def _previous_call_line(call: PreviousCall) -> str:
    flags = ", ".join(call.red_flags) or "none"
    return (
        f"- {call.date:%B %d, %Y} ({call.visit_reason}), triage {call.triage_level}: "
        f"{call.summary} Medication adherence: {call.medication_adherence}. Red flags: {flags}."
    )


def _previous_calls_section(context: CallContext) -> str:
    if not context.previous_calls:
        return "Previous follow-up calls: none. This is the first follow-up call."
    lines = "\n".join(_previous_call_line(call) for call in context.previous_calls)
    return f"Previous follow-up calls, most recent first:\n{lines}"


def _patient_section(context: CallContext) -> str:
    patient, visit = context.patient, context.visit
    return (
        "Patient context for this call:\n"
        f"- Patient name: {patient.name}\n"
        f"- Date of birth on file, for verification only: {patient.date_of_birth:%B %d, %Y}\n"
        f"- Visit date: {visit.date:%B %d, %Y}\n"
        f"- Visit reason: {visit.reason}\n"
        f"- Clinician: {visit.clinician_name}\n"
        f"- Visit notes: {visit.notes or 'none'}"
    )


def build_system_prompt(context: CallContext) -> str:
    return "\n\n".join([CALL_INSTRUCTIONS, _patient_section(context), _previous_calls_section(context)])
