from fastapi import FastAPI
from app.models import user
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.models import user_group
from app.models import targeting_rule
from app.routers import auth, audit_log, environment, environment_override, feature_flag
from app.routers import user_group
from app.routers import targeting_rule
from app.routers import redis
from feature_flag_sdk.middleware import FeatureFlagMiddleware
from fastapi import Request
from app.models.user import User
from app.models.feature_flag import FeatureFlag
from app.models.audit_log import AuditLog
from app.models.user_group import UserGroup
from app.routers import analytics

app = FastAPI()
app.add_middleware(FeatureFlagMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(environment.router)
app.include_router(environment_override.router)
app.include_router(feature_flag.router)
#app.include_router(evaluation.router)
app.include_router(audit_log.router)
app.include_router(user_group.router)
app.include_router(targeting_rule.router)
app.include_router(redis.router)
app.include_router(analytics.router)

@app.get("/")
def home():
    return {"message": "Feature Flag System is Running"}



@app.get("/sdk-test")
async def sdk_test(request: Request):
    result = request.state.flag_client.is_enabled(
        flag_key="new_dashboard",
        user_id="user_101",
        environment="production"
    )

    return {
        "feature_enabled": result
    }
