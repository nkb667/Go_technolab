# Authentication routes
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from auth import AuthService
from database import DatabaseService
from models import UserCreate, UserLogin, User, UserResponse, Token, UserRole
from datetime import timedelta
from typing import List

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
async def get_current_user_with_db(
    auth_service: AuthService = Depends(get_auth_service)
):
    from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
    from fastapi import Depends
    
    security = HTTPBearer()
    
    async def _get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
        user = await auth_service.verify_token(credentials.credentials)
        if user is None:
            raise credentials_exception
        
        return user
    
    return await _get_current_user()

router = APIRouter(prefix="/auth", tags=["authentication"])

@router.post("/register", response_model=UserResponse)
async def register(
    user_create: UserCreate,
    auth_service: AuthService = Depends(lambda: AuthService(None)),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Check if user already exists
    existing_user = await db_service.get_user_by_email(user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = auth_service.get_password_hash(user_create.password)
    new_user = User(
        **user_create.dict(exclude={"password"}),
        password=hashed_password
    )
    
    created_user = await db_service.create_user(new_user)
    
    return UserResponse(**created_user.dict())

@router.post("/login", response_model=Token)
async def login(
    user_login: UserLogin,
    auth_service: AuthService = Depends(lambda: AuthService(None))
):
    user = await auth_service.authenticate_user(user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=60 * 24 * 7)  # 7 days
    access_token = auth_service.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user_with_db)):
    return UserResponse(**current_user.dict())

@router.put("/me", response_model=UserResponse)
async def update_current_user(
    name: str = None,
    avatar: str = None,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    update_data = {}
    if name:
        update_data["name"] = name
    if avatar:
        update_data["avatar"] = avatar
    
    if update_data:
        # Update user in database
        await db_service.db.users.update_one(
            {"id": current_user.id},
            {"$set": update_data}
        )
        
        # Get updated user
        updated_user = await db_service.get_user_by_id(current_user.id)
        return UserResponse(**updated_user.dict())
    
    return UserResponse(**current_user.dict())

@router.post("/logout")
async def logout():
    # In a real app, you might want to blacklist the token
    return {"message": "Successfully logged out"}

# Admin routes for user management
@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    
    users_cursor = db_service.db.users.find().skip(skip).limit(limit)
    users = []
    async for user_data in users_cursor:
        users.append(UserResponse(**User(**user_data).dict()))
    
    return users