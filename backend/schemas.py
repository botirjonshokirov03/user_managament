from pydantic import BaseModel, EmailStr
from typing import List
from datetime import datetime

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserActionRequest(BaseModel):
    user_ids: List[int]


class UserLogin(BaseModel):  
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    last_login: datetime
    status: str
    created_at: datetime

    class Config:
        from_attributes = True 
