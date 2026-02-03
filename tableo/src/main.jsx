import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ import Router
import './index.css';
//page imports
import LoginPage from './layouts/LoginPage.jsx';
import RegisterPage from './layouts/RegisterPage.jsx';
import LandingPage from './layouts/LandingPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ wrap your app with BrowserRouter */}
      <Routes> 
        {/* Routes */}
        <Route path="/" element={<LandingPage />} />         
        <Route path="/auth" element={<LoginPage />} />         
        <Route path="/auth/register" element={<RegisterPage />} /> 
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
