from fastapi import APIRouter
router = APIRouter(
    prefix="/flags",
    tags=["Flag Evaluation"]
)
from fastapi import APIRouter
from app.services.evaluation import evaluate_flag

router = APIRouter(
    prefix="/flags",
    tags=["Flag Evaluation"]
)

@router.post("/evaluate")
def evaluate(data: dict):
    result = evaluate_flag(
        data["flag_key"],
        data["environment"]
    )

    return {
        "flag_key": data["flag_key"],
        "value": result
    }