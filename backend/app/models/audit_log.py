from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    performed_by = Column(String, nullable=False)
    old_value = Column(String)
    new_value = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())