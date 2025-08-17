# Progress tracking routes
from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user_with_db
from database import DatabaseService
from models import *
from typing import List, Dict, Any

router = APIRouter(prefix="/progress", tags=["progress"])

@router.get("/me", response_model=List[Progress])
async def get_my_progress(
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    progress = await db_service.get_user_progress(current_user.id)
    return progress

@router.get("/me/course/{course_id}", response_model=List[Progress])
async def get_my_course_progress(
    course_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    progress = await db_service.get_course_progress(current_user.id, course_id)
    return progress

@router.post("/", response_model=Progress)
async def create_progress(
    progress_create: ProgressCreate,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Verify lesson exists
    lesson = await db_service.get_lesson_by_id(progress_create.lessonId)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    progress = await db_service.create_or_update_progress(current_user.id, progress_create)
    return progress

@router.put("/{progress_id}", response_model=Progress)
async def update_progress(
    progress_id: str,
    progress_update: ProgressUpdate,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Get existing progress
    existing_progress = await db_service.db.progress.find_one({"id": progress_id})
    if not existing_progress:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Progress not found"
        )
    
    progress_obj = Progress(**existing_progress)
    
    # Check ownership
    if progress_obj.userId != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    success = await db_service.update_progress(progress_id, progress_update)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update progress"
        )
    
    # Get updated progress
    updated_progress_data = await db_service.db.progress.find_one({"id": progress_id})
    return Progress(**updated_progress_data)

@router.get("/dashboard")
async def get_progress_dashboard(
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Get user's progress summary
    user_progress = await db_service.get_user_progress(current_user.id)
    
    # Calculate stats
    total_lessons = len(user_progress)
    completed_lessons = len([p for p in user_progress if p.status == ProgressStatus.COMPLETED])
    total_xp = current_user.profile.totalXP
    streak = current_user.profile.streak
    
    # Calculate progress percentage
    progress_percentage = int((completed_lessons / total_lessons * 100)) if total_lessons > 0 else 0
    
    # Get course progress
    courses = await db_service.get_courses()
    course_progress = []
    
    for course in courses:
        course_lessons = await db_service.get_lessons_by_course(course.id)
        course_user_progress = [p for p in user_progress if p.courseId == course.id]
        completed_course_lessons = len([p for p in course_user_progress if p.status == ProgressStatus.COMPLETED])
        
        course_progress.append({
            "courseId": course.id,
            "courseName": course.title,
            "totalLessons": len(course_lessons),
            "completedLessons": completed_course_lessons,
            "progressPercentage": int((completed_course_lessons / len(course_lessons) * 100)) if course_lessons else 0
        })
    
    # Get recent achievements
    achievements = await db_service.get_user_achievements(current_user.id)
    recent_achievements = achievements[:3]  # Last 3 achievements
    
    return {
        "totalProgress": progress_percentage,
        "completedLessons": completed_lessons,
        "totalLessons": total_lessons,
        "totalXP": total_xp,
        "streak": streak,
        "level": current_user.profile.level,
        "courseProgress": course_progress,
        "recentAchievements": [
            {
                "id": ach.id,
                "title": ach.title,
                "description": ach.description,
                "icon": ach.icon,
                "earnedAt": ach.earnedAt,
                "points": ach.points
            } for ach in recent_achievements
        ]
    }