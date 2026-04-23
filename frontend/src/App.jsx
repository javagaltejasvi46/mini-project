import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MainContent from './components/MainContent';
import NeuralFlowOptimizer from './components/NeuralFlowOptimizer';
import PredictiveHub from './components/PredictiveHub';
import SystemHealthNode from './components/SystemHealthNode';
import HomePage from './components/HomePage';
import LogInPage from './components/LogInPage';
import SignUpPage from './components/SignUpPage';

function App() {
  return (
    <div className="App dark">
      <BrowserRouter>
        <Routes>
          {/* Public pages — no sidebar/topnav */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LogInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* App pages — inside Layout (sidebar + topnav) */}
          <Route path="/app" element={<Layout />}>
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<MainContent />} />
            <Route path="flow-optimizer" element={<NeuralFlowOptimizer />} />
            <Route path="predictive-hub" element={<PredictiveHub />} />
            <Route path="health" element={<SystemHealthNode />} />
          </Route>

          {/* Legacy redirect — old /dashboard links still work */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/flow-optimizer" element={<Navigate to="/app/flow-optimizer" replace />} />
          <Route path="/predictive-hub" element={<Navigate to="/app/predictive-hub" replace />} />
          <Route path="/health" element={<Navigate to="/app/health" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
