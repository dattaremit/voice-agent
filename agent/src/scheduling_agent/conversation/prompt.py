from scheduling_agent.clinic_api.models import CallContext
from scheduling_agent.conversation.instructions import CALL_INSTRUCTIONS


def _clinic_section(context: CallContext) -> str:
    clinicians = "\n".join(f"- {c.name}, {c.specialty}, id {c.id}" for c in context.clinicians)
    return f"Clinic context:\n- Today is {context.today}.\n- Hours: {context.clinic_hours}.\nClinicians:\n{clinicians}"


def build_system_prompt(context: CallContext) -> str:
    return "\n\n".join([CALL_INSTRUCTIONS, _clinic_section(context)])
