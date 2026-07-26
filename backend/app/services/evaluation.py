from sqlalchemy.orm import Session

from app.models.feature_flag import FeatureFlag
from app.models.environment import Environment
from app.models.environment_override import EnvironmentOverride
from app.models.targeting_rule import TargetingRule
from app.services.rollout import get_bucket
from app.services.cache import get_cache, set_cache



def evaluate_flag(
    flag_key: str,
    environment: str,
    user_id: str,
    groups: list,
    db: Session,
):

    # Find Feature Flag
    flag = db.query(FeatureFlag).filter(
        FeatureFlag.key == flag_key
    ).first()

    if not flag:
        return {"error": "Flag not found"}

    # Enabled?
    if not flag.enabled:
        result = {
            "flag_key": flag.key,
            "enabled": False,
            "reason": "flag_disabled",
            "bucket": 0,
            "rollout_percentage": flag.rollout_percentage,
        }
        set_cache(cache_key, result)
        return result

    # Find Environment
    env = db.query(Environment).filter(
        Environment.name == environment
    ).first()

    if not env:
        return {"error": "Environment not found"}
    cache_key = f"flag:{flag_key}:{user_id}:{environment}"
    cached_result = get_cache(cache_key)
    if cached_result:
        return cached_result
    # Environment Override
    override = db.query(EnvironmentOverride).filter(
        EnvironmentOverride.flag_id == flag.id,
        EnvironmentOverride.environment_id == env.id
    ).first()

    if override:
        result = {
            "flag_key": flag.key,
            "enabled": override.value,
            "reason": "environment_override",
            "bucket": 0,
            "rollout_percentage": flag.rollout_percentage,
        }
        set_cache(cache_key, result)
        return result

    # User Targeting
    user_rule = db.query(TargetingRule).filter(
        TargetingRule.flag_id == flag.id,
        TargetingRule.rule_type == "user",
        TargetingRule.rule_value == user_id,
    ).first()

    if user_rule:
        result = {
            "flag_key": flag.key,
            "enabled": True,
            "reason": "user_targeting",
            "bucket": get_bucket(user_id, flag.key),
            "rollout_percentage": flag.rollout_percentage,
        }
        set_cache(cache_key, result)
        return result
    
    # Group Targeting
    group_rules = db.query(TargetingRule).filter(
        TargetingRule.flag_id == flag.id,
        TargetingRule.rule_type == "group",
    ).all()

    for rule in group_rules:
        if rule.rule_value in groups:
            result = {
                "flag_key": flag.key,
                "enabled": True,
                "reason": "group_targeting",
                "bucket": get_bucket(user_id, flag.key),
                "rollout_percentage": flag.rollout_percentage,
            }
            set_cache(cache_key, result)
            return result

    # Percentage Rollout
    bucket = get_bucket(user_id, flag.key)

    if bucket < flag.rollout_percentage:
        result = {
            "flag_key": flag.key,
            "enabled": True,
            "reason": "percentage_rollout",
            "bucket": bucket,
            "rollout_percentage": flag.rollout_percentage,
        }
        set_cache(cache_key, result)
        return result

    # Default Value
    result = {
        "flag_key": flag.key,
        "enabled": flag.default_value,
        "reason": "default_value",
        "bucket": bucket,
        "rollout_percentage": flag.rollout_percentage,
    }
    set_cache(cache_key, result)
    return result