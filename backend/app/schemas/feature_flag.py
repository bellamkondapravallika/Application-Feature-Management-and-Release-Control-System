from pydantic import BaseModel, ConfigDict
from typing import List

class FeatureFlagCreate(BaseModel):
    key: str
    description: str
    enabled: bool
    default_value: bool
    rollout_percentage: int=100


class FeatureFlagResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    key: str
    description: str
    enabled: bool
    default_value: bool
    rollout_percentage: int

class FlagEvaluationRequest(BaseModel):
    flag_key: str
    environment: str
    user_id: str
    groups:List[str]=[]

class FlagEvaluationResponse(BaseModel):
    flag_key: str
    enabled: bool
    reason: str
    bucket: int 
    rollout_percentage: int