from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# ✅ Load environment variables
load_dotenv()

# ✅ Get DATABASE_URL from .env (Use Render's PostgreSQL URL)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL is not set in the environment variables.")

# ✅ Create database engine
engine = create_engine(DATABASE_URL)

# ✅ Create a session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ✅ Define Base for SQLAlchemy models
Base = declarative_base()

# ✅ Dependency for getting the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
