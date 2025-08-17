import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { 
  Users, 
  UserCheck, 
  Trophy, 
  Calendar,
  BookOpen,
  TrendingUp,
  Clock,
  Star,
  Award,
  Target
} from "lucide-react";
import { classroomData } from "../data/mock";

const Classroom = () => {
  const [selectedStudent, setSelectedStudent] = useState(null);

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    if (progress >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getLastActiveStatus = (date) => {
    const today = new Date();
    const lastActive = new Date(date);
    const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return { text: 'Сегодня', color: 'text-green-600' };
    if (diffDays === 1) return { text: 'Вчера', color: 'text-yellow-600' };
    if (diffDays <= 3) return { text: `${diffDays} дня назад`, color: 'text-orange-600' };
    return { text: `${diffDays} дней назад`, color: 'text-red-600' };
  };

  const classStats = {
    averageProgress: Math.round(classroomData.students.reduce((acc, student) => acc + student.progress, 0) / classroomData.students.length),
    activeToday: classroomData.students.filter(s => getLastActiveStatus(s.lastActive).text === 'Сегодня').length,
    totalTasks: classroomData.students[0]?.totalTasks || 12,
    completedTasks: Math.round(classroomData.students.reduce((acc, student) => acc + student.completedTasks, 0) / classroomData.students.length)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{classroomData.className}</h1>
            <p className="text-gray-600">
              Преподаватель: {classroomData.teacherName} • {classroomData.students.length} учеников
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Активный класс
            </Badge>
          </div>
        </div>
      </div>

      {/* Class Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Средний прогресс</CardTitle>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">{classStats.averageProgress}%</div>
            <Progress value={classStats.averageProgress} className="h-3" />
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Активны сегодня</CardTitle>
              <UserCheck className="w-5 h-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">{classStats.activeToday}</div>
            <p className="text-sm text-gray-600">из {classroomData.students.length} учеников</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Задач выполнено</CardTitle>
              <BookOpen className="w-5 h-5 text-yellow-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">{classStats.completedTasks}</div>
            <p className="text-sm text-gray-600">в среднем из {classStats.totalTasks}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Всего учеников</CardTitle>
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800 mb-2">{classroomData.students.length}</div>
            <p className="text-sm text-gray-600">в классе</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Students List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-500" />
                Ученики класса
              </CardTitle>
              <CardDescription>
                Нажмите на ученика, чтобы посмотреть детальную информацию
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {classroomData.students.map((student) => {
                  const lastActiveStatus = getLastActiveStatus(student.lastActive);
                  
                  return (
                    <div
                      key={student.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ${
                        selectedStudent?.id === student.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                              {getInitials(student.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-gray-800">{student.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                <span className={lastActiveStatus.color}>
                                  {lastActiveStatus.text}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <BookOpen className="w-3 h-3 mr-1" />
                                <span>{student.completedTasks}/{student.totalTasks} задач</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getProgressColor(student.progress)}`}>
                            {student.progress}%
                          </div>
                          <Progress value={student.progress} className="w-20 h-2 mt-1" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Details */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {selectedStudent ? (
              <Card className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                        {getInitials(selectedStudent.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{selectedStudent.name}</CardTitle>
                      <CardDescription>Детальная информация</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Progress Overview */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Общий прогресс</span>
                        <span className={`text-lg font-bold ${getProgressColor(selectedStudent.progress)}`}>
                          {selectedStudent.progress}%
                        </span>
                      </div>
                      <Progress value={selectedStudent.progress} className="h-3" />
                    </div>

                    {/* Task Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Выполнено задач</span>
                        <span className="text-sm font-semibold text-gray-800">
                          {selectedStudent.completedTasks}/{selectedStudent.totalTasks}
                        </span>
                      </div>
                      <Progress 
                        value={(selectedStudent.completedTasks / selectedStudent.totalTasks) * 100} 
                        className="h-2" 
                      />
                    </div>

                    {/* Last Activity */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Последняя активность</span>
                        <span className={`text-sm font-semibold ${getLastActiveStatus(selectedStudent.lastActive).color}`}>
                          {getLastActiveStatus(selectedStudent.lastActive).text}
                        </span>
                      </div>
                    </div>

                    {/* Performance Indicators */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Показатели</h4>
                      
                      <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">Прогресс</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {selectedStudent.progress >= 50 ? 'Хорошо' : 'Нужна помощь'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-gray-700">Регулярность</span>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {getLastActiveStatus(selectedStudent.lastActive).text === 'Сегодня' || 
                           getLastActiveStatus(selectedStudent.lastActive).text === 'Вчера' 
                            ? 'Активен' : 'Неактивен'}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-gray-700">Выполнение</span>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          {Math.round((selectedStudent.completedTasks / selectedStudent.totalTasks) * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                      Отправить сообщение
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-200">
                <CardContent className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Выберите ученика
                  </h3>
                  <p className="text-gray-500">
                    Нажмите на ученика слева, чтобы увидеть детальную информацию о его прогрессе
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Classroom;