# Achievement system routes
from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user_with_db
from database import DatabaseService
from models import *
from typing import List

router = APIRouter(prefix="/achievements", tags=["achievements"])

@router.get("/me", response_model=List[Achievement])
async def get_my_achievements(
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    achievements = await db_service.get_user_achievements(current_user.id)
    return achievements

@router.post("/", response_model=Achievement)
async def award_achievement(
    achievement_create: AchievementCreate,
    user_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Only allow awarding achievements to self or if admin
    if user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot award achievements to other users"
        )
    
    # Check if user already has this achievement
    existing_achievements = await db_service.get_user_achievements(user_id)
    for ach in existing_achievements:
        if ach.type == achievement_create.type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User already has this achievement"
            )
    
    achievement = Achievement(
        userId=user_id,
        **achievement_create.dict()
    )
    
    created_achievement = await db_service.create_achievement(achievement)
    return created_achievement

# Automatic achievement checking system
async def check_and_award_achievements(user_id: str, db_service: DatabaseService):
    """Check if user qualifies for new achievements and award them"""
    user = await db_service.get_user_by_id(user_id)
    if not user:
        return
    
    user_progress = await db_service.get_user_progress(user_id)
    completed_lessons = [p for p in user_progress if p.status == ProgressStatus.COMPLETED]
    existing_achievements = await db_service.get_user_achievements(user_id)
    existing_types = [ach.type for ach in existing_achievements]
    
    # First lesson completed
    if len(completed_lessons) >= 1 and "first_lesson" not in existing_types:
        achievement = Achievement(
            userId=user_id,
            type="first_lesson",
            title="Первые шаги",
            description="Завершил первый урок",
            icon="🎯",
            points=10
        )
        await db_service.create_achievement(achievement)
    
    # First coding lesson
    coding_lessons = [p for p in completed_lessons if p.lessonId in ["3", "5", "6"]]  # Coding lesson IDs
    if len(coding_lessons) >= 1 and "first_code" not in existing_types:
        achievement = Achievement(
            userId=user_id,
            type="first_code",
            title="Программист",
            description="Написал первую программу",
            icon="💻",
            points=25
        )
        await db_service.create_achievement(achievement)
    
    # 5 lessons completed
    if len(completed_lessons) >= 5 and "five_lessons" not in existing_types:
        achievement = Achievement(
            userId=user_id,
            type="five_lessons",
            title="Настойчивость",
            description="Завершил 5 уроков",
            icon="🔥",
            points=50
        )
        await db_service.create_achievement(achievement)
    
    # 10 lessons completed
    if len(completed_lessons) >= 10 and "ten_lessons" not in existing_types:
        achievement = Achievement(
            userId=user_id,
            type="ten_lessons",
            title="Исследователь",
            description="Завершил 10 уроков",
            icon="🔍",
            points=100
        )
        await db_service.create_achievement(achievement)
    
    # First course completed
    courses = await db_service.get_courses()
    for course in courses:
        course_lessons = await db_service.get_lessons_by_course(course.id)
        course_progress = [p for p in completed_lessons if p.courseId == course.id]
        
        if len(course_progress) >= len(course_lessons) and f"course_{course.id}" not in existing_types:
            achievement = Achievement(
                userId=user_id,
                type=f"course_{course.id}",
                title="Мастер курса",
                description=f"Завершил курс '{course.title}'",
                icon="🏆",
                points=200
            )
            await db_service.create_achievement(achievement)
            break  # Only award one course completion at a time

@router.post("/check/{user_id}")
async def check_user_achievements(
    user_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Only allow checking own achievements or if admin
    if user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot check achievements for other users"
        )
    
    await check_and_award_achievements(user_id, db_service)
    return {"message": "Achievement check completed"}