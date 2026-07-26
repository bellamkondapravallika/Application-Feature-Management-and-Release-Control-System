from sqlalchemy import Column, Integer, String, ForeignKey
from app.database import Base

class TargetingRule(Base):
    __tablename__ = "targeting_rules"

    id = Column(Integer, primary_key=True, index=True)
    flag_id = Column(Integer, ForeignKey("feature_flag.id"))
    rule_type = Column(String, nullable=False)   # user / group
    rule_value = Column(String, nullable=False)