import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // ✅ import Router
import './index.css';
//page imports
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ wrap your app with BrowserRouter */}
      <Routes> 
        {/* Routes */}
        <Route path="/" element={<LoginPage />} />         
        <Route path="/register" element={<RegisterPage />} /> 
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
