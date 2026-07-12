from pydantic import BaseModel, ConfigDict


class FeatureFlagCreate(BaseModel):
    key: str
    description: str
    enabled: bool
    default_value: bool


class FeatureFlagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    key: str
    description: str
    enabled: bool
    default_value: bool


class FlagEvaluationRequest(BaseModel):
    flag_key: str
    environment: str


class FlagEvaluationResponse(BaseModel):
    flag_key: str
    value: bool