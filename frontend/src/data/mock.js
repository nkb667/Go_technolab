// Mock data for Go learning platform

export const courseModules = [
  {
    id: 1,
    title: "Введение в Go",
    description: "Основы языка программирования Go",
    lessons: [
      {
        id: 1,
        title: "Что такое Go?",
        duration: "15 мин",
        type: "theory",
        completed: true
      },
      {
        id: 2,
        title: "Установка и настройка",
        duration: "20 мин",
        type: "practice",
        completed: true
      },
      {
        id: 3,
        title: "Первая программа",
        duration: "25 мин",
        type: "coding",
        completed: false
      }
    ],
    progress: 67,
    unlocked: true
  },
  {
    id: 2,
    title: "Переменные и типы данных",
    description: "Изучаем основные типы данных в Go",
    lessons: [
      {
        id: 4,
        title: "Объявление переменных",
        duration: "30 мин",
        type: "theory",
        completed: false
      },
      {
        id: 5,
        title: "Числовые типы",
        duration: "25 мин",
        type: "practice",
        completed: false
      },
      {
        id: 6,
        title: "Строки и булевы значения",
        duration: "20 мин",
        type: "coding",
        completed: false
      }
    ],
    progress: 0,
    unlocked: true
  },
  {
    id: 3,
    title: "Условия и циклы",
    description: "Управляющие конструкции в Go",
    lessons: [
      {
        id: 7,
        title: "Условные операторы if/else",
        duration: "35 мин",
        type: "theory",
        completed: false
      },
      {
        id: 8,
        title: "Switch конструкция",
        duration: "25 мин",
        type: "practice",
        completed: false
      },
      {
        id: 9,
        title: "Циклы for",
        duration: "40 мин",
        type: "coding",
        completed: false
      }
    ],
    progress: 0,
    unlocked: false
  },
  {
    id: 4,
    title: "Функции",
    description: "Создание и использование функций",
    lessons: [
      {
        id: 10,
        title: "Объявление функций",
        duration: "30 мин",
        type: "theory",
        completed: false
      },
      {
        id: 11,
        title: "Параметры и возвращаемые значения",
        duration: "35 мин",
        type: "practice",
        completed: false
      },
      {
        id: 12,
        title: "Функции высшего порядка",
        duration: "45 мин",
        type: "coding",
        completed: false
      }
    ],
    progress: 0,
    unlocked: false
  }
];

export const studentProgress = {
  id: 1,
  name: "Алексей Иванов",
  email: "alex.ivanov@example.com",
  totalProgress: 23,
  completedLessons: 2,
  totalLessons: 12,
  streak: 3,
  points: 150,
  level: 1,
  achievements: [
    {
      id: 1,
      title: "Первые шаги",
      description: "Завершил первый урок",
      icon: "🎯",
      earned: true
    },
    {
      id: 2,
      title: "Программист",
      description: "Написал первую программу",
      icon: "💻",
      earned: true
    },
    {
      id: 3,
      title: "Упорство",
      description: "3 дня подряд занимался",
      icon: "🔥",
      earned: true
    },
    {
      id: 4,
      title: "Исследователь",
      description: "Завершил 10 уроков",
      icon: "🔍",
      earned: false
    }
  ]
};

export const codingChallenges = [
  {
    id: 1,
    title: "Hello, World!",
    description: "Напишите программу, которая выводит 'Hello, World!' на экран",
    difficulty: "easy",
    points: 10,
    template: `package main

import "fmt"

func main() {
    // Напишите ваш код здесь
    
}`,
    solution: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
    testCases: [
      {
        input: "",
        expectedOutput: "Hello, World!"
      }
    ]
  },
  {
    id: 2,
    title: "Калькулятор",
    description: "Создайте простой калькулятор для сложения двух чисел",
    difficulty: "medium",
    points: 25,
    template: `package main

import "fmt"

func add(a, b int) int {
    // Реализуйте функцию сложения
    
}

func main() {
    result := add(5, 3)
    fmt.Println(result)
}`,
    solution: `package main

import "fmt"

func add(a, b int) int {
    return a + b
}

func main() {
    result := add(5, 3)
    fmt.Println(result)
}`,
    testCases: [
      {
        input: "",
        expectedOutput: "8"
      }
    ]
  }
];

export const classroomData = {
  className: "Go разработчики 2024",
  teacherName: "Мария Петровна",
  students: [
    {
      id: 1,
      name: "Алексей Иванов",
      progress: 23,
      lastActive: "2024-01-15",
      completedTasks: 2,
      totalTasks: 12
    },
    {
      id: 2,
      name: "Анна Смирнова",
      progress: 45,
      lastActive: "2024-01-14",
      completedTasks: 5,
      totalTasks: 12
    },
    {
      id: 3,
      name: "Дмитрий Козлов",
      progress: 12,
      lastActive: "2024-01-13",
      completedTasks: 1,
      totalTasks: 12
    },
    {
      id: 4,
      name: "Елена Волкова",
      progress: 67,
      lastActive: "2024-01-15",
      completedTasks: 8,
      totalTasks: 12
    }
  ]
};