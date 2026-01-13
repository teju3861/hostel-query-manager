import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import WardenDashboard from './pages/WardenDashboard';

// A helper component to protect routes from unauthorized users
const PrivateRoute = ({ children, role }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="flex justify-center p-10">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Student Routes */}
          <Route path="/student-dashboard" element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          } />

          {/* Protected Warden/Admin Routes */}
          <Route path="/warden-dashboard" element={
            <PrivateRoute role="warden">
              <WardenDashboard />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;