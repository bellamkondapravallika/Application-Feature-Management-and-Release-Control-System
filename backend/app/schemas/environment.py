from pydantic import BaseModel, ConfigDict


class EnvironmentCreate(BaseModel):
    name: str
    description: str


class EnvironmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str