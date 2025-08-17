# API Contracts - Go Academy

## Overview
Полноценная образовательная платформа для изучения Go с админ-панелью, управлением классами и редактированием контента.

## Backend Implementation Plan

### 1. Модели данных (MongoDB)

#### User Model
```javascript
{
  _id: ObjectId,
  email: String,
  password: String (hashed),
  name: String,
  role: 'student' | 'teacher' | 'admin',
  avatar: String,
  createdAt: Date,
  profile: {
    level: Number,
    totalXP: Number,
    streak: Number,
    lastActiveDate: Date
  }
}
```

#### Course Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  order: Number,
  isPublished: Boolean,
  createdBy: ObjectId,
  lessons: [ObjectId], // refs to Lesson
  createdAt: Date,
  updatedAt: Date
}
```

#### Lesson Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  content: String, // markdown content
  type: 'theory' | 'practice' | 'coding',
  duration: Number, // minutes
  order: Number,
  courseId: ObjectId,
  codingChallenge: {
    template: String,
    solution: String,
    testCases: [{
      input: String,
      expectedOutput: String
    }],
    points: Number,
    difficulty: 'easy' | 'medium' | 'hard'
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### Classroom Model
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  teacherId: ObjectId,
  students: [ObjectId],
  courseIds: [ObjectId],
  inviteCode: String,
  isActive: Boolean,
  createdAt: Date
}
```

#### Progress Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  lessonId: ObjectId,
  courseId: ObjectId,
  classroomId: ObjectId,
  status: 'not_started' | 'in_progress' | 'completed',
  score: Number,
  timeSpent: Number, // minutes
  completedAt: Date,
  attempts: Number
}
```

#### Achievement Model
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,
  title: String,
  description: String,
  icon: String,
  earnedAt: Date,
  points: Number
}
```

### 2. API Endpoints

#### Authentication
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `POST /api/auth/logout` - Выход
- `GET /api/auth/me` - Текущий пользователь

#### Courses (Public)
- `GET /api/courses` - Список курсов
- `GET /api/courses/:id` - Детали курса
- `GET /api/courses/:id/lessons` - Уроки курса

#### Lessons (Public)
- `GET /api/lessons/:id` - Детали урока
- `POST /api/lessons/:id/submit` - Отправка решения задачи

#### Admin - Course Management
- `POST /api/admin/courses` - Создать курс
- `PUT /api/admin/courses/:id` - Обновить курс
- `DELETE /api/admin/courses/:id` - Удалить курс
- `POST /api/admin/courses/:id/lessons` - Добавить урок
- `PUT /api/admin/lessons/:id` - Обновить урок
- `DELETE /api/admin/lessons/:id` - Удалить урок
- `PUT /api/admin/courses/:id/reorder` - Изменить порядок уроков

#### Classroom Management
- `GET /api/classrooms` - Мои классы
- `POST /api/classrooms` - Создать класс
- `PUT /api/classrooms/:id` - Обновить класс
- `DELETE /api/classrooms/:id` - Удалить класс
- `POST /api/classrooms/:id/join` - Присоединиться к классу (по коду)
- `GET /api/classrooms/:id/students` - Студенты класса
- `GET /api/classrooms/:id/progress` - Прогресс класса

#### Progress & Analytics
- `GET /api/progress/me` - Мой прогресс
- `GET /api/progress/classroom/:id` - Прогресс класса
- `GET /api/achievements/me` - Мои достижения
- `GET /api/analytics/dashboard` - Дашборд аналитики

### 3. Замена Mock данных

**Текущие mock файлы для замены:**
- `courseModules` → API `/api/courses`
- `studentProgress` → API `/api/progress/me`
- `codingChallenges` → API `/api/lessons/:id` (with coding challenges)
- `classroomData` → API `/api/classrooms`

**Новые компоненты для создания:**
- `AdminPanel` - управление курсами и уроками
- `ClassroomManagement` - создание и управление классами
- `LessonEditor` - WYSIWYG редактор уроков
- `CodeEditor` - улучшенный редактор с подсветкой Go синтаксиса
- `StudentInvite` - система приглашений в класс

### 4. Frontend Integration

#### Новые хуки:
- `useAuth()` - аутентификация
- `useCourses()` - управление курсами
- `useProgress()` - прогресс пользователя
- `useClassroom()` - управление классами

#### Роутинг:
- `/admin` - админ-панель
- `/admin/courses` - управление курсами
- `/admin/courses/:id/edit` - редактор курса
- `/admin/lessons/:id/edit` - редактор урока
- `/classrooms/create` - создание класса
- `/classrooms/:id/manage` - управление классом
- `/lessons/:id` - просмотр урока

### 5. Security & Permissions

#### Middleware:
- `authenticate` - проверка JWT токена
- `authorize` - проверка ролей (student/teacher/admin)
- `classroomAccess` - доступ к классу (учитель или студент)

#### Permissions:
- **Admin**: полный доступ к курсам и контенту
- **Teacher**: создание классов, просмотр прогресса студентов
- **Student**: доступ к назначенным курсам, отслеживание прогресса

### 6. Integration Steps

1. **Создать backend модели и endpoints**
2. **Добавить аутентификацию JWT**
3. **Создать админ-панель для управления контентом**
4. **Интегрировать frontend с реальными API**
5. **Добавить систему ролей и permissions**
6. **Создать систему приглашений в классы**
7. **Добавить real-time обновления прогресса**

### 7. New Features to Add

#### Годовой курс (расширенное содержание):
- **Основы Go** (2 месяца)
- **Структуры данных** (2 месяца)  
- **Объектно-ориентированное программирование** (2 месяца)
- **Параллельность и горутины** (2 месяца)
- **Web разработка** (2 месяца)
- **Финальные проекты** (2 месяца)

#### Админ функции:
- Drag & drop редактор уроков
- Загрузка изображений и видео
- Предварительный просмотр уроков
- Статистика использования контента
- Bulk операции для управления контентом

#### Classroom функции:
- Система оценок и комментариев
- Календарь дедлайнов
- Групповые проекты
- Peer review система
- Интеграция с системами LMS