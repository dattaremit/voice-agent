from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class ApiModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True, frozen=True)


class Clinician(ApiModel):
    id: str
    name: str
    specialty: str


class CallContext(ApiModel):
    call_id: str
    today: str
    clinic_hours: str
    clinicians: list[Clinician]
