// Full Year Go Programming Course Data
export const fullYearCourse = [
  {
    id: 1,
    title: "Основы программирования на Go",
    description: "Введение в язык программирования Go, синтаксис, основные конструкции",
    duration: "2 месяца",
    order: 1,
    color: "from-blue-500 to-indigo-600",
    lessons: [
      {
        id: 1,
        title: "История и философия Go",
        description: "Зачем был создан Go и где он используется",
        type: "theory",
        duration: 45,
        order: 1
      },
      {
        id: 2,
        title: "Установка и настройка среды разработки",
        description: "Установка Go, настройка VS Code, первые команды",
        type: "practice",
        duration: 60,
        order: 2
      },
      {
        id: 3,
        title: "Первая программа Hello World",
        description: "Создание и запуск первой программы на Go",
        type: "coding",
        duration: 45,
        order: 3
      },
      {
        id: 4,
        title: "Переменные и константы",
        description: "Объявление переменных, типы данных, константы",
        type: "theory",
        duration: 60,
        order: 4
      },
      {
        id: 5,
        title: "Работа с числами",
        description: "Арифметические операции, типы чисел",
        type: "coding",
        duration: 50,
        order: 5
      },
      {
        id: 6,
        title: "Строки и работа с текстом",
        description: "Строковые операции, форматирование",
        type: "coding",
        duration: 55,
        order: 6
      },
      {
        id: 7,
        title: "Условные операторы if/else",
        description: "Принятие решений в программе",
        type: "theory",
        duration: 50,
        order: 7
      },
      {
        id: 8,
        title: "Оператор switch",
        description: "Множественный выбор в Go",
        type: "practice",
        duration: 45,
        order: 8
      }
    ]
  },
  {
    id: 2,
    title: "Циклы и структуры данных",
    description: "Изучение циклов, массивов, срезов и карт в Go",
    duration: "2 месяца",
    order: 2,
    color: "from-green-500 to-emerald-600",
    lessons: [
      {
        id: 9,
        title: "Цикл for - основы",
        description: "Различные формы цикла for в Go",
        type: "theory",
        duration: 55,
        order: 1
      },
      {
        id: 10,
        title: "Цикл for с range",
        description: "Итерация по коллекциям",
        type: "practice",
        duration: 50,
        order: 2
      },
      {
        id: 11,
        title: "Массивы в Go",
        description: "Создание и работа с массивами",
        type: "coding",
        duration: 60,
        order: 3
      },
      {
        id: 12,
        title: "Срезы (Slices)",
        description: "Динамические массивы в Go",
        type: "theory",
        duration: 65,
        order: 4
      },
      {
        id: 13,
        title: "Операции со срезами",
        description: "append, copy, len, cap",
        type: "coding",
        duration: 70,
        order: 5
      },
      {
        id: 14,
        title: "Карты (Maps)",
        description: "Ассоциативные массивы в Go",
        type: "theory",
        duration: 60,
        order: 6
      },
      {
        id: 15,
        title: "Практика с картами",
        description: "Создание телефонной книги",
        type: "coding",
        duration: 75,
        order: 7
      }
    ]
  },
  {
    id: 3,
    title: "Функции и пакеты",
    description: "Создание функций, работа с пакетами, модульность кода",
    duration: "2 месяца",
    order: 3,
    color: "from-purple-500 to-pink-600",
    lessons: [
      {
        id: 16,
        title: "Основы функций",
        description: "Объявление и вызов функций",
        type: "theory",
        duration: 50,
        order: 1
      },
      {
        id: 17,
        title: "Параметры и возвращаемые значения",
        description: "Передача данных в функции и обратно",
        type: "practice",
        duration: 60,
        order: 2
      },
      {
        id: 18,
        title: "Множественные возвращаемые значения",
        description: "Особенность Go - возврат нескольких значений",
        type: "coding",
        duration: 55,
        order: 3
      },
      {
        id: 19,
        title: "Анонимные функции и замыкания",
        description: "Функции как значения первого класса",
        type: "theory",
        duration: 65,
        order: 4
      },
      {
        id: 20,
        title: "Рекурсия",
        description: "Функции, вызывающие сами себя",
        type: "coding",
        duration: 70,
        order: 5
      },
      {
        id: 21,
        title: "Пакеты в Go",
        description: "Организация кода в пакеты",
        type: "theory",
        duration: 60,
        order: 6
      },
      {
        id: 22,
        title: "Создание собственного пакета",
        description: "Практика создания и использования пакетов",
        type: "practice",
        duration: 80,
        order: 7
      }
    ]
  },
  {
    id: 4,
    title: "Структуры и методы",
    description: "Объектно-ориентированное программирование в Go",
    duration: "2 месяца",
    order: 4,
    color: "from-orange-500 to-red-600",
    lessons: [
      {
        id: 23,
        title: "Структуры (Structs)",
        description: "Создание пользовательских типов данных",
        type: "theory",
        duration: 55,
        order: 1
      },
      {
        id: 24,
        title: "Методы структур",
        description: "Добавление поведения к структурам",
        type: "practice",
        duration: 65,
        order: 2
      },
      {
        id: 25,
        title: "Указатели и методы",
        description: "Value receivers vs Pointer receivers",
        type: "theory",
        duration: 70,
        order: 3
      },
      {
        id: 26,
        title: "Встраивание структур",
        description: "Композиция вместо наследования",
        type: "coding",
        duration: 75,
        order: 4
      },
      {
        id: 27,
        title: "Интерфейсы",
        description: "Контракты поведения в Go",
        type: "theory",
        duration: 80,
        order: 5
      },
      {
        id: 28,
        title: "Полиморфизм через интерфейсы",
        description: "Различные реализации одного интерфейса",
        type: "coding",
        duration: 85,
        order: 6
      },
      {
        id: 29,
        title: "Проект: Система управления студентами",
        description: "Применение структур и интерфейсов",
        type: "practice",
        duration: 120,
        order: 7
      }
    ]
  },
  {
    id: 5,
    title: "Обработка ошибок и параллельность",
    description: "Обработка ошибок, горутины, каналы",
    duration: "2 месяца", 
    order: 5,
    color: "from-teal-500 to-cyan-600",
    lessons: [
      {
        id: 30,
        title: "Обработка ошибок в Go",
        description: "Идиоматический подход к ошибкам",
        type: "theory",
        duration: 60,
        order: 1
      },
      {
        id: 31,
        title: "Создание пользовательских ошибок",
        description: "Создание собственных типов ошибок",
        type: "practice",
        duration: 55,
        order: 2
      },
      {
        id: 32,
        title: "Panic и Recover",
        description: "Критические ошибки и их обработка",
        type: "theory",
        duration: 50,
        order: 3
      },
      {
        id: 33,
        title: "Введение в горутины",
        description: "Легковесные потоки в Go",
        type: "theory",
        duration: 65,
        order: 4
      },
      {
        id: 34,
        title: "Каналы (Channels)",
        description: "Коммуникация между горутинами",
        type: "practice",
        duration: 70,
        order: 5
      },
      {
        id: 35,
        title: "Select statement",
        description: "Работа с множественными каналами",
        type: "coding",
        duration: 75,
        order: 6
      },
      {
        id: 36,
        title: "Проект: Параллельный веб-скрапер",
        description: "Практическое применение горутин и каналов",
        type: "practice",
        duration: 150,
        order: 7
      }
    ]
  },
  {
    id: 6,
    title: "Веб-разработка и финальные проекты",
    description: "HTTP серверы, REST API, базы данных, финальные проекты",
    duration: "2 месяца",
    order: 6,
    color: "from-indigo-500 to-purple-600",
    lessons: [
      {
        id: 37,
        title: "HTTP сервер на Go",
        description: "Создание простого веб-сервера",
        type: "practice",
        duration: 90,
        order: 1
      },
      {
        id: 38,
        title: "Маршрутизация запросов",
        description: "Обработка различных URL путей",
        type: "coding",
        duration: 85,
        order: 2
      },
      {
        id: 39,
        title: "JSON и REST API",
        description: "Работа с JSON, создание API",
        type: "practice",
        duration: 100,
        order: 3
      },
      {
        id: 40,
        title: "Работа с базой данных",
        description: "Подключение к SQLite/PostgreSQL",
        type: "theory",
        duration: 95,
        order: 4
      },
      {
        id: 41,
        title: "CRUD операции",
        description: "Create, Read, Update, Delete в базе данных",
        type: "coding",
        duration: 110,
        order: 5
      },
      {
        id: 42,
        title: "Финальный проект: Блог API",
        description: "Создание полноценного REST API для блога",
        type: "practice",
        duration: 240,
        order: 6
      },
      {
        id: 43,
        title: "Презентация проектов",
        description: "Представление и защита финальных работ",
        type: "theory",
        duration: 120,
        order: 7
      }
    ]
  }
];

// Admin management data
export const adminData = {
  totalCourses: 6,
  totalLessons: 43,
  totalStudents: 150,
  totalTeachers: 8,
  recentActivity: [
    {
      id: 1,
      type: "lesson_created",
      title: "Создан урок 'HTTP сервер на Go'",
      author: "Мария Петровна",
      timestamp: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      type: "student_registered",
      title: "Новый студент: Алексей Иванов",
      author: "Система",
      timestamp: "2024-01-15T09:15:00Z"
    },
    {
      id: 3,
      type: "course_updated",
      title: "Обновлен курс 'Основы программирования на Go'",
      author: "Анна Смирнова",
      timestamp: "2024-01-14T16:45:00Z"
    }
  ],
  courseStats: [
    { name: "Основы Go", students: 45, completion: 78 },
    { name: "Структуры данных", students: 38, completion: 65 },
    { name: "Функции и пакеты", students: 32, completion: 52 },
    { name: "Структуры и методы", students: 25, completion: 40 },
    { name: "Параллельность", students: 18, completion: 28 },
    { name: "Веб-разработка", students: 12, completion: 15 }
  ]
};

// Classroom management templates
export const classroomTemplates = [
  {
    id: 1,
    name: "Начинающая группа",
    description: "Для студентов без опыта программирования",
    suggestedCourses: [1, 2],
    duration: "4 месяца",
    maxStudents: 15
  },
  {
    id: 2,
    name: "Продвинутая группа",
    description: "Для студентов с базовыми знаниями",
    suggestedCourses: [3, 4, 5, 6],
    duration: "8 месяцев",
    maxStudents: 12
  },
  {
    id: 3,
    name: "Интенсивный курс",
    description: "Полный курс за ускоренный период",
    suggestedCourses: [1, 2, 3, 4, 5, 6],
    duration: "6 месяцев",
    maxStudents: 10
  }
];

// Enhanced coding challenges for the full year
export const advancedChallenges = [
  {
    id: 1,
    title: "Калькулятор функций",
    description: "Создайте калькулятор с функциями для базовых операций",
    difficulty: "medium",
    points: 50,
    courseId: 3,
    template: `package main

import "fmt"

// Реализуйте функции для арифметических операций
func add(a, b float64) float64 {
    // Ваш код здесь
}

func subtract(a, b float64) float64 {
    // Ваш код здесь
}

func multiply(a, b float64) float64 {
    // Ваш код здесь
}

func divide(a, b float64) (float64, error) {
    // Ваш код здесь (не забудьте про деление на ноль!)
}

func main() {
    fmt.Println(add(10, 5))
    fmt.Println(subtract(10, 5))
    fmt.Println(multiply(10, 5))
    result, err := divide(10, 5)
    if err != nil {
        fmt.Println("Ошибка:", err)
    } else {
        fmt.Println(result)
    }
}`,
    hints: [
      "Не забудьте обработать деление на ноль",
      "Используйте return для возврата значений",
      "В divide возвращайте ошибку если b == 0"
    ]
  },
  {
    id: 2,
    title: "Система студентов",
    description: "Создайте структуру Student и методы для работы с ней",
    difficulty: "hard",
    points: 100,
    courseId: 4,
    template: `package main

import "fmt"

// Определите структуру Student
type Student struct {
    // Поля: Name (string), Age (int), Grades ([]int)
}

// Реализуйте метод для добавления оценки
func (s *Student) AddGrade(grade int) {
    // Ваш код здесь
}

// Реализуйте метод для расчета средней оценки
func (s Student) AverageGrade() float64 {
    // Ваш код здесь
}

// Реализуйте метод для получения информации о студенте
func (s Student) String() string {
    // Ваш код здесь
}

func main() {
    student := Student{Name: "Алексей", Age: 16}
    student.AddGrade(5)
    student.AddGrade(4)
    student.AddGrade(5)
    
    fmt.Println(student)
    fmt.Printf("Средняя оценка: %.2f\n", student.AverageGrade())
}`,
    hints: [
      "Структура должна содержать Name, Age и Grades",
      "Используйте append для добавления оценок",
      "Для среднего значения разделите сумму на количество"
    ]
  },
  {
    id: 3,
    title: "Параллельный счетчик",
    description: "Используйте горутины и каналы для параллельного подсчета",
    difficulty: "hard",
    points: 150,
    courseId: 5,
    template: `package main

import (
    "fmt"
    "time"
)

// Функция для подсчета чисел в диапазоне
func countNumbers(start, end int, result chan<- int) {
    // Ваш код здесь
    // Отправьте результат в канал
}

func main() {
    // Создайте канал для результатов
    results := make(chan int, 3)
    
    // Запустите 3 горутины для подсчета:
    // 1-1000, 1001-2000, 2001-3000
    
    // Соберите результаты и выведите общую сумму
    
    fmt.Println("Параллельный подсчет завершен!")
}`,
    hints: [
      "Используйте go keyword для запуска горутин",
      "Отправляйте результат в канал с помощью <-",
      "Не забудьте закрыть канал или использовать буферизованный канал"
    ]
  }
];