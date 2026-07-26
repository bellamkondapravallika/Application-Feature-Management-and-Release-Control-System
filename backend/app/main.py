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

app = FastAPI()

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


@app.get("/")
def home():
    return {"message": "Feature Flag System is Running"}
