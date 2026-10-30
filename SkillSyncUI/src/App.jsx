import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

import { LandingPage } from './pages/Landing/LandingPage';
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { ResumeAnalyzerPage } from './pages/Resume/ResumeAnalyzerPage';
import { SkillGapPage } from './pages/Skills/SkillGapPage';
import { RoadmapPage } from './pages/Roadmap/RoadmapPage';
import { JobDiscoveryPage } from './pages/Jobs/JobDiscoveryPage';

import './styles/global.css';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Grain texture overlay */}
        <div className="grain" aria-hidden="true" />

        <div className="skillbridge-app-layout">
          <Navbar />

          <main className="skillbridge-main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/resume" element={<ResumeAnalyzerPage />} />
              <Route path="/jobs" element={<JobDiscoveryPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/skills"
                element={
                  <ProtectedRoute>
                    <SkillGapPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/roadmap"
                element={
                  <ProtectedRoute>
                    <RoadmapPage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}
