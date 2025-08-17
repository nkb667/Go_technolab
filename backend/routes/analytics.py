# Analytics and reporting routes
from fastapi import APIRouter, Depends, HTTPException, status
from auth import get_current_user_with_db, require_admin, require_teacher_or_admin
from database import DatabaseService
from models import *
from typing import List, Dict, Any
from datetime import datetime, timedelta

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.get("/dashboard")
async def get_admin_dashboard(
    current_user: User = Depends(require_admin),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Get basic counts
    total_users = await db_service.db.users.count_documents({})
    total_students = await db_service.db.users.count_documents({"role": "student"})
    total_teachers = await db_service.db.users.count_documents({"role": "teacher"})
    total_courses = await db_service.db.courses.count_documents({})
    total_lessons = await db_service.db.lessons.count_documents({})
    total_classrooms = await db_service.db.classrooms.count_documents({})
    
    # Active users (last 7 days)
    week_ago = datetime.utcnow() - timedelta(days=7)
    active_users = await db_service.db.users.count_documents({
        "profile.lastActiveDate": {"$gte": week_ago}
    })
    
    # Recent activity
    recent_activity = []
    
    # Recent user registrations
    recent_users_cursor = db_service.db.users.find().sort("createdAt", -1).limit(3)
    async for user in recent_users_cursor:
        recent_activity.append({
            "type": "user_registered",
            "title": f"Новый пользователь: {user['name']}",
            "author": "Система",
            "timestamp": user["createdAt"]
        })
    
    # Recent course updates
    recent_courses_cursor = db_service.db.courses.find().sort("updatedAt", -1).limit(2)
    async for course in recent_courses_cursor:
        recent_activity.append({
            "type": "course_updated",
            "title": f"Обновлен курс '{course['title']}'",
            "author": "Админ",
            "timestamp": course["updatedAt"]
        })
    
    # Sort by timestamp
    recent_activity.sort(key=lambda x: x["timestamp"], reverse=True)
    
    return {
        "totalUsers": total_users,
        "totalStudents": total_students,
        "totalTeachers": total_teachers,
        "totalCourses": total_courses,
        "totalLessons": total_lessons,
        "totalClassrooms": total_classrooms,
        "activeUsers": active_users,
        "recentActivity": recent_activity[:5]
    }

@router.get("/courses", response_model=List[CourseAnalytics])
async def get_course_analytics(
    current_user: User = Depends(require_teacher_or_admin),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    analytics = await db_service.get_course_analytics()
    return analytics

@router.get("/course/{course_id}")
async def get_course_detailed_analytics(
    course_id: str,
    current_user: User = Depends(require_teacher_or_admin),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    course = await db_service.get_course_by_id(course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    # Get all progress for this course
    progress_cursor = db_service.db.progress.find({"courseId": course_id})
    all_progress = []
    async for progress in progress_cursor:
        all_progress.append(Progress(**progress))
    
    # Get course lessons
    lessons = await db_service.get_lessons_by_course(course_id)
    
    # Calculate statistics
    unique_students = set(p.userId for p in all_progress)
    total_students = len(unique_students)
    completed_progress = [p for p in all_progress if p.status == ProgressStatus.COMPLETED]
    
    # Lesson completion rates
    lesson_stats = []
    for lesson in lessons:
        lesson_progress = [p for p in all_progress if p.lessonId == lesson.id]
        lesson_completed = [p for p in lesson_progress if p.status == ProgressStatus.COMPLETED]
        
        lesson_stats.append({
            "lessonId": lesson.id,
            "lessonTitle": lesson.title,
            "totalAttempts": len(lesson_progress),
            "completions": len(lesson_completed),
            "completionRate": (len(lesson_completed) / len(lesson_progress) * 100) if lesson_progress else 0,
            "averageScore": sum(p.score for p in lesson_completed) / len(lesson_completed) if lesson_completed else 0
        })
    
    return {
        "courseId": course_id,
        "courseName": course.title,
        "totalStudents": total_students,
        "totalLessons": len(lessons),
        "totalCompletions": len(completed_progress),
        "averageCompletion": (len(completed_progress) / (total_students * len(lessons)) * 100) if total_students and lessons else 0,
        "lessonStats": lesson_stats
    }

@router.get("/student/{student_id}")
async def get_student_analytics(
    student_id: str,
    current_user: User = Depends(get_current_user_with_db),
    db_service: DatabaseService = Depends(lambda: DatabaseService(None))
):
    # Check permissions
    if (current_user.id != student_id and 
        current_user.role not in [UserRole.TEACHER, UserRole.ADMIN]):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    student = await db_service.get_user_by_id(student_id)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Get student progress
    student_progress = await db_service.get_user_progress(student_id)
    completed_lessons = [p for p in student_progress if p.status == ProgressStatus.COMPLETED]
    
    # Get achievements
    achievements = await db_service.get_user_achievements(student_id)
    
    # Calculate study time
    total_study_time = sum(p.timeSpent for p in student_progress)
    
    # Course breakdown
    courses = await db_service.get_courses()
    course_breakdown = []
    
    for course in courses:
        course_progress = [p for p in student_progress if p.courseId == course.id]
        course_completed = [p for p in course_progress if p.status == ProgressStatus.COMPLETED]
        course_lessons = await db_service.get_lessons_by_course(course.id)
        
        if course_progress:  # Only include courses where student has progress
            course_breakdown.append({
                "courseId": course.id,
                "courseName": course.title,
                "totalLessons": len(course_lessons),
                "completedLessons": len(course_completed),
                "progressPercentage": (len(course_completed) / len(course_lessons) * 100) if course_lessons else 0,
                "timeSpent": sum(p.timeSpent for p in course_progress)
            })
    
    return {
        "studentId": student_id,
        "studentName": student.name,
        "totalXP": student.profile.totalXP,
        "level": student.profile.level,
        "streak": student.profile.streak,
        "totalLessons": len(student_progress),
        "completedLessons": len(completed_lessons),
        "totalStudyTime": total_study_time,
        "achievementCount": len(achievements),
        "courseBreakdown": course_breakdown,
        "recentAchievements": achievements[:5]
    }

@router.get("/classroom/{classroom_id}")
async def get_classroom_analytics(
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
    
    # Get detailed progress for classroom
    progress_data = await db_service.get_classroom_progress(classroom_id)
    
    # Calculate classroom statistics
    total_students = len(classroom.students)
    active_students = len(progress_data)  # Students with any progress
    
    if progress_data:
        average_progress = sum(p.get("progressPercentage", 0) for p in progress_data) / len(progress_data)
        total_completions = sum(p.get("completedLessons", 0) for p in progress_data)
    else:
        average_progress = 0
        total_completions = 0
    
    return {
        "classroomId": classroom_id,
        "classroomName": classroom.name,
        "totalStudents": total_students,
        "activeStudents": active_students,
        "averageProgress": round(average_progress, 1),
        "totalCompletions": total_completions,
        "studentsProgress": progress_data
    }