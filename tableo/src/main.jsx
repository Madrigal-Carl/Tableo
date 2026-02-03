import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

//page imports
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import HomePage from './layouts/HomePage.jsx';
import LandingPage from './layouts/LandingPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes> 
        {/* Routes */}
        <Route path="/" element={<LandingPage />} />         
        <Route path="/auth" element={<LoginPage />} />         
        <Route path="/auth/register" element={<RegisterPage />} /> 
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
