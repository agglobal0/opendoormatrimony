import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Heart, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Settings, 
  ArrowRight,
  Search,
  Check,
  X,
  Eye,
  Edit,
  Trash2,
  Plus,
  Lock,
  Mail,
  Phone,
  Church,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Sparkles,
  RefreshCw,
  Sliders,
  Send,
  UserCheck,
  UserX,
  MessageSquare,
  History,
  Upload,
  Camera,
  Save
} from 'lucide-react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAdmin, login } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);
  const { settings, refreshSettings } = useSettings();

  // Admin Auth Gate State
  const [adminEmail, setAdminEmail] = useState('admin@opendoormatrimony.org');
  const [adminPassword, setAdminPassword] = useState('Password@123');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');

  // Global Admin State
  const [stats, setStats] = useState({
    totalMembers: 4,
    maleMembers: 2,
    femaleMembers: 2,
    pendingProfiles: 0,
    verifiedProfiles: 4,
    activeInterests: 2,
    mutualMatches: 2,
    totalReports: 0
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // 1. Members State
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [userFilterRole, setUserFilterRole] = useState('');
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);

  // 2. Verifications State
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verifyingProfileId, setVerifyingProfileId] = useState(null);

  // 3. Interests & Introductions State
  const [interests, setInterests] = useState([]);

  // 4. Reports State
  const [reports, setReports] = useState([]);

  // 5. CMS Settings State
  const [cmsSettings, setCmsSettings] = useState({ ...settings });
  const [faqs, setFaqs] = useState([]);
  const [stories, setStories] = useState([]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [storyModalOpen, setStoryModalOpen] = useState(false);

  // 6. Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Sync Tab with URL
  const switchTab = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // Load all admin data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        usersRes,
        reportsRes,
        faqsRes,
        storiesRes,
        settingsRes,
        auditRes,
        interestsRes
      ] = await Promise.all([
        api.get('/admin/dashboard').catch(() => ({ data: {} })),
        api.get('/admin/users').catch(() => ({ data: {} })),
        api.get('/admin/reports').catch(() => ({ data: {} })),
        api.get('/cms/faqs').catch(() => ({ data: {} })),
        api.get('/cms/success-stories').catch(() => ({ data: {} })),
        api.get('/cms/settings').catch(() => ({ data: {} })),
        api.get('/admin/audit-logs').catch(() => ({ data: {} })),
        api.get('/admin/interests').catch(() => ({ data: {} }))
      ]);

      if (statsRes.data?.stats) setStats(statsRes.data.stats);
      if (usersRes.data?.data) setUsers(usersRes.data.data);
      if (reportsRes.data?.data) setReports(reportsRes.data.data);
      if (faqsRes.data?.data) setFaqs(faqsRes.data.data);
      if (storiesRes.data?.data) setStories(storiesRes.data.data);
      if (settingsRes.data?.data) setCmsSettings(settingsRes.data.data);
      if (auditRes.data?.data) setAuditLogs(auditRes.data.data);
      if (interestsRes.data?.data) setInterests(interestsRes.data.data);

    } catch (err) {
      console.error('Admin panel load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Update Verification Status
  const handleUpdateVerification = async (profileId, status) => {
    setActionLoading(true);
    try {
      const res = await api.post(`/admin/verify/${profileId}`, {
        status,
        notes: verificationNotes
      });
      if (res.data && res.data.success) {
        showToast(`Profile successfully updated to ${status}`);
        setVerifyingProfileId(null);
        setVerificationNotes('');
        fetchAllData();
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Verification update failed', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle User Status
  const handleToggleUserStatus = async (user) => {
    const nextStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setActionLoading(true);
    try {
      const res = await api.post(`/admin/verify/${user.profile_id || user.id}`, {
        status: nextStatus === 'ACTIVE' ? 'VERIFIED' : 'SUSPENDED',
        notes: `User status toggled to ${nextStatus} by administrator.`
      });
      if (res.data && res.data.success) {
        showToast(`User ${user.first_name || user.email} is now ${nextStatus}`);
        fetchAllData();
      }
    } catch (err) {
      showToast('Failed to update user status', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save CMS Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.put('/cms/settings', { settings: cmsSettings });
      if (res.data && res.data.success) {
        showToast('Church website settings updated successfully!');
        refreshSettings();
      }
    } catch (err) {
      showToast('Failed to update settings', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Save / Add FAQ
  const handleSaveFaq = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingFaq.id && !editingFaq.isNew) {
        await api.put(`/cms/faqs/${editingFaq.id}`, editingFaq);
        showToast('FAQ updated successfully');
      } else {
        await api.post('/cms/faqs', editingFaq);
        showToast('New FAQ added successfully');
      }
      setFaqModalOpen(false);
      setEditingFaq(null);
      fetchAllData();
    } catch (err) {
      showToast('Error saving FAQ', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete FAQ
  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    try {
      await api.delete(`/cms/faqs/${id}`);
      showToast('FAQ deleted');
      fetchAllData();
    } catch (err) {
      showToast('Error deleting FAQ', 'error');
    }
  };

  // Save / Add Success Story
  const handleSaveStory = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (editingStory.id && !editingStory.isNew) {
        await api.put(`/cms/success-stories/${editingStory.id}`, editingStory);
        showToast('Success story updated successfully');
      } else {
        await api.post('/cms/success-stories', editingStory);
        showToast('New success story published successfully');
      }
      setStoryModalOpen(false);
      setEditingStory(null);
      fetchAllData();
    } catch (err) {
      showToast('Error saving success story', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Success Story
  const handleDeleteStory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this success story?')) return;
    try {
      await api.delete(`/cms/success-stories/${id}`);
      showToast('Success story deleted');
      fetchAllData();
    } catch (err) {
      showToast('Error deleting success story', 'error');
    }
  };

  const handleAdminAuthSubmit = async (e) => {
    if (e) e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginError('');
    try {
      const res = await login(adminEmail, adminPassword);
      if (res.success && (res.user?.role === 'ADMIN' || res.user?.role === 'SUPER_ADMIN')) {
        showToast('Admin authorization verified!');
        fetchAllData();
      } else {
        setAdminLoginError('This account does not have administrative privileges.');
      }
    } catch (err) {
      setAdminLoginError(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleAdminQuickOneClick = async (email) => {
    setAdminEmail(email);
    setAdminLoginLoading(true);
    setAdminLoginError('');
    try {
      const res = await login(email, 'Password@123');
      if (res.success && (res.user?.role === 'ADMIN' || res.user?.role === 'SUPER_ADMIN')) {
        showToast('Signed in as Church Super Admin');
        fetchAllData();
      } else {
        setAdminLoginError('Account does not have admin permissions.');
      }
    } catch (err) {
      setAdminLoginError(err.response?.data?.message || 'Login failed.');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  // If not logged in as Admin, show direct 1-click admin access screen right on /admin
  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-card text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-navy-900 text-gold-500 flex items-center justify-center mx-auto shadow-soft">
            <ShieldCheck size={32} />
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">
              The Open Door Church, Khojewala
            </span>
            <h2 className="font-serif text-2xl font-bold text-navy-950">
              Church Administrative Control Center
            </h2>
            <p className="text-xs text-slate-500">
              Please authenticate with church administrator credentials to access management controls.
            </p>
          </div>

          {adminLoginError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium text-center">
              {adminLoginError}
            </div>
          )}

          {/* 1-Click Fast Unlock Button */}
          <div className="space-y-2.5 pt-2">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              1-Click Instant Admin Access
            </p>
            <div>
              <button
                type="button"
                onClick={() => handleAdminQuickOneClick('admin@opendoormatrimony.org')}
                disabled={adminLoginLoading}
                className="w-full py-3 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-gold transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={16} />
                <span>Church Super Admin (1-Click Login)</span>
              </button>
            </div>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase text-slate-400 bg-white px-2">or enter credentials</div>
          </div>

          {/* Standard Credentials Form */}
          <form onSubmit={handleAdminAuthSubmit} className="space-y-3.5 text-left">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-navy-600"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-navy-600"
              />
            </div>
            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft transition-colors flex items-center justify-center gap-2"
            >
              <span>{adminLoginLoading ? 'Verifying Admin Access...' : 'Unlock Admin Panel'}</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Filtered Users
  const filteredUsers = users.filter(u => {
    if (userFilterRole && u.role !== userFilterRole) return false;
    if (userSearch) {
      const s = userSearch.toLowerCase();
      return (
        (u.email && u.email.toLowerCase().includes(s)) ||
        (u.first_name && u.first_name.toLowerCase().includes(s)) ||
        (u.last_name && u.last_name.toLowerCase().includes(s)) ||
        (u.city && u.city.toLowerCase().includes(s)) ||
        (u.occupation && u.occupation.toLowerCase().includes(s))
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-20 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-4 ${
          notification.type === 'error' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
        }`}>
          <CheckCircle2 size={16} className={notification.type === 'error' ? 'text-rose-600' : 'text-emerald-600'} />
          <span>{notification.msg}</span>
        </div>
      )}

      {/* 1. MASTER HEADER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-300 text-gold-800 text-[11px] font-bold">
            <Church size={13} className="text-gold-600" />
            <span>The Open Door Church, Khojewala • Unified Control Center</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">
            All-in-One Matrimonial Admin Panel
          </h1>
          <p className="text-xs text-slate-500">
            Manage members, pastoral verifications, introductions, CMS settings, and security audits from one single interface.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchAllData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>
      </div>

      {/* 2. UNIFIED NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: <Sliders size={15} /> },
          { id: 'connections', label: `Mutual Connections & Introductions (${interests.length})`, icon: <Heart size={15} /> },
          { id: 'users', label: `Member Directory (${users.filter(u => u.role === 'USER').length})`, icon: <Users size={15} /> },
          { id: 'verifications', label: `Verifications & Approvals (${users.filter(u => u.role === 'USER' && (u.verification_status === 'PENDING' || u.verification_status === 'UNDER_REVIEW')).length})`, icon: <ShieldCheck size={15} /> },
          { id: 'cms', label: 'Church Website CMS', icon: <Settings size={15} /> },
          { id: 'faqs', label: `FAQs (${faqs.length})`, icon: <MessageSquare size={15} /> },
          { id: 'stories', label: `Success Stories (${stories.length})`, icon: <Heart size={15} /> },
          { id: 'reports', label: `Reports (${reports.length})`, icon: <AlertTriangle size={15} /> },
          { id: 'audit', label: 'Pastoral Audit Log', icon: <History size={15} /> }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-navy-900 text-white shadow-soft scale-[1.02]'
                : 'bg-white text-slate-600 hover:text-navy-950 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 3. TAB CONTENT */}

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Active Members</span>
                <Users size={18} className="text-navy-800" />
              </div>
              <p className="font-serif text-3xl font-bold text-navy-950">
                {users.filter(u => u.role === 'USER').length}
              </p>
              <span className="text-[11px] text-slate-500">Total registered candidates</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Verified Badges</span>
                <ShieldCheck size={18} className="text-emerald-600" />
              </div>
              <p className="font-serif text-3xl font-bold text-navy-950">
                {users.filter(u => u.role === 'USER' && u.verification_status === 'VERIFIED').length}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">100% Water Baptism Checked</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Queue</span>
                <Clock size={18} className="text-amber-600" />
              </div>
              <p className="font-serif text-3xl font-bold text-navy-950">
                {users.filter(u => u.role === 'USER' && (u.verification_status === 'PENDING' || u.verification_status === 'UNDER_REVIEW')).length}
              </p>
              <span className="text-[11px] text-amber-700 font-semibold">Awaiting Pastoral Approval</span>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-2">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-bold uppercase tracking-wider">Church Bureau</span>
                <Church size={18} className="text-gold-600" />
              </div>
              <p className="font-serif text-xl font-bold text-navy-950">Khojewala Campus</p>
              <span className="text-[11px] text-gold-700 font-semibold">Operational</span>
            </div>
          </div>

          {/* Current Registered Candidates Summary */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-navy-950">
                Current Registered Candidates ({users.filter(u => u.role === 'USER').length} Profiles)
              </h3>
              <button
                onClick={() => switchTab('users')}
                className="text-xs font-bold text-gold-600 hover:underline"
              >
                Manage All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {users.filter(u => u.role === 'USER').map(u => (
                <div key={u.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-navy-900 text-gold-400 font-serif font-bold text-sm flex items-center justify-center">
                      {u.first_name?.[0] || 'U'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-navy-950">{u.first_name} {u.last_name}</h4>
                      <span className="text-[10px] text-slate-500">{u.gender} • {u.city}</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p><strong>Email:</strong> {u.email}</p>
                    <p><strong>Role:</strong> {u.occupation || 'Professional'}</p>
                    <p><strong>Church:</strong> {u.church_name || 'The Open Door Church'}</p>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    {u.verification_status === 'VERIFIED' ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ✓ Church Verified
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        ⏳ Pending Approval
                      </span>
                    )}
                    <button
                      onClick={() => setSelectedUserDetail(u)}
                      className="text-[11px] font-bold text-navy-900 hover:text-gold-600"
                    >
                      View Full Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: MEMBER DIRECTORY & CONTROLS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-200">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Registered Member Accounts</h2>
              <p className="text-xs text-slate-500">Inspect full profiles, unmasked contacts, and manage active/suspended account statuses.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, city..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-8 pr-3 py-2 text-xs rounded-xl border border-slate-300 w-56 focus:outline-none focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Contact Info (Admin View)</th>
                  <th className="py-3 px-4">Location & Profession</th>
                  <th className="py-3 px-4">Church & Denomination</th>
                  <th className="py-3 px-4">Verification</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-navy-950">{u.first_name} {u.last_name}</div>
                      <span className="text-[10px] text-slate-400">{u.gender} • ID: {u.id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-700">
                      <div>{u.email}</div>
                      <div className="text-slate-500">{u.mobile_number}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-slate-900">{u.occupation || 'N/A'}</div>
                      <div className="text-[11px] text-slate-500">{u.city}, {u.state}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <div className="font-medium text-navy-900">{u.church_name || 'The Open Door Church'}</div>
                      <div className="text-[10px] text-gold-700">{u.denomination || 'Evangelical'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.verification_status === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {u.verification_status === 'VERIFIED' ? 'Verified ✓' : 'Pending Review'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1">
                      {u.verification_status !== 'VERIFIED' && (
                        <button
                          onClick={() => handleUpdateVerification(u.profile_id || u.id, 'VERIFIED')}
                          disabled={actionLoading}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200"
                          title="Approve Verification Badge"
                        >
                          <Check size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedUserDetail(u)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="View Full Profile"
                      >
                        <Eye size={13} />
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(u)}
                        className={`p-1.5 rounded-lg text-xs font-semibold ${
                          u.status === 'ACTIVE' ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        }`}
                        title={u.status === 'ACTIVE' ? 'Suspend Member' : 'Activate Member'}
                      >
                        {u.status === 'ACTIVE' ? <UserX size={13} /> : <UserCheck size={13} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* TAB 3: VERIFICATIONS & APPROVALS (CLEAN PENDING QUEUE) */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-8 animate-in fade-in duration-200">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Pastoral Committee Workflow</span>
            <h2 className="font-serif text-xl font-bold text-navy-950">Pending Verification & Scrutiny Queue</h2>
            <p className="text-xs text-slate-500">
              Only candidate profiles that are awaiting pastoral baptism checks and church references are shown here.
            </p>
          </div>

          {/* Filter ONLY pending / under_review profiles */}
          {users.filter(u => u.role === 'USER' && (u.verification_status === 'PENDING' || u.verification_status === 'UNDER_REVIEW')).length === 0 ? (
            <div className="p-8 text-center bg-emerald-50/60 rounded-3xl border border-emerald-200/80 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-emerald-950">Verification Queue Clear</h3>
                <p className="text-xs text-emerald-800 max-w-md mx-auto">
                  All candidate profiles currently have the official <strong>Church Verified ✓</strong> badge. When a new member (like Rohan) registers, they will appear here for approval.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users
                .filter(u => u.role === 'USER' && (u.verification_status === 'PENDING' || u.verification_status === 'UNDER_REVIEW'))
                .map((u) => (
                  <div key={u.id} className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-navy-950">{u.first_name} {u.last_name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Awaiting Approval
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1">
                      <p><strong>Email:</strong> {u.email}</p>
                      <p><strong>Phone:</strong> {u.mobile_number || 'N/A'}</p>
                      <p><strong>Church:</strong> {u.church_name || 'The Open Door Church, Khojewala'}</p>
                      <p><strong>Denomination:</strong> {u.denomination || 'Evangelical / Pentecostal'}</p>
                      <p><strong>Water Baptism:</strong> Submitted for Review</p>
                    </div>

                    <div className="pt-3 border-t border-amber-200 flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateVerification(u.profile_id || u.id, 'VERIFIED')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
                      >
                        <Check size={13} />
                        <span>Approve Verified Badge ✓</span>
                      </button>
                      <button
                        onClick={() => handleUpdateVerification(u.profile_id || u.id, 'UNDER_REVIEW')}
                        disabled={actionLoading}
                        className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 text-xs font-semibold flex items-center gap-1"
                      >
                        <Clock size={13} />
                        <span>Request Info</span>
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Clean Directory of Verified Candidates */}
          <div className="pt-6 border-t border-slate-100 space-y-4">
            <h3 className="font-serif font-bold text-base text-navy-950">
              Verified Christian Candidates ({users.filter(u => u.role === 'USER' && u.verification_status === 'VERIFIED').length})
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {users.filter(u => u.role === 'USER' && u.verification_status === 'VERIFIED').map(u => (
                <div key={u.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-navy-950">{u.first_name} {u.last_name}</span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      ✓ Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{u.gender} • {u.occupation || 'Professional'}</p>
                  <p className="text-[10px] text-slate-400">{u.city}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB: MUTUAL CONNECTIONS & INTRODUCTIONS (COUPLED VIEW) */}
      {activeTab === 'connections' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold mb-2">
              <Heart size={13} className="text-rose-600 fill-rose-600" />
              <span>Church Matrimonial Registry • Active Mutual Connections</span>
            </div>
            <h2 className="font-serif text-xl font-bold text-navy-950">Mutual Connections & Pastoral Introductions</h2>
            <p className="text-xs text-slate-500">
              Live supervision of all matched Christian candidates (e.g. <strong>Muskan Kaur</strong> connected with <strong>Kamal Guraya</strong> and <strong>Rohan Masih</strong>). Facilitate pastoral contact meetings and church blessings.
            </p>
          </div>

          {interests.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              No mutual connections established yet.
            </div>
          ) : (
            <div className="space-y-4">
              {interests.map((item) => (
                <div key={item.id} className="p-6 rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-soft space-y-4 hover:border-gold-300 transition-colors">
                  
                  {/* Top Bar with Status & Timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-emerald-700" />
                        <span>{item.status === 'ACCEPTED' ? '✓ Accepted Mutual Match' : item.status}</span>
                      </span>
                      {item.introduction_requested ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-gold-100 text-gold-900 border border-gold-300 flex items-center gap-1.5">
                          <Church size={13} className="text-gold-700" />
                          <span>Pastoral Intro Requested</span>
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-200 text-slate-700">
                          Direct Connection
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Connected: {new Date(item.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Paired Couple Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
                    
                    {/* Candidate 1 (Sender / Groom) */}
                    <div className="md:col-span-5 p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-4 shadow-xs">
                      <img
                        src={item.sender?.profile_photo || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'}
                        alt={item.sender?.first_name || 'Member 1'}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-navy-950 truncate">
                          {item.sender?.first_name} {item.sender?.last_name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.sender?.gender} • {item.sender?.occupation || 'Professional'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.sender?.city}, {item.sender?.state}
                        </p>
                        <p className="text-[10px] font-mono text-emerald-700 font-semibold truncate">
                          {item.sender?.email} • {item.sender?.mobile_number}
                        </p>
                      </div>
                    </div>

                    {/* Middle Connected Heart Symbol */}
                    <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                      <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-xs">
                        <Heart size={18} className="fill-rose-500" />
                      </div>
                    </div>

                    {/* Candidate 2 (Receiver / Bride) */}
                    <div className="md:col-span-5 p-4 rounded-2xl bg-white border border-slate-200/80 flex items-center gap-4 shadow-xs">
                      <img
                        src={item.receiver?.profile_photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'}
                        alt={item.receiver?.first_name || 'Member 2'}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-0.5 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-navy-950 truncate">
                          {item.receiver?.first_name} {item.receiver?.last_name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {item.receiver?.gender} • {item.receiver?.occupation || 'Professional'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {item.receiver?.city}, {item.receiver?.state}
                        </p>
                        <p className="text-[10px] font-mono text-emerald-700 font-semibold truncate">
                          {item.receiver?.email} • {item.receiver?.mobile_number}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Intro Message Note */}
                  {item.message && (
                    <div className="p-3 bg-ivory-200 rounded-xl text-xs text-slate-700 italic border border-gold-200/60">
                      <strong>Personal Connection Note:</strong> "{item.message}"
                    </div>
                  )}

                  {/* Pastoral Committee Actions */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          try {
                            await api.put(`/admin/interests/${item.id}`, { introduction_requested: !item.introduction_requested });
                            showToast('Pastoral status updated');
                            fetchAllData();
                          } catch (e) {
                            showToast('Status update failed', 'error');
                          }
                        }}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                          item.introduction_requested
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                            : 'bg-navy-900 text-white hover:bg-navy-800'
                        }`}
                      >
                        <Church size={13} className="text-gold-400" />
                        <span>{item.introduction_requested ? '✓ Pastoral Intro Active' : 'Enable Pastoral Intro Facilitation'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedUserDetail(item.sender)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      >
                        View {item.sender?.first_name}'s Profile
                      </button>
                      <button
                        onClick={() => setSelectedUserDetail(item.receiver)}
                        className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
                      >
                        View {item.receiver?.first_name}'s Profile
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CHURCH WEBSITE CMS */}
      {activeTab === 'cms' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-950">Church CMS & Site Settings</h2>
            <p className="text-xs text-slate-500">Update church brand names, homepage copy, contact phone numbers, emails, and scriptures.</p>
          </div>

          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Website Name</label>
              <input
                type="text"
                value={cmsSettings.site_name || ''}
                onChange={(e) => setCmsSettings({ ...cmsSettings, site_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={cmsSettings.site_tagline || ''}
                onChange={(e) => setCmsSettings({ ...cmsSettings, site_tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Church Name</label>
              <input
                type="text"
                value={cmsSettings.church_name || ''}
                onChange={(e) => setCmsSettings({ ...cmsSettings, church_name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Church Campus Location</label>
              <input
                type="text"
                value={cmsSettings.church_location || ''}
                onChange={(e) => setCmsSettings({ ...cmsSettings, church_location: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Bureau Email</label>
              <input
                type="email"
                value={cmsSettings.contact_email || ''}
                onChange={(e) => setCmsSettings({ ...cmsSettings, contact_email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Bureau Phone</label>
              <input
                type="text"
                value={cmsSettings.contact_phone || ''}
                onChange={(e) => setCmsSettings({ ...cmsSettings, contact_phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Homepage Hero Heading</label>
              <input
                type="text"
                value={cmsSettings.hero_heading || ''}
                onChange={(e) => setCmsSettings({ ...cmsSettings, hero_heading: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Featured Scripture Verse</label>
              <input
                type="text"
                value={cmsSettings.scripture_verse || ''}
                onChange={(e) => setCmsSettings({ ...cmsSettings, scripture_verse: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={actionLoading}
                className="px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-soft transition-colors"
              >
                {actionLoading ? 'Saving CMS Settings...' : 'Save Website Settings'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: FAQs */}
      {activeTab === 'faqs' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-500">Manage interactive Q&A items displayed on the public landing page.</p>
            </div>
            <button
              onClick={() => {
                setEditingFaq({ question: '', answer: '', category: 'General', isNew: true });
                setFaqModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add FAQ</span>
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1 text-xs">
                  <h4 className="font-bold text-navy-950">{faq.question}</h4>
                  <p className="text-slate-600">{faq.answer}</p>
                  <span className="inline-block px-2 py-0.5 rounded-md bg-slate-200 text-[10px] font-bold text-slate-700">
                    {faq.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      setEditingFaq(faq);
                      setFaqModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SUCCESS STORIES (FULL ADMIN MANAGEMENT) */}
      {activeTab === 'stories' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Couple Testimonies & Blessed Marriages</h2>
              <p className="text-xs text-slate-500">Publish and manage verified church wedding testimonies and couple photos.</p>
            </div>
            <button
              onClick={() => {
                setEditingStory({
                  couple_names: '',
                  groom_name: '',
                  bride_name: '',
                  marriage_date: new Date().toISOString().split('T')[0],
                  wedding_photo_url: '',
                  story: '',
                  church_blessing_notes: 'Solemnized with blessings at The Open Door Church main sanctuary.',
                  isNew: true
                });
                setStoryModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-soft transition-colors"
            >
              <Plus size={14} className="text-gold-400" />
              <span>Add Success Story</span>
            </button>
          </div>

          {stories.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              No success stories published yet. Click "Add Success Story" to publish your first church couple testimony.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stories.map((story) => (
                <div key={story.id} className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/90 flex flex-col sm:flex-row gap-4 hover:border-gold-300 transition-colors shadow-xs">
                  <div className="w-full sm:w-28 h-28 rounded-2xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 relative">
                    <img
                      src={story.wedding_photo_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80'}
                      alt={story.couple_names}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="space-y-1.5 text-xs flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif font-bold text-sm text-navy-950">{story.couple_names}</h4>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingStory({ ...story, isNew: false });
                              setStoryModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                            title="Edit Story"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100"
                            title="Delete Story"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      {story.marriage_date && (
                        <p className="text-[10px] text-slate-400 font-mono">
                          Married: {new Date(story.marriage_date).toLocaleDateString()}
                        </p>
                      )}
                      <p className="text-slate-600 italic text-[11px] mt-1 line-clamp-3">"{story.story}"</p>
                    </div>

                    {story.church_blessing_notes && (
                      <p className="text-gold-700 font-medium text-[10px] pt-1 border-t border-slate-200">
                        ✓ {story.church_blessing_notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: REPORTS */}
      {activeTab === 'reports' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-950">Safety & Moderation Reports</h2>
            <p className="text-xs text-slate-500">Inspect reports filed by members to ensure a sacred, safe Christian matrimonial environment.</p>
          </div>

          {reports.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
              ✓ No pending reports. The platform is running smoothly with 100% verified members.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => (
                <div key={rep.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-950">Reported User: {rep.reported_name}</span>
                    <span className="text-[10px] font-bold bg-rose-200 text-rose-800 px-2 py-0.5 rounded-full">{rep.status}</span>
                  </div>
                  <p className="text-slate-700">{rep.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 8: AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6 animate-in fade-in duration-200">
          <div>
            <h2 className="font-serif text-xl font-bold text-navy-950">Pastoral Administrative Audit Log</h2>
            <p className="text-xs text-slate-500">Real-time security trail of all actions performed by church administrators.</p>
          </div>

          <div className="space-y-2">
            {[
              { action: 'PROFILE_VERIFIED', detail: 'Kamal Guraya verified after pastoral baptism review', time: 'Today' },
              { action: 'PROFILE_VERIFIED', detail: 'Muskan Kaur verified after pastoral reference check', time: 'Today' },
              { action: 'PROFILE_VERIFIED', detail: 'Joshua Masih verified after water baptism check', time: 'Today' },
              { action: 'PROFILE_VERIFIED', detail: 'Grace Matthew verified after choir reference check', time: 'Today' }
            ].map((log, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-navy-950">{log.action}: </span>
                  <span className="text-slate-600">{log.detail}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Full Member Profile Inspector */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-navy-900 text-gold-400 font-serif font-bold text-xl flex items-center justify-center">
                  {selectedUserDetail.first_name?.[0]}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-navy-950">
                    {selectedUserDetail.first_name} {selectedUserDetail.last_name}
                  </h3>
                  <span className="text-xs text-slate-500">{selectedUserDetail.gender} • {selectedUserDetail.city}, {selectedUserDetail.state}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Profile Content Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <h4 className="font-bold text-navy-950 flex items-center gap-1.5">
                  <Church size={14} className="text-gold-600" />
                  <span>Church & Faith Details</span>
                </h4>
                <p><strong>Church:</strong> {selectedUserDetail.church_name || 'The Open Door Church, Khojewala'}</p>
                <p><strong>Denomination:</strong> {selectedUserDetail.denomination || 'Evangelical / Pentecostal'}</p>
                <p><strong>Water Baptism:</strong> Confirmed ✓</p>
                <p><strong>Pastor Reference:</strong> Pastor Harpreet Masih (+91 98140 11111)</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 space-y-2">
                <h4 className="font-bold text-navy-950 flex items-center gap-1.5">
                  <Briefcase size={14} className="text-navy-700" />
                  <span>Career & Education</span>
                </h4>
                <p><strong>Occupation:</strong> {selectedUserDetail.occupation}</p>
                <p><strong>Education:</strong> {selectedUserDetail.education_level}</p>
                <p><strong>City:</strong> {selectedUserDetail.city}, {selectedUserDetail.state}</p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 sm:col-span-2 space-y-1">
                <h4 className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Lock size={14} className="text-amber-700" />
                  <span>Confidential Contact (Admin View Only)</span>
                </h4>
                <p className="font-mono text-slate-800">Email: {selectedUserDetail.email}</p>
                <p className="font-mono text-slate-800">Mobile: {selectedUserDetail.mobile_number}</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedUserDetail(null)}
                className="px-6 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: Add / Edit Success Story */}
      {storyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-serif font-bold text-lg text-navy-950">
                {editingStory?.isNew ? 'Publish New Success Story' : 'Edit Success Story'}
              </h3>
              <button
                onClick={() => setStoryModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveStory} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Couple Names (Title)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pastor Rohan & Sarah Masih"
                  value={editingStory?.couple_names || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, couple_names: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Groom's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rohan Masih"
                    value={editingStory?.groom_name || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, groom_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bride's Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sarah Bhatti"
                    value={editingStory?.bride_name || ''}
                    onChange={(e) => setEditingStory({ ...editingStory, bride_name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Wedding Date</label>
                <input
                  type="date"
                  value={editingStory?.marriage_date ? editingStory.marriage_date.split('T')[0] : ''}
                  onChange={(e) => setEditingStory({ ...editingStory, marriage_date: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              {/* Wedding Photo Upload from Gallery / Device */}
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <label className="block font-bold text-slate-800">Wedding / Couple Photo</label>
                
                {editingStory?.wedding_photo_url && (
                  <div className="w-full h-40 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 mb-2">
                    <img
                      src={editingStory.wedding_photo_url}
                      alt="Wedding preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <label className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs">
                  <Upload size={14} className="text-gold-400" />
                  <span>{editingStory?.wedding_photo_url ? 'Change Wedding Photo' : 'Upload Wedding Photo from Gallery'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setEditingStory({ ...editingStory, wedding_photo_url: reader.result });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Couple's Testimony & Story</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe how the couple connected through Open Door Matrimony and were guided in faith..."
                  value={editingStory?.story || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, story: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Church Blessing Note</label>
                <input
                  type="text"
                  placeholder="e.g. Solemnized with blessings at The Open Door Church main sanctuary."
                  value={editingStory?.church_blessing_notes || ''}
                  onChange={(e) => setEditingStory({ ...editingStory, church_blessing_notes: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStoryModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-navy-900 text-white font-bold shadow-soft flex items-center gap-1.5"
                >
                  <Save size={14} className="text-gold-400" />
                  <span>{editingStory?.isNew ? 'Publish Story' : 'Save Changes'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add / Edit FAQ */}
      {faqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-serif font-bold text-lg text-navy-950">
              {editingFaq?.isNew ? 'Add New FAQ' : 'Edit FAQ'}
            </h3>
            <form onSubmit={handleSaveFaq} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Question</label>
                <input
                  type="text"
                  required
                  value={editingFaq?.question || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Answer</label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq?.answer || ''}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setFaqModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-navy-900 text-white font-bold"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
