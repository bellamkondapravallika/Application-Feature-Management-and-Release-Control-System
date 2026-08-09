from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.targeting_rule import TargetingRule
from app.schemas.targeting_rule import TargetingRuleCreate
from app.routers.audit_log import log_audit_action
from app.routers.auth import get_current_user

router = APIRouter(prefix="/targeting-rules", tags=["Targeting Rules"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_rule(rule: TargetingRuleCreate, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    new_rule = TargetingRule(**rule.model_dump())
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    log_audit_action(
    db=db,
    action="Group Target Added",
    performed_by=current_user["email"],
    flag_id=new_rule.flag_id,
    new_value=f"{new_rule.rule_type}:{new_rule.rule_value}"
)
    return new_rule

@router.get("/")
def get_rules(db: Session = Depends(get_db)):
    return db.query(TargetingRule).all()
from fastapi import HTTPException

@router.delete("/{id}")
def delete_rule(
    id: int,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    rule = db.query(TargetingRule).filter(TargetingRule.id == id).first()

    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    db.delete(rule)
    db.commit()
    log_audit_action(
    db=db,
    action="Group Target Removed",
    performed_by=current_user["email"],
    flag_id=rule.flag_id,
    old_value=f"{rule.rule_type}:{rule.rule_value}"
)

    return {"message": "Targeting rule deleted successfully"}