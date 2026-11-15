from dataclasses import dataclass


@dataclass(frozen=True)
class Question:
    key: str
    instruction: str


QUESTIONS = (
    Question(
        "identity_verified",
        "Verify identity by asking the patient to confirm their date of birth. Never say the date of birth yourself. "
        "Record yes or no. If it does not match after two attempts, end the call with outcome identity_not_verified.",
    ),
    Question("overall_feeling", "Ask how they have been feeling overall since the visit."),
    Question("pain_score", "Ask them to rate any pain from zero to ten. Record the number."),
    Question("medication_adherence", "Ask whether they are taking the medication from the visit notes as prescribed."),
    Question("side_effects", "Ask whether they have noticed any side effects from the medication."),
    Question("visit_symptoms", "Ask about symptoms specific to the visit reason, using the visit notes."),
    Question("patient_questions", "Ask whether they have any questions for their clinician."),
)

QUESTION_KEYS = tuple(question.key for question in QUESTIONS)

CALL_OUTCOMES = ("completed", "identity_not_verified", "patient_unavailable", "emergency")
