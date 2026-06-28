import { useState, useCallback } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LandingPage from './components/Landing';
import AuthPage from "./components/Auth/AuthPage/index.jsx";
import SetupAdminPage from './components/Auth/SetupAdminPage.jsx';
import DashboardPage from './DashboardPage.jsx';
import DocsPage from './components/Docs/DocsPage.jsx';
import './index.css';

function App() {
  const navigate = useNavigate();

  // Initialize user from localStorage to persist "Guest" or "Demo" sessions
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('orionops_user');
    return saved ? JSON.parse(saved) : null;
  });

  const navigateToAuth = useCallback(() => {
    navigate('/auth');
  }, [navigate]);

  const navigateToLogin = useCallback(() => {
    navigate('/auth', { state: { view: 'login' } });
  }, [navigate]);

  const navigateToHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const navigateToDashboard = useCallback((userData) => {
    if (userData) {
      setUser(userData);
      localStorage.setItem('orionops_user', JSON.stringify(userData));
    }
    navigate('/dashboard');
  }, [navigate]);

  const handleLiveDemo = useCallback(() => {
    navigateToDashboard({
      username: "Guest_Operator",
      role: "GUEST",
      isDemo: true
    });
  }, [navigateToDashboard]);

  const handleLogout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('orionops_user');
    navigate('/');
  }, [navigate]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            user={user}
            onSignIn={navigateToAuth}
            onLogin={navigateToLogin}
            onLiveDemo={handleLiveDemo}
            onGoToDashboard={() => navigate('/dashboard')}
          />
        }
      />
      <Route
        path="/auth"
        element={
          <AuthPage
            onBack={navigateToHome}
            onAuthSuccess={navigateToDashboard}
          />
        }
      />
      <Route
        path="/setup-admin"
        element={<SetupAdminPage />}
      />
      <Route
        path="/dashboard"
        element={
          <DashboardPage
            user={user}
            onRequireAuth={navigateToAuth}
            onNavigateHome={navigateToHome}
            onLogout={handleLogout}
          />
        }
      />
      <Route path="/docs" element={<DocsPage />} />
      {/* Catch-all: redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
