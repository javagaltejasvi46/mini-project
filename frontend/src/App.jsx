import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import MainContent from './components/MainContent';
import NeuralFlowOptimizer from './components/NeuralFlowOptimizer';
import PredictiveHub from './components/PredictiveHub';
import SystemHealthNode from './components/SystemHealthNode';

function App() {
  return (
    <div className="App dark">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<MainContent />} />
            <Route path="flow-optimizer" element={<NeuralFlowOptimizer />} />
            <Route path="predictive-hub" element={<PredictiveHub />} />
            <Route path="health" element={<SystemHealthNode />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
