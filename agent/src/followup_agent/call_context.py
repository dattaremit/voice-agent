from datetime import date, datetime

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ApiModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, frozen=True)


class Patient(ApiModel):
    name: str
    date_of_birth: date


class Visit(ApiModel):
    date: date
    reason: str
    clinician_name: str
    notes: str | None


class PreviousCall(ApiModel):
    date: datetime
    visit_reason: str
    triage_level: str
    summary: str
    medication_adherence: str
    red_flags: list[str]


class CallContext(ApiModel):
    call_id: str
    patient: Patient
    visit: Visit
    previous_calls: list[PreviousCall]
