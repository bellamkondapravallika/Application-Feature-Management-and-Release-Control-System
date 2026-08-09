from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.audit_log import AuditLog
from app.routers.auth import get_current_user
from app.schemas.audit_log import AuditLogResponse

router = APIRouter(prefix="/audit-logs", tags=["Audit Logs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def log_audit_action(
    db,
    action,
    performed_by,
    flag_id=None,
    environment_id=None,
    old_state=None,
    new_state=None,
):

    record = AuditLog(
    action=action,
    performed_by=performed_by,
    flag_id=flag_id,
    environment_id=environment_id,
    old_state=old_state,
    new_state=new_state,
)
    
    db.add(record)
    db.commit()

@router.get("/", response_model=list[AuditLogResponse])
def get_audit_logs(
    flag_id: int | None = Query(None),
    user: str | None = Query(None),
    action: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(AuditLog)

    if flag_id:
        query = query.filter(AuditLog.flag_id == flag_id)

    if user:
        query = query.filter(AuditLog.performed_by == user)

    if action:
        query = query.filter(AuditLog.action == action)

    return query.order_by(AuditLog.timestamp.desc()).all()
@router.get("/{id}", response_model=AuditLogResponse)
def get_audit_log(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    log = db.query(AuditLog).filter(AuditLog.id == id).first()

    if not log:
        raise HTTPException(status_code=404, detail="Audit log not found")

    return log
@router.get("/", response_model=list[AuditLogResponse])
def get_audit_logs(
    flag_id: int | None = Query(None),
    user: str | None = Query(None),
    action: str | None = Query(None),
    from_date: str | None = Query(None),
    to_date: str | None = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(AuditLog)

    # Filter by flag
    if flag_id:
        query = query.filter(AuditLog.flag_id == flag_id)

    # Filter by user
    if user:
        query = query.filter(AuditLog.performed_by == user)

    # Filter by action
    if action:
        query = query.filter(AuditLog.action == action)

    # Filter by start date
    if from_date:
        query = query.filter(
            AuditLog.timestamp >= from_date
        )

    # Filter by end date
    if to_date:
        query = query.filter(
            AuditLog.timestamp <= to_date + " 23:59:59"
        )

    return query.order_by(AuditLog.timestamp.desc()).all()