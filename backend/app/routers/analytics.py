from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date

from app.database import SessionLocal
from app.models.feature_flag import FeatureFlag
from app.models.audit_log import AuditLog

router = APIRouter(prefix="/analytics", tags=["Analytics"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):

    total_flags = db.query(FeatureFlag).count()

    active_flags = db.query(FeatureFlag).filter(
        FeatureFlag.enabled == True
    ).count()

    todays_evaluations = db.query(AuditLog).filter(
        AuditLog.action == "Evaluate Flag",
        func.date(AuditLog.timestamp) == date.today()
    ).count()

    audit_logs_today = db.query(AuditLog).filter(
        func.date(AuditLog.timestamp) == date.today()
    ).count()

    return {
        "total_flags": total_flags,
        "active_flags": active_flags,
        "todays_evaluations": todays_evaluations,
        "audit_logs_today": audit_logs_today
    }


@router.get("/flags")
def flag_analytics(db: Session = Depends(get_db)):

    results = (
        db.query(
            FeatureFlag.key,
            func.count(AuditLog.id).label("evaluations")
        )
        .outerjoin(
            AuditLog,
            (AuditLog.flag_id == FeatureFlag.id)
            & (AuditLog.action == "Evaluate Flag")
        )
        .group_by(FeatureFlag.id, FeatureFlag.key)
        .all()
    )

    return [
        {
            "flag": flag,
            "evaluations": evaluations
        }
        for flag, evaluations in results
    ]

@router.get("/usage")
def environment_usage(db: Session = Depends(get_db)):

    results = (
        db.query(
            AuditLog.environment_id,
            func.count(AuditLog.id).label("count")
        )
        .filter(
            AuditLog.environment_id.isnot(None)
        )
        .group_by(AuditLog.environment_id)
        .all()
    )

    environment_names = {
        1: "Development",
        2: "Staging",
        3: "Production"
    }

    return [
        {
            "environment": environment_names.get(
                environment_id,
                f"Environment {environment_id}"
            ),
            "count": count
        }
        for environment_id, count in results
    ]