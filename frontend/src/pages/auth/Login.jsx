import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Church, Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function Login() {
  const { login } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(email, password);
      if (res.success) {
        if (res.user.role === 'ADMIN' || res.user.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMsg(res.message || 'Login failed. Please verify credentials.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await login(demoEmail, 'Password@123');
      if (res.success) {
        if (res.user.role === 'ADMIN' || res.user.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setErrorMsg('Demo login failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-card max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-navy-900 text-gold-500 flex items-center justify-center mx-auto shadow-soft mb-3">
            <Church size={26} />
          </div>
          <h1 className="font-serif text-2xl font-bold text-navy-950">Member & Admin Login</h1>
          <p className="text-xs text-slate-500">
            {settings.site_name || 'Open Door Matrimony'} • {settings.church_name || 'The Open Door Church'}
          </p>
        </div>

        {redirectMessage && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center gap-2">
            <Info size={16} className="text-amber-600 shrink-0" />
            <span>{redirectMessage}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Registered Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">Password</label>
              <span className="text-[11px] text-gold-600 font-medium">Default: Password@123</span>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs shadow-soft transition-colors flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Account'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* 1-Click Demo Logins for Fast Review */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">
            Quick 1-Click Test Logins
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('ankitguraya@gmail.com')}
              className="py-2.5 px-3 bg-navy-900 hover:bg-navy-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Login as Kamal</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('muskan@gmail.com')}
              className="py-2.5 px-3 bg-gold-500 hover:bg-gold-600 text-navy-950 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <span>Login as Muskan</span>
            </button>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@opendoormatrimony.org')}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-medium text-slate-700"
            >
              Church Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('joshua.masih@example.com')}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-medium text-slate-700"
            >
              Joshua (Groom)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('grace.matthew@example.com')}
              className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[10px] font-medium text-slate-700"
            >
              Grace (Bride)
            </button>
          </div>
        </div>

        {/* Register Prompt */}
        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have a profile yet?{' '}
            <Link to="/register" className="font-bold text-navy-900 hover:text-gold-600 underline">
              Register Free Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
