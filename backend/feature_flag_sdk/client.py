import requests

from .config import FLAG_API_URL, API_KEY, CACHE_TTL
from .cache import get_cache, set_cache


class FeatureFlagClient:

    def is_enabled(self, flag_key, user_id, environment="production", groups=None):
        if groups is None:
            groups = []

        cache_key = f"{flag_key}:{user_id}:{environment}"

        cached = get_cache(cache_key)
        if cached is not None:
            return cached

        payload = {
            "flag_key": flag_key,
            "environment": environment,
            "user_id": user_id,
            "groups": groups
        }

        headers = {
            "Authorization": f"Bearer {API_KEY}"
        }

        try:
            response = requests.post(
                f"{FLAG_API_URL}/flags/evaluate",
                json=payload,
                headers=headers,
                timeout=5
            )

            response.raise_for_status()

            data = response.json()

            value = data.get("value", False)

            set_cache(cache_key, value, CACHE_TTL)

            return value

        except Exception:
            cached = get_cache(cache_key)

            if cached is not None:
                return cached

            return False