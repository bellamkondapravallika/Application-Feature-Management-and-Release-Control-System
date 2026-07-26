# Backend

This backend is developed using FastAPI and provides the core functionality for the Feature Flag Management System. It includes APIs for feature flag management, environment overrides, user and group targeting, percentage rollouts, enhanced flag evaluation, audit logging, and Redis caching. The backend uses PostgreSQL for data storage and Alembic for database migrations.

## Technologies
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic
- Redis
- JWT Authentication

## Run the Backend

```bash
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API Documentation:
http://127.0.0.1:8000/docs