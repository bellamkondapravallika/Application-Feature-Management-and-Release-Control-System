from fastapi import APIRouter, Depends
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


def log_audit_action(db: Session, action: str, performed_by: str, old_value: str | None = None, new_value: str | None = None):
    record = AuditLog(
        action=action,
        performed_by=performed_by,
        old_value=old_value,
        new_value=new_value,
    )
    db.add(record)
    db.commit()


@router.get("/", response_model=list[AuditLogResponse])
def get_audit_logs(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return db.query(AuditLog).order_by(AuditLog.timestamp.desc()).all()
