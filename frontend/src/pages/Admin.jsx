import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { 
  BookOpen, 
  Users, 
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Save,
  Eye,
  BarChart3,
  Settings,
  Clock,
  TrendingUp
} from "lucide-react";
import { fullYearCourse, adminData } from "../data/fullYearCourse";
import { useToast } from "../hooks/use-toast";

const Admin = () => {
  const [courses, setCourses] = useState(fullYearCourse);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [newLesson, setNewLesson] = useState({
    title: "",
    description: "",
    type: "theory",
    duration: 60,
    content: ""
  });
  const { toast } = useToast();

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setEditingLesson(null);
  };

  const handleLessonEdit = (lesson) => {
    setEditingLesson(lesson);
  };

  const handleLessonSave = () => {
    toast({
      title: "Урок сохранен",
      description: `Урок "${editingLesson.title}" успешно обновлен`
    });
    setEditingLesson(null);
  };

  const handleAddLesson = () => {
    if (!selectedCourse) return;
    
    const lesson = {
      id: Date.now(),
      ...newLesson,
      order: selectedCourse.lessons.length + 1
    };

    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id 
        ? { ...course, lessons: [...course.lessons, lesson] }
        : course
    );

    setCourses(updatedCourses);
    setSelectedCourse({
      ...selectedCourse,
      lessons: [...selectedCourse.lessons, lesson]
    });

    setNewLesson({
      title: "",
      description: "",
      type: "theory",
      duration: 60,
      content: ""
    });

    toast({
      title: "Урок добавлен",
      description: `Урок "${lesson.title}" добавлен в курс`
    });
  };

  const handleDeleteLesson = (lessonId) => {
    if (!selectedCourse) return;

    const updatedLessons = selectedCourse.lessons.filter(l => l.id !== lessonId);
    const updatedCourse = { ...selectedCourse, lessons: updatedLessons };
    
    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id ? updatedCourse : course
    );

    setCourses(updatedCourses);
    setSelectedCourse(updatedCourse);

    toast({
      title: "Урок удален",
      description: "Урок успешно удален из курса"
    });
  };

  const getLessonTypeColor = (type) => {
    switch (type) {
      case 'theory': return 'bg-blue-100 text-blue-800';
      case 'practice': return 'bg-green-100 text-green-800';
      case 'coding': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLessonTypeLabel = (type) => {
    switch (type) {
      case 'theory': return 'Теория';
      case 'practice': return 'Практика';
      case 'coding': return 'Кодинг';
      default: return 'Урок';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Админ-панель</h1>
        <p className="text-gray-600">
          Управление курсами, уроками и контентом платформы
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Дашборд</TabsTrigger>
          <TabsTrigger value="courses">Курсы</TabsTrigger>
          <TabsTrigger value="lessons">Уроки</TabsTrigger>
          <TabsTrigger value="analytics">Аналитика</TabsTrigger>
        </TabsList>

        {/* Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Всего курсов</CardTitle>
                  <BookOpen className="w-5 h-5 text-blue-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{adminData.totalCourses}</div>
                <p className="text-sm text-gray-600">{adminData.totalLessons} уроков</p>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Студенты</CardTitle>
                  <GraduationCap className="w-5 h-5 text-green-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{adminData.totalStudents}</div>
                <p className="text-sm text-gray-600">активных пользователей</p>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Преподаватели</CardTitle>
                  <Users className="w-5 h-5 text-orange-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">{adminData.totalTeachers}</div>
                <p className="text-sm text-gray-600">преподавателей</p>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-600">Активность</CardTitle>
                  <TrendingUp className="w-5 h-5 text-purple-500" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-800">95%</div>
                <p className="text-sm text-gray-600">средняя вовлеченность</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-500" />
                Последняя активность
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{activity.title}</div>
                      <div className="text-sm text-gray-600">{activity.author}</div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('ru-RU')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Courses Management */}
        <TabsContent value="courses" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Управление курсами</h2>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Plus className="w-4 h-4 mr-2" />
              Создать курс
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Courses List */}
            <div className="lg:col-span-1 space-y-4">
              {courses.map((course) => (
                <Card 
                  key={course.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedCourse?.id === course.id 
                      ? 'border-blue-500 shadow-lg' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleCourseSelect(course)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant="secondary">{course.lessons.length} уроков</Badge>
                    </div>
                    <CardDescription className="text-sm">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{course.duration}</span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Course Details */}
            <div className="lg:col-span-2">
              {selectedCourse ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{selectedCourse.title}</span>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Редактировать
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4 mr-2" />
                          Настройки
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>{selectedCourse.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Уроки курса</h3>
                        <span className="text-sm text-gray-600">
                          {selectedCourse.lessons.length} уроков
                        </span>
                      </div>
                      
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {selectedCourse.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{lesson.title}</span>
                                <Badge 
                                  variant="secondary" 
                                  className={getLessonTypeColor(lesson.type)}
                                >
                                  {getLessonTypeLabel(lesson.type)}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {lesson.description} • {lesson.duration} мин
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleLessonEdit(lesson)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteLesson(lesson.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      Выберите курс
                    </h3>
                    <p className="text-gray-500">
                      Выберите курс из списка слева для просмотра и редактирования
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Lesson Editor */}
        <TabsContent value="lessons" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add New Lesson */}
            <Card>
              <CardHeader>
                <CardTitle>Добавить новый урок</CardTitle>
                <CardDescription>
                  {selectedCourse ? `В курс: ${selectedCourse.title}` : 'Выберите курс в разделе "Курсы"'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Название урока</label>
                  <Input
                    value={newLesson.title}
                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                    placeholder="Введите название урока"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Описание</label>
                  <Textarea
                    value={newLesson.description}
                    onChange={(e) => setNewLesson({...newLesson, description: e.target.value})}
                    placeholder="Описание урока"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Тип урока</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded-md"
                      value={newLesson.type}
                      onChange={(e) => setNewLesson({...newLesson, type: e.target.value})}
                    >
                      <option value="theory">Теория</option>
                      <option value="practice">Практика</option>
                      <option value="coding">Кодинг</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Длительность (мин)</label>
                    <Input
                      type="number"
                      value={newLesson.duration}
                      onChange={(e) => setNewLesson({...newLesson, duration: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Содержание урока</label>
                  <Textarea
                    value={newLesson.content}
                    onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                    placeholder="Markdown содержание урока"
                    className="min-h-32"
                  />
                </div>

                <Button 
                  onClick={handleAddLesson}
                  disabled={!selectedCourse || !newLesson.title}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить урок
                </Button>
              </CardContent>
            </Card>

            {/* Edit Lesson */}
            {editingLesson && (
              <Card>
                <CardHeader>
                  <CardTitle>Редактировать урок</CardTitle>
                  <CardDescription>{editingLesson.title}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Название урока</label>
                    <Input
                      value={editingLesson.title}
                      onChange={(e) => setEditingLesson({...editingLesson, title: e.target.value})}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700">Описание</label>
                    <Textarea
                      value={editingLesson.description}
                      onChange={(e) => setEditingLesson({...editingLesson, description: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Тип урока</label>
                      <select 
                        className="w-full p-2 border border-gray-300 rounded-md"
                        value={editingLesson.type}
                        onChange={(e) => setEditingLesson({...editingLesson, type: e.target.value})}
                      >
                        <option value="theory">Теория</option>
                        <option value="practice">Практика</option>
                        <option value="coding">Кодинг</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700">Длительность (мин)</label>
                      <Input
                        type="number"
                        value={editingLesson.duration}
                        onChange={(e) => setEditingLesson({...editingLesson, duration: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleLessonSave}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Сохранить
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setEditingLesson(null)}
                    >
                      Отмена
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-green-500" />
                Статистика курсов
              </CardTitle>
              <CardDescription>
                Количество студентов и процент завершения по курсам
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {adminData.courseStats.map((course, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{course.name}</span>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{course.students} студентов</span>
                        <span>{course.completion}% завершений</span>
                      </div>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${course.completion}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;