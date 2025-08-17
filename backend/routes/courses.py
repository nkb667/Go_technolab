# Course management routes
from fastapi import APIRouter, Depends, HTTPException, status
from dependencies import get_current_user, require_admin, get_db_service
from models import *
from typing import List, Optional

router = APIRouter(prefix="/courses", tags=["courses"])

@router.get("/", response_model=List[Course])
async def get_courses(
    skip: int = 0,
    limit: int = 100,
    db_service = Depends(get_db_service)
):
    courses = await db_service.get_courses(skip=skip, limit=limit)
    return courses

@router.get("/{course_id}", response_model=CourseWithLessons)
async def get_course(
    course_id: str,
    db_service = Depends(get_db_service)
):
    course = await db_service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Get lessons for the course
    lessons = await db_service.get_lessons_by_course(course_id)
    
    return CourseWithLessons(
        **course.dict(),
        lessons=lessons
    )

@router.get("/{course_id}/lessons", response_model=List[Lesson])
async def get_course_lessons(
    course_id: str,
    db_service = Depends(get_db_service)
):
    course = await db_service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    lessons = await db_service.get_lessons_by_course(course_id)
    return lessons

# Admin routes for course management
@router.post("/", response_model=Course)
async def create_course(
    course_create: CourseCreate,
    current_user: User = Depends(require_admin),
    db_service = Depends(get_db_service)
):
    course = Course(
        **course_create.dict(),
        createdBy=current_user.id
    )
    
    created_course = await db_service.create_course(course)
    return created_course

@router.put("/{course_id}", response_model=Course)
async def update_course(
    course_id: str,
    course_update: CourseUpdate,
    current_user: User = Depends(require_admin),
    db_service = Depends(get_db_service)
):
    course = await db_service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    success = await db_service.update_course(course_id, course_update)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update course"
        )
    
    updated_course = await db_service.get_course_by_id(course_id)
    return updated_course

@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    current_user: User = Depends(require_admin),
    db_service = Depends(get_db_service)
):
    course = await db_service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    success = await db_service.delete_course(course_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete course"
        )
    
    return {"message": "Course deleted successfully"}

@router.put("/{course_id}/reorder")
async def reorder_course_lessons(
    course_id: str,
    lesson_ids: List[str],
    current_user: User = Depends(require_admin),
    db_service = Depends(get_db_service)
):
    course = await db_service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Update lesson orders
    for index, lesson_id in enumerate(lesson_ids):
        await db_service.update_lesson(lesson_id, LessonUpdate(order=index + 1))
    
    return {"message": "Lessons reordered successfully"}