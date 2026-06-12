import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SimulatorPage from './pages/SimulatorPage';
import ComparisonPage from './pages/ComparisonPage';
import BenchmarkPage from './pages/BenchmarkPage';
import EducationalPage from './pages/EducationalPage';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
        <Layout>
            <Routes>
                <Route path="/" element={<Navigate to="/simulator" />} />
                <Route path="/simulator" element={<SimulatorPage />} />
                <Route path="/comparison" element={<ComparisonPage />} />
                <Route path="/benchmark" element={<BenchmarkPage />} />
                <Route path="/educational" element={<EducationalPage />} />
            </Routes>
        </Layout>
    </BrowserRouter>
  );
}
export default App;
