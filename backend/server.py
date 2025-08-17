from fastapi import FastAPI, APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta

# Import our models and services
from models import *
from auth import AuthService, get_current_user, require_admin, require_teacher_or_admin
from database import DatabaseService
from data_seeder import seed_initial_data

# Import route modules
from routes import auth, courses, lessons, classrooms, progress, achievements, analytics

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Go Academy API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Services
auth_service = AuthService(db)
db_service = DatabaseService(db)

# Startup event to seed database
@app.on_event("startup")
async def startup_event():
    await seed_initial_data(db_service, auth_service)

# Dependency to get database
async def get_database():
    return db

# Dependency injection for services
async def get_auth_service():
    return AuthService(db)

async def get_db_service():
    return DatabaseService(db)

# Override the get_current_user dependency to inject database
async def get_current_user_with_db(
    credentials: HTTPAuthorizationCredentials = Depends(HTTPBearer()),
    database = Depends(get_database)
) -> User:
    auth_service_instance = AuthService(database)
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user = await auth_service_instance.verify_token(credentials.credentials)
    if user is None:
        raise credentials_exception
    
    return user

# Basic health check
@api_router.get("/")
async def root():
    return {"message": "Go Academy API is running!", "version": "1.0.0"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# Include all route modules
api_router.include_router(auth.router)
api_router.include_router(courses.router) 
api_router.include_router(lessons.router)
api_router.include_router(classrooms.router)
api_router.include_router(progress.router)
api_router.include_router(achievements.router)
api_router.include_router(analytics.router)

# Include the main router in the app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
