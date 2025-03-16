from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from crud import get_users_sorted, update_user_status, delete_users
from schemas import UserResponse, UserActionRequest
from typing import List

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = get_users_sorted(db)
    if not users:
        raise HTTPException(status_code=404, detail="No users found")
    return users

@router.post("/block")
def block_users(request: UserActionRequest, db: Session = Depends(get_db)):
    if not request.user_ids:
        raise HTTPException(status_code=400, detail="No user IDs provided")
    update_user_status(db, request.user_ids, "blocked")
    return {"message": "Users blocked successfully"}

@router.post("/unblock")
def unblock_users(request: UserActionRequest, db: Session = Depends(get_db)):
    if not request.user_ids:
        raise HTTPException(status_code=400, detail="No user IDs provided")
    update_user_status(db, request.user_ids, "active")
    return {"message": "Users unblocked successfully"}

@router.post("/delete")
def delete_selected_users(request: UserActionRequest, db: Session = Depends(get_db)):
    if not request.user_ids:
        raise HTTPException(status_code=400, detail="No user IDs provided")
    delete_users(db, request.user_ids)
    return {"message": "Users deleted successfully"}
