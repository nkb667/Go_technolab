from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum
import uuid

# Enums
class UserRole(str, Enum):
    STUDENT = "student"
    TEACHER = "teacher" 
    ADMIN = "admin"

class LessonType(str, Enum):
    THEORY = "theory"
    PRACTICE = "practice"
    CODING = "coding"

class ProgressStatus(str, Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"

class Difficulty(str, Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"

# User Models
class UserProfile(BaseModel):
    level: int = 1
    totalXP: int = 0
    streak: int = 0
    lastActiveDate: Optional[datetime] = None

class UserCreate(BaseModel):
    email: str
    password: str
    name: str
    role: UserRole = UserRole.STUDENT

class UserLogin(BaseModel):
    email: str
    password: str

class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    password: str  # Will be hashed
    name: str
    role: UserRole
    avatar: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    profile: UserProfile = Field(default_factory=UserProfile)

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: UserRole
    avatar: Optional[str] = None
    createdAt: datetime
    profile: UserProfile

# Coding Challenge Models
class TestCase(BaseModel):
    input: str = ""
    expectedOutput: str

class CodingChallenge(BaseModel):
    template: str
    solution: str
    testCases: List[TestCase] = []
    points: int = 10
    difficulty: Difficulty = Difficulty.EASY
    hints: List[str] = []

# Lesson Models
class LessonCreate(BaseModel):
    title: str
    description: str
    content: str = ""
    type: LessonType
    duration: int  # minutes
    order: int
    courseId: str
    codingChallenge: Optional[CodingChallenge] = None

class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content: Optional[str] = None
    type: Optional[LessonType] = None
    duration: Optional[int] = None
    order: Optional[int] = None
    codingChallenge: Optional[CodingChallenge] = None

class Lesson(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    content: str = ""
    type: LessonType
    duration: int
    order: int
    courseId: str
    codingChallenge: Optional[CodingChallenge] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

# Course Models
class CourseCreate(BaseModel):
    title: str
    description: str
    order: int = 1
    color: str = "from-blue-500 to-indigo-600"

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    order: Optional[int] = None
    isPublished: Optional[bool] = None
    color: Optional[str] = None

class Course(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    order: int
    color: str = "from-blue-500 to-indigo-600"
    isPublished: bool = True
    createdBy: str
    lessons: List[str] = []  # lesson IDs
    duration: str = "2 месяца"
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

class CourseWithLessons(BaseModel):
    id: str
    title: str
    description: str
    order: int
    color: str
    isPublished: bool
    createdBy: str
    lessons: List[Lesson]
    duration: str
    createdAt: datetime
    updatedAt: datetime

# Classroom Models
class ClassroomCreate(BaseModel):
    name: str
    description: str
    maxStudents: int = 20
    selectedCourses: List[str] = []

class ClassroomUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    maxStudents: Optional[int] = None
    isActive: Optional[bool] = None

class Classroom(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    teacherId: str
    students: List[str] = []  # user IDs
    courseIds: List[str] = []
    maxStudents: int = 20
    inviteCode: str
    isActive: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)

class ClassroomResponse(BaseModel):
    id: str
    name: str
    description: str
    teacherId: str
    students: int  # count
    maxStudents: int
    courses: int  # count
    inviteCode: str
    isActive: bool
    createdAt: datetime

# Progress Models
class ProgressCreate(BaseModel):
    lessonId: str
    courseId: str
    classroomId: Optional[str] = None

class ProgressUpdate(BaseModel):
    status: Optional[ProgressStatus] = None
    score: Optional[int] = None
    timeSpent: Optional[int] = None

class Progress(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    lessonId: str
    courseId: str
    classroomId: Optional[str] = None
    status: ProgressStatus = ProgressStatus.NOT_STARTED
    score: int = 0
    timeSpent: int = 0  # minutes
    completedAt: Optional[datetime] = None
    attempts: int = 0

# Achievement Models
class AchievementCreate(BaseModel):
    type: str
    title: str
    description: str
    icon: str
    points: int = 10

class Achievement(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    type: str
    title: str
    description: str
    icon: str
    earnedAt: datetime = Field(default_factory=datetime.utcnow)
    points: int

# Code Submission Models
class CodeSubmission(BaseModel):
    lessonId: str
    code: str

class CodeSubmissionResult(BaseModel):
    success: bool
    output: str
    error: Optional[str] = None
    testsPass: bool = False
    score: int = 0

# JWT Token Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

# Analytics Models
class StudentProgressSummary(BaseModel):
    userId: str
    userName: str
    totalLessons: int
    completedLessons: int
    progressPercentage: int
    totalXP: int
    lastActiveDate: Optional[datetime]

class CourseAnalytics(BaseModel):
    courseId: str
    courseName: str
    totalStudents: int
    averageCompletion: int
    totalLessons: int

class ClassroomAnalytics(BaseModel):
    classroomId: str
    classroomName: str
    totalStudents: int
    activeStudents: int
    averageProgress: int
    studentsProgress: List[StudentProgressSummary]