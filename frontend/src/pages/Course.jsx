import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { 
  BookOpen, 
  Code, 
  Play, 
  CheckCircle, 
  Lock,
  Clock,
  Star
} from "lucide-react";
import { courseModules } from "../data/mock";
import { useToast } from "../hooks/use-toast";

const Course = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const { toast } = useToast();

  const handleLessonClick = (lesson, moduleId) => {
    if (lesson.completed) {
      toast({
        title: "Урок завершен!",
        description: `Вы уже завершили урок "${lesson.title}"`
      });
    } else {
      toast({
        title: "Урок начат",
        description: `Начинаем урок "${lesson.title}"`
      });
      // В реальном приложении здесь будет навигация к уроку
    }
  };

  const getLessonIcon = (type) => {
    switch (type) {
      case 'theory':
        return <BookOpen className="w-4 h-4" />;
      case 'practice':
        return <Play className="w-4 h-4" />;
      case 'coding':
        return <Code className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLessonTypeLabel = (type) => {
    switch (type) {
      case 'theory':
        return 'Теория';
      case 'practice':
        return 'Практика';
      case 'coding':
        return 'Кодинг';
      default:
        return 'Урок';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'theory':
        return 'bg-blue-100 text-blue-800';
      case 'practice':
        return 'bg-green-100 text-green-800';
      case 'coding':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Курс Go для начинающих</h1>
        <p className="text-gray-600">
          Изучите основы программирования на Go от простых концепций до создания проектов
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Modules List */}
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {courseModules.map((module) => (
              <Card 
                key={module.id} 
                className={`transition-all duration-300 hover:shadow-lg cursor-pointer border-2 ${
                  selectedModule?.id === module.id 
                    ? 'border-blue-500 shadow-lg' 
                    : module.unlocked 
                      ? 'border-gray-200 hover:border-blue-300' 
                      : 'border-gray-100 opacity-60'
                }`}
                onClick={() => module.unlocked && setSelectedModule(module)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        module.unlocked 
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500' 
                          : 'bg-gray-400'
                      }`}>
                        {module.unlocked ? (
                          <BookOpen className="w-5 h-5 text-white" />
                        ) : (
                          <Lock className="w-5 h-5 text-white" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{module.title}</CardTitle>
                        <CardDescription>{module.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">
                        {module.progress}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {module.lessons.length} уроков
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={module.progress} className="mb-4" />
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      {module.lessons.slice(0, 3).map((lesson, index) => (
                        <div
                          key={lesson.id}
                          className={`w-3 h-3 rounded-full ${
                            lesson.completed 
                              ? 'bg-green-500' 
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                      {module.lessons.length > 3 && (
                        <div className="text-xs text-gray-500 flex items-center">
                          +{module.lessons.length - 3}
                        </div>
                      )}
                    </div>
                    {!module.unlocked && (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Заблокирован
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Module Details */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            {selectedModule ? (
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                    {selectedModule.title}
                  </CardTitle>
                  <CardDescription>{selectedModule.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600">Прогресс</span>
                        <span className="text-sm font-medium text-blue-600">
                          {selectedModule.progress}%
                        </span>
                      </div>
                      <Progress value={selectedModule.progress} />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-800">Уроки</h4>
                      {selectedModule.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          onClick={() => handleLessonClick(lesson, selectedModule.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-1.5 rounded ${
                              lesson.completed 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-300 text-gray-600'
                            }`}>
                              {lesson.completed ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                getLessonIcon(lesson.type)
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">
                                {lesson.title}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{lesson.duration}</span>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getTypeColor(lesson.type)}`}
                                >
                                  {getLessonTypeLabel(lesson.type)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      onClick={() => {
                        const nextLesson = selectedModule.lessons.find(l => !l.completed);
                        if (nextLesson) {
                          handleLessonClick(nextLesson, selectedModule.id);
                        }
                      }}
                    >
                      {selectedModule.lessons.every(l => l.completed) 
                        ? 'Модуль завершен' 
                        : 'Продолжить обучение'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-gray-200">
                <CardContent className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Выберите модуль
                  </h3>
                  <p className="text-gray-500">
                    Нажмите на модуль слева, чтобы увидеть детали и уроки
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

export default Course;