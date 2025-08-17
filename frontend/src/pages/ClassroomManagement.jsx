import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { 
  Users, 
  Plus, 
  Copy,
  Settings,
  UserPlus,
  BookOpen,
  Calendar,
  Clock,
  Target,
  Mail
} from "lucide-react";
import { classroomTemplates, fullYearCourse } from "../data/fullYearCourse";
import { useToast } from "../hooks/use-toast";

const ClassroomManagement = () => {
  const [classrooms, setClassrooms] = useState([
    {
      id: 1,
      name: "Go разработчики 2024",
      description: "Основная группа для изучения Go",
      students: 15,
      maxStudents: 20,
      inviteCode: "GO2024ABC",
      createdAt: "2024-01-10",
      status: "active",
      courses: [1, 2, 3]
    },
    {
      id: 2,
      name: "Продвинутая группа Go",
      description: "Для студентов с опытом программирования",
      students: 8,
      maxStudents: 12,
      inviteCode: "ADVGO2024",
      createdAt: "2024-01-15",
      status: "active",
      courses: [4, 5, 6]
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newClassroom, setNewClassroom] = useState({
    name: "",
    description: "",
    maxStudents: 15,
    selectedCourses: []
  });

  const { toast } = useToast();

  const generateInviteCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateClassroom = () => {
    const classroom = {
      id: Date.now(),
      ...newClassroom,
      students: 0,
      inviteCode: generateInviteCode(),
      createdAt: new Date().toISOString().split('T')[0],
      status: "active",
      courses: newClassroom.selectedCourses
    };

    setClassrooms([...classrooms, classroom]);
    setNewClassroom({
      name: "",
      description: "",
      maxStudents: 15,
      selectedCourses: []
    });
    setShowCreateForm(false);
    setSelectedTemplate(null);

    toast({
      title: "Класс создан!",
      description: `Класс "${classroom.name}" успешно создан. Код приглашения: ${classroom.inviteCode}`
    });
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setNewClassroom({
      name: template.name,
      description: template.description,
      maxStudents: template.maxStudents,
      selectedCourses: template.suggestedCourses
    });
  };

  const handleCopyInviteCode = (code) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Код скопирован!",
      description: `Код приглашения ${code} скопирован в буфер обмена`
    });
  };

  const handleCourseToggle = (courseId) => {
    const isSelected = newClassroom.selectedCourses.includes(courseId);
    const updatedCourses = isSelected
      ? newClassroom.selectedCourses.filter(id => id !== courseId)
      : [...newClassroom.selectedCourses, courseId];
    
    setNewClassroom({
      ...newClassroom,
      selectedCourses: updatedCourses
    });
  };

  const getCourseName = (courseId) => {
    const course = fullYearCourse.find(c => c.id === courseId);
    return course ? course.title : `Курс ${courseId}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Управление классами</h1>
            <p className="text-gray-600">
              Создавайте и управляйте учебными группами
            </p>
          </div>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать класс
          </Button>
        </div>
      </div>

      {/* Create Classroom Form */}
      {showCreateForm && (
        <Card className="mb-8 border-blue-200">
          <CardHeader>
            <CardTitle>Создание нового класса</CardTitle>
            <CardDescription>
              Выберите шаблон или создайте класс с нуля
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Templates */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Шаблоны классов</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {classroomTemplates.map((template) => (
                  <Card 
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTemplate?.id === template.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {template.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-2" />
                          {template.duration}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-3 h-3 mr-2" />
                          До {template.maxStudents} студентов
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="w-3 h-3 mr-2" />
                          {template.suggestedCourses.length} курсов
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Custom Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Название класса</label>
                  <Input
                    value={newClassroom.name}
                    onChange={(e) => setNewClassroom({...newClassroom, name: e.target.value})}
                    placeholder="Введите название класса"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Описание</label>
                  <Textarea
                    value={newClassroom.description}
                    onChange={(e) => setNewClassroom({...newClassroom, description: e.target.value})}
                    placeholder="Описание класса"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Максимум студентов</label>
                  <Input
                    type="number"
                    value={newClassroom.maxStudents}
                    onChange={(e) => setNewClassroom({...newClassroom, maxStudents: parseInt(e.target.value)})}
                    min="1"
                    max="50"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-3 block">Выберите курсы</label>
                <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-3">
                  {fullYearCourse.map((course) => (
                    <div key={course.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`course-${course.id}`}
                        checked={newClassroom.selectedCourses.includes(course.id)}
                        onChange={() => handleCourseToggle(course.id)}
                        className="rounded border-gray-300"
                      />
                      <label 
                        htmlFor={`course-${course.id}`}
                        className="flex-1 text-sm cursor-pointer"
                      >
                        <div className="font-medium">{course.title}</div>
                        <div className="text-gray-500 text-xs">{course.duration} • {course.lessons.length} уроков</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                onClick={handleCreateClassroom}
                disabled={!newClassroom.name || newClassroom.selectedCourses.length === 0}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Создать класс
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setShowCreateForm(false);
                  setSelectedTemplate(null);
                  setNewClassroom({
                    name: "",
                    description: "",
                    maxStudents: 15,
                    selectedCourses: []
                  });
                }}
              >
                Отмена
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Classrooms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {classrooms.map((classroom) => (
          <Card key={classroom.id} className="border-gray-200 hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-blue-500" />
                    {classroom.name}
                  </CardTitle>
                  <CardDescription>{classroom.description}</CardDescription>
                </div>
                <Badge 
                  variant="secondary" 
                  className={classroom.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                >
                  {classroom.status === 'active' ? 'Активный' : 'Неактивный'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-800">{classroom.students}</div>
                  <div className="text-sm text-gray-600">студентов</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{classroom.maxStudents}</div>
                  <div className="text-sm text-gray-600">максимум</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{classroom.courses.length}</div>
                  <div className="text-sm text-gray-600">курсов</div>
                </div>
              </div>

              {/* Invite Code */}
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Код приглашения</div>
                    <div className="text-lg font-mono font-bold text-blue-600">{classroom.inviteCode}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopyInviteCode(classroom.inviteCode)}
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    Копировать
                  </Button>
                </div>
              </div>

              {/* Courses */}
              <div>
                <div className="text-sm font-medium text-gray-700 mb-2">Назначенные курсы</div>
                <div className="flex flex-wrap gap-2">
                  {classroom.courses.map((courseId) => (
                    <Badge key={courseId} variant="secondary" className="bg-blue-100 text-blue-800">
                      {getCourseName(courseId)}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="w-3 h-3 mr-1" />
                  Управление
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <UserPlus className="w-3 h-3 mr-1" />
                  Пригласить
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Target className="w-3 h-3 mr-1" />
                  Прогресс
                </Button>
              </div>

              {/* Created Date */}
              <div className="text-xs text-gray-500 text-center border-t border-gray-200 pt-3">
                Создан {new Date(classroom.createdAt).toLocaleDateString('ru-RU')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {classrooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Нет созданных классов
            </h3>
            <p className="text-gray-500 mb-4">
              Создайте первый класс для управления группами студентов
            </p>
            <Button 
              onClick={() => setShowCreateForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать класс
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClassroomManagement;