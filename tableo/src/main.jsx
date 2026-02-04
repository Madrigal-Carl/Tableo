import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

//page imports
import LoginPage from './layouts/LoginPage.jsx';
import RegisterPage from './layouts/RegisterPage.jsx';
import HomePage from './pages/event_admin/HomePage.jsx';
import LandingPage from './layouts/LandingPage.jsx';
import JudgePage from './pages/judge/JudgePage.jsx';
import CategoryPage from './pages/event_admin/CategoryPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/judge" element={<JudgePage />} />
        <Route path="/categories" element={<CategoryPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
