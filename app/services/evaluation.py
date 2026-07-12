from sqlalchemy.orm import Session

from app.models.feature_flag import FeatureFlag
from app.models.environment import Environment
from app.models.environment_override import EnvironmentOverride


def evaluate_flag(flag_key: str, environment: str, db: Session):

    # Find Feature Flag
    flag = db.query(FeatureFlag).filter(
        FeatureFlag.key == flag_key
    ).first()

    if not flag:
        return {"error": "Flag not found"}

    # Find Environment
    env = db.query(Environment).filter(
        Environment.name == environment
    ).first()

    if not env:
        return {"error": "Environment not found"}

    # Check Override
    override = db.query(EnvironmentOverride).filter(
        EnvironmentOverride.flag_id == flag.id,
        EnvironmentOverride.environment_id == env.id
    ).first()

    if override:
        return {
            "flag_key": flag.key,
            "value": override.value
        }

    # Return Default Value
    return {
        "flag_key": flag.key,
        "value": flag.default_value
    }