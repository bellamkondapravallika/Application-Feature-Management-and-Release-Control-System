from pydantic import BaseModel, ConfigDict


class EnvironmentOverrideCreate(BaseModel):
    flag_id: int
    environment_id: int
    value: bool


class EnvironmentOverrideResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    flag_id: int
    environment_id: int
    value: bool