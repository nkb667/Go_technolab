import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Practice from "./pages/Practice";
import Progress from "./pages/Progress";
import Classroom from "./pages/Classroom";
import Admin from "./pages/Admin";
import ClassroomManagement from "./pages/ClassroomManagement";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/course" element={<Course />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/classroom" element={<Classroom />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/classroom-management" element={<ClassroomManagement />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;