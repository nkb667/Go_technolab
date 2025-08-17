from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from typing import List, Optional, Dict, Any
from models import *
from datetime import datetime, timedelta
import os
import random
import string

class DatabaseService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
    
    # User Operations
    async def create_user(self, user: User) -> User:
        user_dict = user.dict()
        await self.db.users.insert_one(user_dict)
        return user
    
    async def get_user_by_id(self, user_id: str) -> Optional[User]:
        user_data = await self.db.users.find_one({"id": user_id})
        if user_data:
            return User(**user_data)
        return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        user_data = await self.db.users.find_one({"email": email})
        if user_data:
            return User(**user_data)
        return None
    
    async def update_user_profile(self, user_id: str, profile_update: dict) -> bool:
        result = await self.db.users.update_one(
            {"id": user_id},
            {"$set": {f"profile.{k}": v for k, v in profile_update.items()}}
        )
        return result.modified_count > 0
    
    # Course Operations
    async def create_course(self, course: Course) -> Course:
        course_dict = course.dict()
        await self.db.courses.insert_one(course_dict)
        return course
    
    async def get_courses(self, skip: int = 0, limit: int = 100) -> List[Course]:
        cursor = self.db.courses.find().skip(skip).limit(limit).sort("order", 1)
        courses = []
        async for course_data in cursor:
            courses.append(Course(**course_data))
        return courses
    
    async def get_course_by_id(self, course_id: str) -> Optional[Course]:
        course_data = await self.db.courses.find_one({"id": course_id})
        if course_data:
            return Course(**course_data)
        return None
    
    async def update_course(self, course_id: str, course_update: CourseUpdate) -> bool:
        update_data = {k: v for k, v in course_update.dict().items() if v is not None}
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await self.db.courses.update_one(
            {"id": course_id},
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    async def delete_course(self, course_id: str) -> bool:
        result = await self.db.courses.delete_one({"id": course_id})
        return result.deleted_count > 0
    
    # Lesson Operations
    async def create_lesson(self, lesson: Lesson) -> Lesson:
        lesson_dict = lesson.dict()
        await self.db.lessons.insert_one(lesson_dict)
        
        # Add lesson ID to course
        await self.db.courses.update_one(
            {"id": lesson.courseId},
            {"$push": {"lessons": lesson.id}}
        )
        
        return lesson
    
    async def get_lessons_by_course(self, course_id: str) -> List[Lesson]:
        cursor = self.db.lessons.find({"courseId": course_id}).sort("order", 1)
        lessons = []
        async for lesson_data in cursor:
            lessons.append(Lesson(**lesson_data))
        return lessons
    
    async def get_lesson_by_id(self, lesson_id: str) -> Optional[Lesson]:
        lesson_data = await self.db.lessons.find_one({"id": lesson_id})
        if lesson_data:
            return Lesson(**lesson_data)
        return None
    
    async def update_lesson(self, lesson_id: str, lesson_update: LessonUpdate) -> bool:
        update_data = {k: v for k, v in lesson_update.dict().items() if v is not None}
        update_data["updatedAt"] = datetime.utcnow()
        
        result = await self.db.lessons.update_one(
            {"id": lesson_id},
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    async def delete_lesson(self, lesson_id: str) -> bool:
        # Get lesson to remove from course
        lesson = await self.get_lesson_by_id(lesson_id)
        if lesson:
            await self.db.courses.update_one(
                {"id": lesson.courseId},
                {"$pull": {"lessons": lesson_id}}
            )
        
        result = await self.db.lessons.delete_one({"id": lesson_id})
        return result.deleted_count > 0
    
    # Classroom Operations
    def generate_invite_code(self) -> str:
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    
    async def create_classroom(self, classroom_create: ClassroomCreate, teacher_id: str) -> Classroom:
        classroom = Classroom(
            **classroom_create.dict(),
            teacherId=teacher_id,
            courseIds=classroom_create.selectedCourses,
            inviteCode=self.generate_invite_code()
        )
        
        classroom_dict = classroom.dict()
        await self.db.classrooms.insert_one(classroom_dict)
        return classroom
    
    async def get_classrooms_by_teacher(self, teacher_id: str) -> List[Classroom]:
        cursor = self.db.classrooms.find({"teacherId": teacher_id})
        classrooms = []
        async for classroom_data in cursor:
            classrooms.append(Classroom(**classroom_data))
        return classrooms
    
    async def get_classroom_by_id(self, classroom_id: str) -> Optional[Classroom]:
        classroom_data = await self.db.classrooms.find_one({"id": classroom_id})
        if classroom_data:
            return Classroom(**classroom_data)
        return None
    
    async def get_classroom_by_invite_code(self, invite_code: str) -> Optional[Classroom]:
        classroom_data = await self.db.classrooms.find_one({"inviteCode": invite_code})
        if classroom_data:
            return Classroom(**classroom_data)
        return None
    
    async def join_classroom(self, classroom_id: str, student_id: str) -> bool:
        result = await self.db.classrooms.update_one(
            {"id": classroom_id, "students": {"$ne": student_id}},
            {"$push": {"students": student_id}}
        )
        return result.modified_count > 0
    
    async def leave_classroom(self, classroom_id: str, student_id: str) -> bool:
        result = await self.db.classrooms.update_one(
            {"id": classroom_id},
            {"$pull": {"students": student_id}}
        )
        return result.modified_count > 0
    
    # Progress Operations
    async def create_or_update_progress(self, user_id: str, progress_create: ProgressCreate) -> Progress:
        # Check if progress already exists
        existing = await self.db.progress.find_one({
            "userId": user_id,
            "lessonId": progress_create.lessonId
        })
        
        if existing:
            progress = Progress(**existing)
            progress.attempts += 1
            await self.db.progress.update_one(
                {"id": progress.id},
                {"$set": progress.dict()}
            )
        else:
            progress = Progress(userId=user_id, **progress_create.dict())
            await self.db.progress.insert_one(progress.dict())
        
        return progress
    
    async def update_progress(self, progress_id: str, progress_update: ProgressUpdate) -> bool:
        update_data = {k: v for k, v in progress_update.dict().items() if v is not None}
        
        if progress_update.status == ProgressStatus.COMPLETED:
            update_data["completedAt"] = datetime.utcnow()
        
        result = await self.db.progress.update_one(
            {"id": progress_id},
            {"$set": update_data}
        )
        return result.modified_count > 0
    
    async def get_user_progress(self, user_id: str) -> List[Progress]:
        cursor = self.db.progress.find({"userId": user_id})
        progress_list = []
        async for progress_data in cursor:
            progress_list.append(Progress(**progress_data))
        return progress_list
    
    async def get_course_progress(self, user_id: str, course_id: str) -> List[Progress]:
        cursor = self.db.progress.find({"userId": user_id, "courseId": course_id})
        progress_list = []
        async for progress_data in cursor:
            progress_list.append(Progress(**progress_data))
        return progress_list
    
    async def get_classroom_progress(self, classroom_id: str) -> List[Dict[str, Any]]:
        pipeline = [
            {"$match": {"classroomId": classroom_id}},
            {"$group": {
                "_id": "$userId",
                "completedLessons": {"$sum": {"$cond": [{"$eq": ["$status", "completed"]}, 1, 0]}},
                "totalLessons": {"$sum": 1},
                "totalScore": {"$sum": "$score"}
            }},
            {"$lookup": {
                "from": "users",
                "localField": "_id",
                "foreignField": "id",
                "as": "user"
            }},
            {"$unwind": "$user"},
            {"$project": {
                "userId": "$_id",
                "userName": "$user.name",
                "completedLessons": 1,
                "totalLessons": 1,
                "totalScore": 1,
                "progressPercentage": {"$multiply": [{"$divide": ["$completedLessons", "$totalLessons"]}, 100]}
            }}
        ]
        
        result = []
        async for doc in self.db.progress.aggregate(pipeline):
            result.append(doc)
        return result
    
    # Achievement Operations
    async def create_achievement(self, achievement: Achievement) -> Achievement:
        achievement_dict = achievement.dict()
        await self.db.achievements.insert_one(achievement_dict)
        
        # Update user XP
        await self.db.users.update_one(
            {"id": achievement.userId},
            {"$inc": {"profile.totalXP": achievement.points}}
        )
        
        return achievement
    
    async def get_user_achievements(self, user_id: str) -> List[Achievement]:
        cursor = self.db.achievements.find({"userId": user_id}).sort("earnedAt", -1)
        achievements = []
        async for achievement_data in cursor:
            achievements.append(Achievement(**achievement_data))
        return achievements
    
    # Analytics Operations
    async def get_course_analytics(self) -> List[CourseAnalytics]:
        pipeline = [
            {"$lookup": {
                "from": "progress",
                "localField": "id",
                "foreignField": "courseId",
                "as": "progress"
            }},
            {"$project": {
                "courseId": "$id",
                "courseName": "$title",
                "totalLessons": {"$size": "$lessons"},
                "totalStudents": {"$size": {"$setUnion": ["$progress.userId"]}},
                "completedProgress": {"$size": {"$filter": {
                    "input": "$progress",
                    "cond": {"$eq": ["$$this.status", "completed"]}
                }}},
                "totalProgress": {"$size": "$progress"}
            }},
            {"$addFields": {
                "averageCompletion": {"$cond": [
                    {"$eq": ["$totalProgress", 0]},
                    0,
                    {"$multiply": [{"$divide": ["$completedProgress", "$totalProgress"]}, 100]}
                ]}
            }}
        ]
        
        analytics = []
        async for doc in self.db.courses.aggregate(pipeline):
            analytics.append(CourseAnalytics(**doc))
        return analytics