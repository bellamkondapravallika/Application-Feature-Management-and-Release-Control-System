from starlette.middleware.base import BaseHTTPMiddleware

from .client import FeatureFlagClient


class FeatureFlagMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        request.state.flag_client = FeatureFlagClient()
        response = await call_next(request)
        return response