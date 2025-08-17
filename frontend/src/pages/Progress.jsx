import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { 
  Trophy, 
  Star, 
  Target, 
  Zap,
  Calendar,
  BookOpen,
  Code,
  Award,
  TrendingUp
} from "lucide-react";
import { studentProgress, courseModules } from "../data/mock";

const ProgressPage = () => {
  const completedModules = courseModules.filter(module => module.progress === 100).length;
  const totalModules = courseModules.length;
  const inProgressModules = courseModules.filter(module => module.progress > 0 && module.progress < 100).length;

  const weeklyProgress = [
    { day: "Пн", lessons: 2, points: 50 },
    { day: "Вт", lessons: 1, points: 25 },
    { day: "Ср", lessons: 3, points: 75 },
    { day: "Чт", lessons: 0, points: 0 },
    { day: "Пт", lessons: 2, points: 50 },
    { day: "Сб", lessons: 1, points: 25 },
    { day: "Вс", lessons: 1, points: 30 }
  ];

  const maxLessons = Math.max(...weeklyProgress.map(d => d.lessons));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Мой прогресс</h1>
        <p className="text-gray-600">
          Отслеживайте свои достижения и прогресс в изучении Go
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Общий прогресс</CardTitle>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">{studentProgress.totalProgress}%</div>
            <Progress value={studentProgress.totalProgress} className="h-3 mb-2" />
            <p className="text-sm text-gray-600">
              {studentProgress.completedLessons} из {studentProgress.totalLessons} уроков завершено
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Модули</CardTitle>
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">{completedModules}/{totalModules}</div>
            <p className="text-sm text-gray-600">завершено</p>
            <p className="text-xs text-gray-500 mt-1">
              {inProgressModules} в процессе
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Серия</CardTitle>
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">{studentProgress.streak}</div>
            <p className="text-sm text-gray-600">дней подряд</p>
            <p className="text-xs text-gray-500 mt-1">
              Лучшая серия: 7 дней
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Очки опыта</CardTitle>
              <Star className="w-5 h-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">{studentProgress.points}</div>
            <p className="text-sm text-gray-600">XP • Уровень {studentProgress.level}</p>
            <p className="text-xs text-gray-500 mt-1">
              До уровня 2: 100 XP
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-500" />
              Активность на неделе
            </CardTitle>
            <CardDescription>
              Ваша учебная активность за последние 7 дней
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 text-sm font-medium text-gray-600">{day.day}</div>
                    <div className="flex-1 max-w-32">
                      <div className="bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(day.lessons / maxLessons) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-sm font-semibold text-gray-800">{day.lessons} уроков</div>
                    <div className="text-xs text-gray-500">{day.points} XP</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Module Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
              Прогресс по модулям
            </CardTitle>
            <CardDescription>
              Детальный прогресс по каждому модулю курса
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {courseModules.map((module) => (
                <div key={module.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-sm text-gray-800">
                      {module.title}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{module.progress}%</span>
                      {module.progress === 100 && (
                        <Trophy className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={module.progress} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {module.lessons.filter(l => l.completed).length} из {module.lessons.length} уроков
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-500" />
            Достижения
          </CardTitle>
          <CardDescription>
            Ваши награды и достижения в процессе обучения
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {studentProgress.achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`relative p-4 rounded-lg border-2 transition-all duration-300 ${
                  achievement.earned 
                    ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md' 
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-3xl ${achievement.earned ? '' : 'grayscale'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${achievement.earned ? 'text-gray-800' : 'text-gray-500'}`}>
                      {achievement.title}
                    </h3>
                    <p className={`text-sm ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    {achievement.earned && (
                      <Badge className="mt-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        Получено
                      </Badge>
                    )}
                  </div>
                </div>
                {achievement.earned && (
                  <div className="absolute top-2 right-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressPage;