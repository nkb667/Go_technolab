# Lesson management routes
from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user_with_db, require_admin
from database import DatabaseService
from models import *
from typing import List

router = APIRouter(prefix="/lessons", tags=["lessons"])

@router.get("/{lesson_id}", response_model=Lesson)
async def get_lesson(
    lesson_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    lesson = await db_service.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    return lesson

@router.post("/{lesson_id}/submit", response_model=CodeSubmissionResult)
async def submit_code(
    lesson_id: str,
    submission: CodeSubmission,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    lesson = await db_service.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    if not lesson.codingChallenge:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This lesson does not have a coding challenge"
        )
    
    # Simple code evaluation (in production, use sandboxed execution)
    success = False
    output = ""
    tests_pass = False
    score = 0
    
    try:
        # Basic validation - check if code contains expected elements
        code = submission.code.lower()
        challenge = lesson.codingChallenge
        
        if lesson_id == "1":  # Hello World challenge
            if "fmt.println" in code and "hello, world!" in code:
                success = True
                output = "Hello, World!"
                tests_pass = True
                score = challenge.points
            else:
                output = "Code does not produce expected output"
        elif "return" in code and ("+" in code or "add" in code):
            success = True
            output = "8"  # Simple calculator result
            tests_pass = True
            score = challenge.points
        else:
            output = "Code compilation failed or incorrect implementation"
    
    except Exception as e:
        output = f"Error: {str(e)}"
    
    # Update progress if successful
    if tests_pass:
        progress_create = ProgressCreate(
            lessonId=lesson_id,
            courseId=lesson.courseId
        )
        progress = await db_service.create_or_update_progress(current_user.id, progress_create)
        
        progress_update = ProgressUpdate(
            status=ProgressStatus.COMPLETED,
            score=score
        )
        await db_service.update_progress(progress.id, progress_update)
        
        # Award XP to user
        await db_service.update_user_profile(
            current_user.id,
            {"totalXP": current_user.profile.totalXP + score}
        )
    
    return CodeSubmissionResult(
        success=success,
        output=output,
        testsPass=tests_pass,
        score=score
    )

# Admin routes for lesson management
@router.post("/", response_model=Lesson)
async def create_lesson(
    lesson_create: LessonCreate,
    current_user: User = Depends(require_admin),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Verify course exists
    course = await db_service.get_course_by_id(lesson_create.courseId)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    lesson = Lesson(**lesson_create.dict())
    created_lesson = await db_service.create_lesson(lesson)
    return created_lesson

@router.put("/{lesson_id}", response_model=Lesson)
async def update_lesson(
    lesson_id: str,
    lesson_update: LessonUpdate,
    current_user: User = Depends(require_admin),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    lesson = await db_service.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    success = await db_service.update_lesson(lesson_id, lesson_update)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update lesson"
        )
    
    updated_lesson = await db_service.get_lesson_by_id(lesson_id)
    return updated_lesson

@router.delete("/{lesson_id}")
async def delete_lesson(
    lesson_id: str,
    current_user: User = Depends(require_admin),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    lesson = await db_service.get_lesson_by_id(lesson_id)
    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found"
        )
    
    success = await db_service.delete_lesson(lesson_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete lesson"
        )
    
    return {"message": "Lesson deleted successfully"}