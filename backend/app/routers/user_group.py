from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user_group import UserGroup
from app.schemas.user_group import UserGroupCreate
from app.models.user import User
from app.schemas.user import AssignGroup
from fastapi import HTTPException

router = APIRouter(prefix="/groups", tags=["User Groups"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def create_group(group: UserGroupCreate, db: Session = Depends(get_db)):
    new_group = UserGroup(group_name=group.group_name)
    db.add(new_group)
    db.commit()
    db.refresh(new_group)
    return new_group


@router.get("/")
def get_groups(db: Session = Depends(get_db)):
    return db.query(UserGroup).all()
@router.put("/assign/{user_id}")
def assign_user_to_group(
    user_id: int,
    data: AssignGroup,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    group = db.query(UserGroup).filter(UserGroup.id == data.group_id).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    user.group_id = data.group_id
    db.commit()
    db.refresh(user)

    return {
        "message": "User added to group successfully",
        "user_id": user.id,
        "group": group.group_name
    }
@router.put("/{id}")
def update_group(
    id: int,
    group: UserGroupCreate,
    db: Session = Depends(get_db)
):
    existing_group = db.query(UserGroup).filter(UserGroup.id == id).first()

    if not existing_group:
        raise HTTPException(status_code=404, detail="Group not found")

    existing_group.group_name = group.group_name
    db.commit()
    db.refresh(existing_group)

    return existing_group


@router.delete("/{id}")
def delete_group(
    id: int,
    db: Session = Depends(get_db)
):
    group = db.query(UserGroup).filter(UserGroup.id == id).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    db.delete(group)
    db.commit()

    return {"message": "Group deleted successfully"}


@router.post("/add-user")
def add_user_to_group(
    data: AssignGroup,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == data.user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    group = db.query(UserGroup).filter(UserGroup.id == data.group_id).first()

    if not group:
        raise HTTPException(status_code=404, detail="Group not found")

    user.group_id = data.group_id
    db.commit()
    db.refresh(user)

    return {
        "message": "User added successfully",
        "user": user.username,
        "group": group.group_name
    }