import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Page components
import { HomePage } from './pages/HomePage';
import { FormPage } from './pages/FormPage';
import { HistoryPage } from './pages/HistoryPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/form" element={<FormPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;