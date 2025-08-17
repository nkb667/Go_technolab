# Database seeder for initial data
from database import DatabaseService
from models import *
from auth import AuthService
import asyncio

async def seed_initial_data(db_service: DatabaseService, auth_service: AuthService):
    """Seed the database with initial courses and lessons"""
    
    # Check if data already exists
    existing_courses = await db_service.get_courses(limit=1)
    if existing_courses:
        print("Database already seeded, skipping...")
        return
    
    print("Seeding database with initial data...")
    
    # Create admin user
    admin_password = auth_service.get_password_hash("admin123")
    admin_user = User(
        email="admin@goacademy.ru",
        password=admin_password,
        name="Администратор",
        role=UserRole.ADMIN
    )
    await db_service.create_user(admin_user)
    
    # Create sample teacher
    teacher_password = auth_service.get_password_hash("teacher123")
    teacher_user = User(
        email="teacher@goacademy.ru",
        password=teacher_password,
        name="Мария Петровна",
        role=UserRole.TEACHER
    )
    await db_service.create_user(teacher_user)
    
    # Create sample student
    student_password = auth_service.get_password_hash("student123")
    student_user = User(
        email="student@goacademy.ru",
        password=student_password,
        name="Алексей Иванов",
        role=UserRole.STUDENT
    )
    await db_service.create_user(student_user)
    
    # Full year course data
    full_year_course = [
        {
            "title": "Основы программирования на Go",
            "description": "Введение в язык программирования Go, синтаксис, основные конструкции",
            "color": "from-blue-500 to-indigo-600",
            "order": 1,
            "lessons": [
                {
                    "title": "История и философия Go",
                    "description": "Зачем был создан Go и где он используется",
                    "type": LessonType.THEORY,
                    "duration": 45,
                    "order": 1,
                    "content": "# История Go\n\nGo был создан в Google в 2007 году командой Роберта Гризмера, Роба Пайка и Кена Томпсона..."
                },
                {
                    "title": "Установка и настройка среды разработки",
                    "description": "Установка Go, настройка VS Code, первые команды",
                    "type": LessonType.PRACTICE,
                    "duration": 60,
                    "order": 2,
                    "content": "# Установка Go\n\n1. Скачайте Go с официального сайта golang.org\n2. Установите VS Code..."
                },
                {
                    "title": "Первая программа Hello World",
                    "description": "Создание и запуск первой программы на Go",
                    "type": LessonType.CODING,
                    "duration": 45,
                    "order": 3,
                    "content": "# Hello World на Go\n\nСоздадим нашу первую программу...",
                    "coding_challenge": {
                        "template": """package main

import "fmt"

func main() {
    // Напишите код для вывода "Hello, World!" на экран
    
}""",
                        "solution": """package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}""",
                        "test_cases": [{"input": "", "expected_output": "Hello, World!"}],
                        "points": 10,
                        "difficulty": Difficulty.EASY,
                        "hints": ["Используйте fmt.Println()", "Не забудьте кавычки вокруг текста"]
                    }
                },
                {
                    "title": "Переменные и константы",
                    "description": "Объявление переменных, типы данных, константы",
                    "type": LessonType.THEORY,
                    "duration": 60,
                    "order": 4,
                    "content": "# Переменные в Go\n\nВ Go есть несколько способов объявления переменных..."
                },
                {
                    "title": "Работа с числами",
                    "description": "Арифметические операции, типы чисел",
                    "type": LessonType.CODING,
                    "duration": 50,
                    "order": 5,
                    "content": "# Числовые типы в Go\n\nGo поддерживает различные числовые типы...",
                    "coding_challenge": {
                        "template": """package main

import "fmt"

func add(a, b int) int {
    // Реализуйте функцию сложения
    
}

func main() {
    result := add(5, 3)
    fmt.Println(result)
}""",
                        "solution": """package main

import "fmt"

func add(a, b int) int {
    return a + b
}

func main() {
    result := add(5, 3)
    fmt.Println(result)
}""",
                        "test_cases": [{"input": "", "expected_output": "8"}],
                        "points": 25,
                        "difficulty": Difficulty.MEDIUM,
                        "hints": ["Используйте оператор +", "Не забудьте return"]
                    }
                }
            ]
        },
        {
            "title": "Циклы и структуры данных",
            "description": "Изучение циклов, массивов, срезов и карт в Go",
            "color": "from-green-500 to-emerald-600", 
            "order": 2,
            "lessons": [
                {
                    "title": "Цикл for - основы",
                    "description": "Различные формы цикла for в Go",
                    "type": LessonType.THEORY,
                    "duration": 55,
                    "order": 1,
                    "content": "# Циклы в Go\n\nВ Go есть только один тип цикла - for, но он очень гибкий..."
                },
                {
                    "title": "Массивы в Go",
                    "description": "Создание и работа с массивами",
                    "type": LessonType.CODING,
                    "duration": 60,
                    "order": 2,
                    "content": "# Массивы в Go\n\nМассивы - это упорядоченные коллекции элементов...",
                    "coding_challenge": {
                        "template": """package main

import "fmt"

func main() {
    // Создайте массив из 5 чисел и выведите их
    
}""",
                        "solution": """package main

import "fmt"

func main() {
    numbers := [5]int{1, 2, 3, 4, 5}
    for _, num := range numbers {
        fmt.Println(num)
    }
}""",
                        "test_cases": [{"input": "", "expected_output": "1\n2\n3\n4\n5"}],
                        "points": 30,
                        "difficulty": Difficulty.MEDIUM,
                        "hints": ["Используйте [размер]тип{элементы}", "Используйте range для итерации"]
                    }
                }
            ]
        }
    ]
    
    # Create courses and lessons
    for course_data in full_year_course:
        # Create course
        course = Course(
            title=course_data["title"],
            description=course_data["description"],
            color=course_data["color"],
            order=course_data["order"],
            createdBy=admin_user.id
        )
        created_course = await db_service.create_course(course)
        
        # Create lessons for the course
        for lesson_data in course_data["lessons"]:
            coding_challenge = None
            if "coding_challenge" in lesson_data:
                cc_data = lesson_data["coding_challenge"]
                coding_challenge = CodingChallenge(
                    template=cc_data["template"],
                    solution=cc_data["solution"],
                    testCases=[TestCase(**tc) for tc in cc_data["test_cases"]],
                    points=cc_data["points"],
                    difficulty=cc_data["difficulty"],
                    hints=cc_data["hints"]
                )
            
            lesson = Lesson(
                title=lesson_data["title"],
                description=lesson_data["description"],
                content=lesson_data["content"],
                type=lesson_data["type"],
                duration=lesson_data["duration"],
                order=lesson_data["order"],
                courseId=created_course.id,
                codingChallenge=coding_challenge
            )
            await db_service.create_lesson(lesson)
    
    # Create sample classroom
    classroom_create = ClassroomCreate(
        name="Go разработчики 2024",
        description="Основная группа для изучения Go",
        maxStudents=20,
        selectedCourses=[course.id for course in await db_service.get_courses()]
    )
    
    await db_service.create_classroom(classroom_create, teacher_user.id)
    
    print("Database seeded successfully!")
    print("Admin: admin@goacademy.ru / admin123")
    print("Teacher: teacher@goacademy.ru / teacher123") 
    print("Student: student@goacademy.ru / student123")