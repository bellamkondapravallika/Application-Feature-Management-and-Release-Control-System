from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app.routers import auth, audit_log, environment, environment_override, evaluation, feature_flag

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
app.include_router(evaluation.router)
app.include_router(audit_log.router)


@app.get("/")
def home():
    return {"message": "Feature Flag System is Running"}
