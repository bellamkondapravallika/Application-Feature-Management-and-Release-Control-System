from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.environment_override import EnvironmentOverride
from app.routers.auth import get_current_user
from app.routers.audit_log import log_audit_action
from app.schemas.environment_override import (
    EnvironmentOverrideCreate,
    EnvironmentOverrideResponse,
)

router = APIRouter(
    prefix="/overrides",
    tags=["Environment Overrides"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=EnvironmentOverrideResponse)
def create_override(
    override: EnvironmentOverrideCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    new_override = EnvironmentOverride(
        flag_id=override.flag_id,
        environment_id=override.environment_id,
        value=override.value,
    )

    db.add(new_override)
    db.commit()
    db.refresh(new_override)
    log_audit_action(
        db,
        action="create_override",
        performed_by=current_user["email"],
        new_value=f"{new_override.flag_id}:{new_override.environment_id}:{new_override.value}",
    )

    return new_override


@router.get("/")
def get_overrides(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(EnvironmentOverride).all()


@router.get("/{override_id}")
def get_override(override_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    override = db.query(EnvironmentOverride).filter(EnvironmentOverride.id == override_id).first()

    if not override:
        raise HTTPException(status_code=404, detail="Override not found")

    return override


@router.put("/{override_id}")
def update_override(
    override_id: int,
    data: EnvironmentOverrideCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    override = db.query(EnvironmentOverride).filter(EnvironmentOverride.id == override_id).first()

    if not override:
        raise HTTPException(status_code=404, detail="Override not found")

    override.flag_id = data.flag_id
    override.environment_id = data.environment_id
    override.value = data.value

    db.commit()
    db.refresh(override)
    log_audit_action(
        db,
        action="update_override",
        performed_by=current_user["email"],
        old_value=f"{override_id}:{override.flag_id}:{override.environment_id}:{override.value}",
        new_value=f"{data.flag_id}:{data.environment_id}:{data.value}",
    )

    return override


@router.delete("/{override_id}")
def delete_override(override_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    override = db.query(EnvironmentOverride).filter(EnvironmentOverride.id == override_id).first()

    if not override:
        raise HTTPException(status_code=404, detail="Override not found")

    db.delete(override)
    db.commit()
    log_audit_action(
        db,
        action="delete_override",
        performed_by=current_user["email"],
        old_value=str(override_id),
    )

    return {"message": "Override deleted successfully"}