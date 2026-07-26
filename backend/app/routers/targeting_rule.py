from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.targeting_rule import TargetingRule
from app.schemas.targeting_rule import TargetingRuleCreate

router = APIRouter(prefix="/targeting-rules", tags=["Targeting Rules"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/")
def create_rule(rule: TargetingRuleCreate, db: Session = Depends(get_db)):
    new_rule = TargetingRule(**rule.model_dump())
    db.add(new_rule)
    db.commit()
    db.refresh(new_rule)
    return new_rule

@router.get("/")
def get_rules(db: Session = Depends(get_db)):
    return db.query(TargetingRule).all()
from fastapi import HTTPException

@router.delete("/{id}")
def delete_rule(
    id: int,
    db: Session = Depends(get_db)
):
    rule = db.query(TargetingRule).filter(TargetingRule.id == id).first()

    if not rule:
        raise HTTPException(status_code=404, detail="Rule not found")

    db.delete(rule)
    db.commit()

    return {"message": "Targeting rule deleted successfully"}