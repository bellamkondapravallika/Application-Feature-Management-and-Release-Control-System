import time

_cache = {}

def get_cache(key):
    data = _cache.get(key)

    if not data:
        return None

    value, expiry = data

    if time.time() > expiry:
        del _cache[key]
        return None

    return value


def set_cache(key, value, ttl):
    expiry = time.time() + ttl
    _cache[key] = (value, expiry)