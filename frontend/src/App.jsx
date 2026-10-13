import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
import SuccessStories from './pages/public/SuccessStories';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import Safety from './pages/public/Safety';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import Terms from './pages/public/Terms';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Dashboard Pages
import UserDashboard from './pages/dashboard/UserDashboard';
import BrowseMatches from './pages/dashboard/BrowseMatches';
import ProfileDetail from './pages/dashboard/ProfileDetail';
import EditProfile from './pages/dashboard/EditProfile';
import Interests from './pages/dashboard/Interests';
import SavedProfiles from './pages/dashboard/SavedProfiles';
import NotificationsPage from './pages/dashboard/NotificationsPage';
import PrivacySettings from './pages/dashboard/PrivacySettings';

// Single Unified Admin Panel
import AdminDashboard from './pages/admin/AdminDashboard';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-xs text-slate-500">Checking authentication...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AdminRoute({ children }) {
  const { loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-xs text-slate-500">Checking authorization...</div>;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-ivory-200">
            <Navbar />
            <main className="flex-1">
              <Routes>
                {/* Public Landing Page */}
                <Route path="/" element={<Home />} />

                {/* Auth Pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Pages (Must Login to Access Any Other Page) */}
                <Route path="/matches" element={<ProtectedRoute><BrowseMatches /></ProtectedRoute>} />
                <Route path="/matches/:id" element={<ProtectedRoute><ProfileDetail /></ProtectedRoute>} />
                <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
                <Route path="/how-it-works" element={<ProtectedRoute><HowItWorks /></ProtectedRoute>} />
                <Route path="/success-stories" element={<ProtectedRoute><SuccessStories /></ProtectedRoute>} />
                <Route path="/faq" element={<ProtectedRoute><FAQ /></ProtectedRoute>} />
                <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
                <Route path="/safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />
                <Route path="/privacy" element={<ProtectedRoute><PrivacyPolicy /></ProtectedRoute>} />
                <Route path="/terms" element={<ProtectedRoute><Terms /></ProtectedRoute>} />

                {/* Member Dashboard */}
                <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                <Route path="/dashboard/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
                <Route path="/dashboard/interests" element={<ProtectedRoute><Interests /></ProtectedRoute>} />
                <Route path="/dashboard/saved" element={<ProtectedRoute><SavedProfiles /></ProtectedRoute>} />
                <Route path="/dashboard/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                <Route path="/dashboard/privacy" element={<ProtectedRoute><PrivacySettings /></ProtectedRoute>} />

                {/* Unified All-in-One Admin Control Panel */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/admin/*" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                {/* 404 Catch-all */}
                <Route path="*" element={
                  <div className="max-w-md mx-auto py-24 text-center space-y-4">
                    <h2 className="font-serif text-3xl font-bold text-navy-950">Page Not Found</h2>
                    <p className="text-xs text-slate-500">The page you are looking for does not exist or has moved.</p>
                    <a href="/" className="inline-block px-6 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-semibold">
                      Return to Home
                    </a>
                  </div>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}
