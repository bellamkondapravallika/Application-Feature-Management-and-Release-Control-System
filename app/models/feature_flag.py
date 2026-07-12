from sqlalchemy import Column, Integer, String, Boolean
from app.database import Base

class FeatureFlag(Base):
    __tablename__ = "feature_flag"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String, unique=True, nullable=False)
    description = Column(String)
    enabled = Column(Boolean, default=True)
    default_value = Column(Boolean, default=False)