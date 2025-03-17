from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import Base, engine
from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router

app = FastAPI()

# Add CORS Middleware to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-create tables in PostgreSQL
Base.metadata.create_all(bind=engine)

# Register Routes
app.include_router(auth_router, prefix="/auth")
app.include_router(user_router, prefix="/users")

@app.get("/")
def root():
    return {"message": "User Management API is running"}
