from app.models.audit_log import AuditLog
from datetime import datetime


def create_audit_log(
    db,
    user,
    action,
    flag_id=None,
    environment_id=None,
    old_state=None,
    new_state=None,
):
    log = AuditLog(
        user=user,
        action=action,
        flag_id=flag_id,
        environment_id=environment_id,
        old_state=old_state,
        new_state=new_state,
        timestamp=datetime.utcnow(),
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log