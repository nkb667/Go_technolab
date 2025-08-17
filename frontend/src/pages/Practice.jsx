import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Textarea } from "../components/ui/textarea";
import { 
  Code, 
  Play, 
  CheckCircle, 
  XCircle,
  Trophy,
  Star,
  Lightbulb
} from "lucide-react";
import { codingChallenges } from "../data/mock";
import { useToast } from "../hooks/use-toast";

const Practice = () => {
  const [selectedChallenge, setSelectedChallenge] = useState(codingChallenges[0]);
  const [userCode, setUserCode] = useState(selectedChallenge?.template || "");
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");
  const [testResults, setTestResults] = useState(null);
  const { toast } = useToast();

  const handleChallengeSelect = (challenge) => {
    setSelectedChallenge(challenge);
    setUserCode(challenge.template);
    setOutput("");
    setTestResults(null);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("Компилируется и выполняется код...");
    
    // Имитация выполнения кода
    setTimeout(() => {
      const isCorrect = userCode.includes("fmt.Println") && 
                       (userCode.includes("Hello, World!") || userCode.includes("return a + b"));
      
      if (isCorrect) {
        setOutput(selectedChallenge.testCases[0].expectedOutput);
        setTestResults({ passed: true, message: "Все тесты пройдены!" });
        toast({
          title: "Отлично!",
          description: `Задача "${selectedChallenge.title}" решена правильно! +${selectedChallenge.points} XP`
        });
      } else {
        setOutput("Error: неверное решение");
        setTestResults({ passed: false, message: "Тесты не пройдены. Попробуйте еще раз." });
        toast({
          title: "Попробуйте еще раз",
          description: "Код содержит ошибки. Проверьте решение."
        });
      }
      setIsRunning(false);
    }, 2000);
  };

  const showHint = () => {
    toast({
      title: "Подсказка",
      description: "Используйте fmt.Println() для вывода текста на экран"
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return 'Легкий';
      case 'medium':
        return 'Средний';
      case 'hard':
        return 'Сложный';
      default:
        return 'Неизвестно';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Практические задания</h1>
        <p className="text-gray-600">
          Решайте задачи и применяйте знания Go на практике
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Challenges List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                Задачи
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {codingChallenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedChallenge.id === challenge.id
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                    }`}
                    onClick={() => handleChallengeSelect(challenge)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm text-gray-800">
                        {challenge.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span className="text-xs text-gray-600">{challenge.points}</span>
                      </div>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}
                    >
                      {getDifficultyLabel(challenge.difficulty)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Code Editor */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Challenge Description & Code Editor */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Code className="w-5 h-5 mr-2 text-blue-500" />
                      {selectedChallenge.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={getDifficultyColor(selectedChallenge.difficulty)}
                      >
                        {getDifficultyLabel(selectedChallenge.difficulty)}
                      </Badge>
                      <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{selectedChallenge.points} XP</span>
                      </div>
                    </div>
                  </div>
                  <CardDescription>{selectedChallenge.description}</CardDescription>
                </CardHeader>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Код</CardTitle>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={showHint}
                      >
                        <Lightbulb className="w-4 h-4 mr-1" />
                        Подсказка
                      </Button>
                      <Button
                        size="sm"
                        onClick={runCode}
                        disabled={isRunning}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        {isRunning ? "Выполняется..." : "Запустить"}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={userCode}
                    onChange={(e) => setUserCode(e.target.value)}
                    className="min-h-[300px] font-mono text-sm bg-gray-50 border-gray-300"
                    placeholder="Напишите ваш код здесь..."
                  />
                </CardContent>
              </Card>
            </div>

            {/* Output & Results */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="w-5 h-5 mr-2 text-green-500" />
                    Вывод
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm min-h-[100px]">
                    {output || "Нажмите 'Запустить' для выполнения кода"}
                  </div>
                </CardContent>
              </Card>

              {testResults && (
                <Card className={`border-2 ${testResults.passed ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {testResults.passed ? (
                        <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                      ) : (
                        <XCircle className="w-5 h-5 mr-2 text-red-600" />
                      )}
                      Результаты тестов
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={testResults.passed ? 'text-green-700' : 'text-red-700'}>
                      {testResults.message}
                    </p>
                    {testResults.passed && (
                      <div className="mt-3 p-3 bg-white rounded-lg border border-green-200">
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm font-medium text-gray-700">
                            Получено {selectedChallenge.points} XP!
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Ожидаемый результат</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-sm">
                    {selectedChallenge.testCases[0].expectedOutput}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Пример решения</CardTitle>
                  <CardDescription>Показывается после решения задачи</CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={testResults?.passed ? selectedChallenge.solution : "Решите задачу, чтобы увидеть пример"}
                    readOnly
                    className="min-h-[150px] font-mono text-sm bg-gray-50"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Practice;