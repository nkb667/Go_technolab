# Shared dependencies for the application
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase
from auth import AuthService
from database import DatabaseService
from models import User, UserRole

# Security scheme
security = HTTPBearer()

# Dependency to get database
async def get_database():
    from server import db
    return db

# Dependency injection for services  
async def get_auth_service(database = Depends(get_database)):
    return AuthService(database)

async def get_db_service(database = Depends(get_database)):
    return DatabaseService(database)

# Dependency to get current user
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    auth_service: AuthService = Depends(get_auth_service)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    user = await auth_service.verify_token(credentials.credentials)
    if user is None:
        raise credentials_exception
    
    return user

# Role-based access control
def require_role(required_role: UserRole):
    def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role and current_user.role != UserRole.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user
    return role_checker

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

def require_teacher_or_admin(current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teacher or admin access required"
        )
    return current_user