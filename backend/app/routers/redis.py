from fastapi import APIRouter
from app.services.cache import redis_client, CACHE_TTL

router = APIRouter(prefix="/redis", tags=["Redis"])


@router.get("/status")
def redis_status():
    try:
        redis_client.ping()

        return {
            "status": "Connected",
            "cache_enabled": True,
            "ttl": CACHE_TTL
        }

    except Exception:
        return {
            "status": "Disconnected",
            "cache_enabled": False,
            "ttl": 0
        }