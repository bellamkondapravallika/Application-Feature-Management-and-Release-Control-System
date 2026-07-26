import redis
import json

redis_client = redis.Redis(
    host="localhost",
    port=6379,
    db=0,
    decode_responses=True
)

CACHE_TTL = 300  # 5 minutes
def get_cache(key):
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return None
def set_cache(key, value):
    redis_client.setex(
        key,
        CACHE_TTL,
        json.dumps(value)
    )
def delete_cache(key: str):
    redis_client.delete(key)