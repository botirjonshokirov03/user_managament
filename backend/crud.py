from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from models import User
from schemas import UserCreate
from auth import hash_password
from typing import List

def get_user_by_email(db: Session, email: str):
    """Fetch a user by email."""
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    """Create a new user with a hashed password and prevent duplicate emails."""
    existing_user = get_user_by_email(db, user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")  # 🛑 Prevent duplicate email

    hashed_password = hash_password(user.password)
    db_user = User(name=user.name, email=user.email, password=hashed_password, status="active")

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Error creating user")

def get_users_sorted(db: Session):
    """Retrieve all users sorted by last login time (descending)."""
    return db.query(User).order_by(User.last_login.desc()).all()


def update_user_status(db: Session, user_ids: List[int], status: str):
    """Update the status (block/unblock) of multiple users."""
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    if not users:
        raise HTTPException(status_code=404, detail="Users not found")

    db.query(User).filter(User.id.in_(user_ids)).update({"status": status}, synchronize_session=False)
    db.commit()
    return {"message": f"Users successfully {status}d"}

def delete_users(db: Session, user_ids: List[int]):
    """Delete multiple users safely."""
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    if not users:
        raise HTTPException(status_code=404, detail="Users not found")

    db.query(User).filter(User.id.in_(user_ids)).delete(synchronize_session=False)
    db.commit()
    return {"message": "Users deleted successfully"}

