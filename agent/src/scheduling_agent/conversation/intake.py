from dataclasses import dataclass


@dataclass(frozen=True)
class IntakeField:
    key: str
    question: str


INTAKE_FIELDS = (
    IntakeField("reason_for_visit", "What is the main reason for the visit?"),
    IntakeField("symptoms", "What symptoms do they have, if any?"),
    IntakeField("symptom_duration", "How long have the symptoms been going on?"),
    IntakeField("current_medications", "What medications are they currently taking?"),
    IntakeField("allergies", "Do they have any allergies?"),
)

INTAKE_KEYS = tuple(field.key for field in INTAKE_FIELDS)
