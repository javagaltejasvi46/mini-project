import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import MainContent from './components/MainContent';
import NeuralFlowOptimizer from './components/NeuralFlowOptimizer';
import PredictiveHub from './components/PredictiveHub';
import SystemHealthNode from './components/SystemHealthNode';
import HomePage from './components/HomePage';
import LogInPage from './components/LogInPage';
import SignUpPage from './components/SignUpPage';

// Redirects to /login if not authenticated, shows a spinner while resolving
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }
  return token ? children : <Navigate to="/login" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LogInPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Protected app pages */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<MainContent />} />
        <Route path="flow-optimizer" element={<NeuralFlowOptimizer />} />
        <Route path="predictive-hub" element={<PredictiveHub />} />
        <Route path="health" element={<SystemHealthNode />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/dashboard"      element={<Navigate to="/app/dashboard"      replace />} />
      <Route path="/flow-optimizer" element={<Navigate to="/app/flow-optimizer" replace />} />
      <Route path="/predictive-hub" element={<Navigate to="/app/predictive-hub" replace />} />
      <Route path="/health"         element={<Navigate to="/app/health"         replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="App dark">
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
