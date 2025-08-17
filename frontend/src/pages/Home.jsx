import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { 
  BookOpen, 
  Code, 
  Trophy, 
  Target, 
  Clock,
  Star,
  Zap,
  Users
} from "lucide-react";
import { studentProgress, courseModules } from "../data/mock";

const Home = () => {
  const currentModule = courseModules.find(module => 
    module.lessons.some(lesson => !lesson.completed)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
          Изучай <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Go</span> весело!
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Интерактивный курс для подростков по изучению языка программирования Go. 
          От основ до создания собственных проектов за учебный год.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/course">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200">
              <BookOpen className="w-5 h-5 mr-2" />
              Продолжить обучение
            </Button>
          </Link>
          <Link to="/practice">
            <Button variant="outline" size="lg" className="border-blue-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
              <Code className="w-5 h-5 mr-2" />
              Решать задачи
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Общий прогресс</CardTitle>
              <Target className="w-4 h-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800 mb-2">{studentProgress.totalProgress}%</div>
            <Progress value={studentProgress.totalProgress} className="h-2" />
          </CardContent>
        </Card>

        <Card className="border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Завершено уроков</CardTitle>
              <BookOpen className="w-4 h-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{studentProgress.completedLessons}/{studentProgress.totalLessons}</div>
            <p className="text-sm text-gray-500">из {studentProgress.totalLessons} уроков</p>
          </CardContent>
        </Card>

        <Card className="border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Серия</CardTitle>
              <Zap className="w-4 h-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{studentProgress.streak} дня</div>
            <p className="text-sm text-gray-500">подряд</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Очки</CardTitle>
              <Star className="w-4 h-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-800">{studentProgress.points} XP</div>
            <p className="text-sm text-gray-500">уровень {studentProgress.level}</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Module */}
      {currentModule && (
        <Card className="mb-12 border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-800">Текущий модуль</CardTitle>
                <CardDescription className="text-gray-600">{currentModule.title}</CardDescription>
              </div>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                В прогрессе
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">{currentModule.description}</p>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-1" />
                  {currentModule.lessons.length} уроков
                </div>
              </div>
              <div className="text-sm font-medium text-indigo-600">
                {currentModule.progress}% завершено
              </div>
            </div>
            <Progress value={currentModule.progress} className="mb-4" />
            <Link to="/course">
              <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700">
                Продолжить урок
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="text-center border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <Code className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Интерактивная практика</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Решайте задачи прямо в браузере с мгновенной проверкой кода и подсказками.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-green-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Достижения</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Получайте награды за прогресс, поддерживайте мотивацию к обучению каждый день.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <CardTitle>Групповое обучение</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Учитесь в группе с одноклассниками под руководством преподавателя.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
            Последние достижения
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentProgress.achievements
              .filter(achievement => achievement.earned)
              .slice(0, 3)
              .map((achievement) => (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-800">{achievement.title}</div>
                    <div className="text-sm text-gray-600">{achievement.description}</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;