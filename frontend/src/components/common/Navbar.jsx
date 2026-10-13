import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Church, Bell, User, Heart, Bookmark, LogOut, ShieldCheck, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function Navbar() {
  const { isAuthenticated, user, profile, isAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/notifications')
        .then(res => {
          if (res.data && res.data.success) {
            setUnreadCount(res.data.unread_count || 0);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Church Info */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-navy-900 flex items-center justify-center text-gold-500 shadow-xs group-hover:scale-105 transition-transform duration-200">
              <Church size={22} className="text-gold-500" />
            </div>
            <div>
              <span className="block font-serif text-lg font-bold tracking-tight text-navy-900 leading-tight">
                {settings.site_name || 'Open Door Matrimony'}
              </span>
              <span className="block text-[10px] text-slate-500 font-medium tracking-wide uppercase">
                {settings.church_name || 'The Open Door Church, Khojewala'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                isActive('/') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/matches"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/matches') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  Browse Matches
                </Link>
                <Link
                  to="/how-it-works"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/how-it-works') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  How It Works
                </Link>
                <Link
                  to="/success-stories"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/success-stories') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  Success Stories
                </Link>
                <Link
                  to="/about"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/about') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  About
                </Link>
                <Link
                  to="/contact"
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive('/contact') ? 'text-navy-900 bg-navy-50 font-semibold' : 'text-slate-600 hover:text-navy-900 hover:bg-slate-50'
                  }`}
                >
                  Contact
                </Link>
              </>
            )}
          </nav>

          {/* Right Action Icons & Profile / Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                <Link
                  to="/dashboard/notifications"
                  className="relative p-2.5 rounded-full text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors"
                  title="Notifications"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                      {unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    <img
                      src={profile?.profile_photo || (profile?.gender === 'MALE' ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80')}
                      alt={profile?.first_name || 'User'}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = profile?.gender === 'MALE' ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80' : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
                      }}
                      className="w-8 h-8 rounded-full object-cover border border-gold-400"
                    />
                    <span className="text-xs font-semibold text-navy-900 max-w-[100px] truncate">
                      {profile?.first_name || user?.email?.split('@')[0]}
                    </span>
                    <ChevronDown size={14} className="text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-navy-900">{profile?.first_name} {profile?.last_name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gold-700 hover:bg-gold-50 transition-colors"
                        >
                          <ShieldCheck size={16} className="text-gold-600" />
                          <span>Admin Control Center</span>
                        </Link>
                      )}

                      <Link
                        to="/dashboard"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User size={16} className="text-slate-400" />
                        <span>Member Dashboard</span>
                      </Link>
                      <Link
                        to="/dashboard/edit-profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-navy-900 hover:bg-gold-50 transition-colors"
                      >
                        <User size={16} className="text-gold-600" />
                        <span>Edit Profile & Photos</span>
                      </Link>
                      <Link
                        to="/dashboard/interests"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Heart size={16} className="text-slate-400" />
                        <span>Interests & Introductions</span>
                      </Link>
                      <Link
                        to="/dashboard/saved"
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Bookmark size={16} className="text-slate-400" />
                        <span>Saved Bookmarks</span>
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors font-medium text-left"
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-navy-900 hover:text-gold-600 transition-colors"
                >
                  Member Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-navy-900 hover:bg-navy-800 text-white shadow-soft transition-all duration-200"
                >
                  Register Profile
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <Link
                to="/dashboard/notifications"
                className="relative p-2 text-slate-600"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-rose-600 rounded-full" />
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <Link to="/" className="block py-2 text-sm font-medium text-slate-800">Home</Link>

          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <Link to="/matches" className="block py-2 text-sm font-medium text-slate-800">Browse Matches</Link>
              <Link to="/how-it-works" className="block py-2 text-sm font-medium text-slate-800">How It Works</Link>
              <Link to="/success-stories" className="block py-2 text-sm font-medium text-slate-800">Success Stories</Link>
              <Link to="/about" className="block py-2 text-sm font-medium text-slate-800">About Us</Link>
              <Link to="/contact" className="block py-2 text-sm font-medium text-slate-800">Contact</Link>
              <div className="pt-2 border-t border-slate-100 space-y-2">
                <Link to="/dashboard" className="block py-2 text-sm font-semibold text-navy-900">Dashboard</Link>
                <Link to="/dashboard/edit-profile" className="block py-2 text-sm font-semibold text-navy-900 hover:text-gold-600">Edit Profile & Photos</Link>
                <Link to="/dashboard/interests" className="block py-2 text-sm text-slate-700">Interests & Matches</Link>
                <Link to="/dashboard/saved" className="block py-2 text-sm text-slate-700">Saved Profiles</Link>
                {isAdmin && (
                  <Link to="/admin" className="block py-2 text-sm font-semibold text-gold-600">Admin Control Center</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left py-2 text-sm font-medium text-rose-600 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="text-center py-2.5 rounded-xl border border-navy-900 text-sm font-semibold text-navy-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-center py-2.5 rounded-xl bg-navy-900 text-sm font-semibold text-white"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
