import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { socket } from './services/api';

// Import components
import TeacherDashboard from './pages/TeacherDashboard';
import LivePolling from './pages/LivePolling';
import PBLWorkspace from './pages/PBLWorkspace';
import SoftSkillsRubric from './pages/SoftSkillsRubric';
import TemplateLibrary from './pages/TemplateLibrary';
import StartPage from './pages/StartPage';
import StudentDashboard from './pages/StudentDashboard';

function MainLayout({ isConnected }) {
  const location = useLocation();
  const isStartPage = location.pathname === '/';

  return (
    <>
      {/* Navigation - Hidden on StartPage */}
      {!isStartPage && (
        <nav className="navbar">
          <h2>AMEP Platform</h2>

          <ul className="nav-links">
            <li><Link to="/teacher">Dashboard</Link></li>
            <li><Link to="/polling">Live Polling</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/soft-skills">Soft Skills</Link></li>
            <li><Link to="/templates">Templates</Link></li>
          </ul>

          <span className="connection-status">
            {isConnected ? '● Connected' : '○ Disconnected'}
          </span>
        </nav>
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/polling" element={<LivePolling />} />
        <Route path="/projects" element={<PBLWorkspace />} />
        <Route path="/soft-skills" element={<SoftSkillsRubric />} />
        <Route path="/templates" element={<TemplateLibrary />} />
      </Routes>
    </>
  );
}

function App() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      console.log('Connected to AMEP server');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Router>
      <MainLayout isConnected={isConnected} />
    </Router>
  );
}

export default App;
