from pydantic import BaseModel, ConfigDict
from datetime import datetime

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    action: str
    performed_by: str
    old_value: str | None = None
    new_value: str | None = None
    timestamp: datetime | None = None
    flag_id: int | None = None
    environment_id: int | None = None
    old_state: str | None = None
    new_state: str | None = None