from sqlalchemy import Column, Integer, Boolean, ForeignKey
from app.database import Base

class EnvironmentOverride(Base):
    __tablename__ = "environment_override"

    id = Column(Integer, primary_key=True, index=True)
    flag_id = Column(Integer, ForeignKey("feature_flag.id"))
    environment_id = Column(Integer, ForeignKey("environments.id"))
    value = Column(Boolean)