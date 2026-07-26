from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.feature_flag import FeatureFlag
from app.routers.auth import get_current_user
from app.routers.audit_log import log_audit_action
from app.schemas.feature_flag import FeatureFlagCreate, FeatureFlagResponse, FlagEvaluationRequest, FlagEvaluationResponse
from app.services.evaluation import evaluate_flag
from app.services.cache import delete_cache

router = APIRouter(prefix="/flags", tags=["Feature Flags"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=FeatureFlagResponse)
def create_flag(
    flag: FeatureFlagCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    new_flag = FeatureFlag(
    key=flag.key,
    description=flag.description,
    enabled=flag.enabled,
    default_value=flag.default_value,
    rollout_percentage=flag.rollout_percentage,
)

    db.add(new_flag)
    db.commit()
    db.refresh(new_flag)
    log_audit_action(
        db,
        action="create_flag",
        performed_by=current_user["email"],
        new_value=f"{new_flag.key}:{new_flag.default_value}",
    )

    return new_flag


@router.get("/", response_model=list[FeatureFlagResponse])
def get_flags(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(FeatureFlag).all()


@router.get("/{flag_id}", response_model=FeatureFlagResponse)
def get_flag(flag_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")
    return flag


@router.put("/{flag_id}", response_model=FeatureFlagResponse)
def update_flag(
    flag_id: int,
    flag: FeatureFlagCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    existing_flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
    if not existing_flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    existing_flag.key = flag.key
    existing_flag.description = flag.description
    existing_flag.enabled = flag.enabled
    existing_flag.default_value = flag.default_value
    existing_flag.rollout_percentage = flag.rollout_percentage

    db.commit()
    db.refresh(existing_flag)
    log_audit_action(
        db,
        action="update_flag",
        performed_by=current_user["email"],
        old_value=f"{flag_id}:{existing_flag.key}",
        new_value=f"{existing_flag.key}:{existing_flag.default_value}",
    )
    delete_cache(f"flag:{existing_flag.key}:*")  
    return existing_flag


@router.delete("/{flag_id}")
def delete_flag(flag_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    flag = db.query(FeatureFlag).filter(FeatureFlag.id == flag_id).first()
    if not flag:
        raise HTTPException(status_code=404, detail="Flag not found")

    db.delete(flag)
    db.commit()
    log_audit_action(
        db,
        action="delete_flag",
        performed_by=current_user["email"],
        old_value=str(flag_id),
    )
    delete_cache(f"flag:{flag.key}:*")
    return {"message": "Feature Flag deleted successfully"}
    


@router.post("/evaluate", response_model=FlagEvaluationResponse)
def evaluate_feature_flag(
    request: FlagEvaluationRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    result = evaluate_flag(request.flag_key, request.environment, request.user_id, request.groups, db)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    log_audit_action(
        db,
        action="evaluate_flag",
        performed_by=current_user["email"],
        new_value=f"{request.flag_key}:{request.environment}",
    )
    return FlagEvaluationResponse(flag_key=result["flag_key"], enabled=result["enabled"], reason=result["reason"], bucket=result["bucket"], rollout_percentage=result["rollout_percentage"])
