import os

FLAG_API_URL = os.getenv("FLAG_API_URL", "http://127.0.0.1:8000")

API_KEY = os.getenv("API_KEY", "")

CACHE_TTL = int(os.getenv("CACHE_TTL", 300))