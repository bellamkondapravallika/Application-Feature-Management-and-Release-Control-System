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
