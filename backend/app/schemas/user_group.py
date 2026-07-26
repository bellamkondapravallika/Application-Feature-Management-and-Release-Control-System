from pydantic import BaseModel

class UserGroupCreate(BaseModel):
    group_name: str

class UserGroupResponse(BaseModel):
    id: int
    group_name: str

    class Config:
        from_attributes = True