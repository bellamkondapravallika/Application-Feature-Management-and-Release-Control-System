from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.environment import Environment
from app.routers.auth import get_current_user
from app.routers.audit_log import log_audit_action
from app.schemas.environment import EnvironmentCreate, EnvironmentResponse

router = APIRouter(prefix="/environments", tags=["Environments"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/", response_model=EnvironmentResponse)
def create_environment(
    environment: EnvironmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    new_environment = Environment(
        name=environment.name,
        description=environment.description,
    )

    db.add(new_environment)
    db.commit()
    db.refresh(new_environment)
    log_audit_action(
        db,
        action="create_environment",
        performed_by=current_user["email"],
        new_value=f"{new_environment.name}:{new_environment.description}",
    )

    return new_environment


@router.get("/", response_model=list[EnvironmentResponse])
def get_environments(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(Environment).all()


@router.get("/{environment_id}", response_model=EnvironmentResponse)
def get_environment(environment_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    env = db.query(Environment).filter(Environment.id == environment_id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")
    return env


@router.put("/{environment_id}", response_model=EnvironmentResponse)
def update_environment(
    environment_id: int,
    environment: EnvironmentCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    env = db.query(Environment).filter(Environment.id == environment_id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")

    env.name = environment.name
    env.description = environment.description

    db.commit()
    db.refresh(env)
    log_audit_action(
        db,
        action="update_environment",
        performed_by=current_user["email"],
        old_value=f"{environment_id}:{env.name}",
        new_value=f"{env.name}:{env.description}",
    )

    return env


@router.delete("/{environment_id}")
def delete_environment(
    environment_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    env = db.query(Environment).filter(Environment.id == environment_id).first()
    if not env:
        raise HTTPException(status_code=404, detail="Environment not found")

    db.delete(env)
    db.commit()
    log_audit_action(
        db,
        action="delete_environment",
        performed_by=current_user["email"],
        old_value=str(environment_id),
    )

    return {"message": "Environment deleted successfully"}