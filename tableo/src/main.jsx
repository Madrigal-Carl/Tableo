import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, GuestRoute } from "./routes/RouteGuards";
import { AuthProvider } from "./context/AuthContext";
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
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
          </Route>

          {/* Authenticated-only */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<HomePage />} />
            <Route path="/judge" element={<JudgePage />} />
            <Route path="/categories" element={<CategoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>
);
