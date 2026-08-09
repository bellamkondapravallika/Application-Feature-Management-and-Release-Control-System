from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String, nullable=False)
    performed_by = Column(String, nullable=False)

    flag_id = Column(Integer, nullable=True)
    environment_id = Column(Integer, nullable=True)


    old_state = Column(Text, nullable=True)
    new_state = Column(Text, nullable=True)

    timestamp = Column(DateTime(timezone=True), server_default=func.now())