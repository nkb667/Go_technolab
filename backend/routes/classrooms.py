# Classroom management routes
from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user_with_db, require_teacher_or_admin
from database import DatabaseService
from models import *
from typing import List, Dict, Any

router = APIRouter(prefix="/classrooms", tags=["classrooms"])

@router.get("/", response_model=List[ClassroomResponse])
async def get_my_classrooms(
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    if current_user.role == UserRole.TEACHER or current_user.role == UserRole.ADMIN:
        # Teachers and admins see classrooms they created
        classrooms = await db_service.get_classrooms_by_teacher(current_user.id)
    else:
        # Students see classrooms they're enrolled in
        classrooms_cursor = db_service.db.classrooms.find({"students": current_user.id})
        classrooms = []
        async for classroom_data in classrooms_cursor:
            classrooms.append(Classroom(**classroom_data))
    
    # Convert to response format
    response_classrooms = []
    for classroom in classrooms:
        response_classrooms.append(ClassroomResponse(
            id=classroom.id,
            name=classroom.name,
            description=classroom.description,
            teacherId=classroom.teacherId,
            students=len(classroom.students),
            maxStudents=classroom.maxStudents,
            courses=len(classroom.courseIds),
            inviteCode=classroom.inviteCode,
            isActive=classroom.isActive,
            createdAt=classroom.createdAt
        ))
    
    return response_classrooms

@router.get("/{classroom_id}", response_model=Classroom)
async def get_classroom(
    classroom_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    classroom = await db_service.get_classroom_by_id(classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Classroom not found"
        )
    
    # Check access permissions
    if (current_user.role == UserRole.STUDENT and 
        current_user.id not in classroom.students):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    return classroom

@router.post("/", response_model=Classroom)
async def create_classroom(
    classroom_create: ClassroomCreate,
    current_user: User = Depends(require_teacher_or_admin),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    classroom = await db_service.create_classroom(classroom_create, current_user.id)
    return classroom

@router.put("/{classroom_id}", response_model=Classroom)
async def update_classroom(
    classroom_id: str,
    classroom_update: ClassroomUpdate,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    classroom = await db_service.get_classroom_by_id(classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Classroom not found"
        )
    
    # Check permissions
    if (current_user.role != UserRole.ADMIN and 
        classroom.teacherId != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    update_data = {k: v for k, v in classroom_update.dict().items() if v is not None}
    
    result = await db_service.db.classrooms.update_one(
        {"id": classroom_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to update classroom"
        )
    
    updated_classroom = await db_service.get_classroom_by_id(classroom_id)
    return updated_classroom

@router.delete("/{classroom_id}")
async def delete_classroom(
    classroom_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    classroom = await db_service.get_classroom_by_id(classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Classroom not found"
        )
    
    # Check permissions
    if (current_user.role != UserRole.ADMIN and 
        classroom.teacherId != current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    result = await db_service.db.classrooms.delete_one({"id": classroom_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete classroom"
        )
    
    return {"message": "Classroom deleted successfully"}

@router.post("/{classroom_id}/join")
async def join_classroom_by_id(
    classroom_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can join classrooms"
        )
    
    classroom = await db_service.get_classroom_by_id(classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Classroom not found"
        )
    
    if len(classroom.students) >= classroom.maxStudents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Classroom is full"
        )
    
    success = await db_service.join_classroom(classroom_id, current_user.id)
    if not success:
        return {"message": "Already enrolled in classroom"}
    
    return {"message": "Successfully joined classroom"}

@router.post("/join")
async def join_classroom_by_code(
    invite_code: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    if current_user.role != UserRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can join classrooms"
        )
    
    classroom = await db_service.get_classroom_by_invite_code(invite_code)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Invalid invite code"
        )
    
    if len(classroom.students) >= classroom.maxStudents:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Classroom is full"
        )
    
    success = await db_service.join_classroom(classroom.id, current_user.id)
    if not success:
        return {"message": "Already enrolled in classroom"}
    
    return {"message": f"Successfully joined {classroom.name}"}

@router.delete("/{classroom_id}/leave")
async def leave_classroom(
    classroom_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    classroom = await db_service.get_classroom_by_id(classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Classroom not found"
        )
    
    success = await db_service.leave_classroom(classroom_id, current_user.id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Not enrolled in this classroom"
        )
    
    return {"message": "Successfully left classroom"}

@router.get("/{classroom_id}/students", response_model=List[UserResponse])
async def get_classroom_students(
    classroom_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    classroom = await db_service.get_classroom_by_id(classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Classroom not found"
        )
    
    # Check permissions
    if (current_user.role == UserRole.STUDENT and 
        current_user.id not in classroom.students):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get student details
    students = []
    for student_id in classroom.students:
        student = await db_service.get_user_by_id(student_id)
        if student:
            students.append(UserResponse(**student.dict()))
    
    return students

@router.get("/{classroom_id}/progress")
async def get_classroom_progress(
    classroom_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    classroom = await db_service.get_classroom_by_id(classroom_id)
    if not classroom:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Classroom not found"
        )
    
    # Check permissions - only teacher/admin can view classroom progress
    if (current_user.role == UserRole.STUDENT or
        (current_user.role == UserRole.TEACHER and classroom.teacherId != current_user.id)):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    progress_data = await db_service.get_classroom_progress(classroom_id) 
    return progress_data