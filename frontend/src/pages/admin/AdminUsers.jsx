import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, UserX, UserCheck, Eye, MapPin, Mail, Phone } from 'lucide-react';
import VerificationBadge from '../../components/common/VerificationBadge';
import api from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data && res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSuspend = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'SUSPENDED' ? 'VERIFIED' : 'SUSPENDED';
    if (!confirm(`Are you sure you want to ${newStatus === 'SUSPENDED' ? 'suspend' : 'reinstate'} this account?`)) return;

    try {
      const res = await api.put(`/admin/profiles/${userId}/verify`, { status: newStatus });
      if (res.data && res.data.success) {
        await fetchUsers();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating account.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const s = search.toLowerCase();
    const matchSearch =
      (u.first_name && u.first_name.toLowerCase().includes(s)) ||
      (u.last_name && u.last_name.toLowerCase().includes(s)) ||
      (u.email && u.email.toLowerCase().includes(s)) ||
      (u.city && u.city.toLowerCase().includes(s));

    const matchRole = roleFilter ? u.role === roleFilter : true;
    return matchSearch && matchRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Directory Administration</span>
          <h1 className="font-serif text-3xl font-bold text-navy-950">Member Management ({users.length})</h1>
        </div>
      </div>

      {/* Search & Role Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-soft flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 rounded-xl text-xs border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="py-2 px-3 rounded-xl text-xs border border-slate-300 bg-white"
        >
          <option value="">All Roles</option>
          <option value="USER">Standard Members</option>
          <option value="ADMIN">Admins / Pastoral Staff</option>
          <option value="SUPER_ADMIN">Super Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Member / Email</th>
                <th className="py-3 px-4">Gender & Occupation</th>
                <th className="py-3 px-4">City / Region</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Status & Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-bold text-navy-950 block">{u.first_name} {u.last_name}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {u.gender} • {u.occupation || 'Member'}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{u.city}, {u.state}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role.includes('ADMIN') ? 'bg-gold-100 text-gold-900 border border-gold-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1 items-start">
                      <VerificationBadge status={u.verification_status} size="sm" />
                      {u.status === 'SUSPENDED' && (
                        <span className="text-[10px] font-bold text-rose-600">SUSPENDED</span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setSelectedUser(u)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700"
                      title="Inspect full details"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => handleToggleSuspend(u.id, u.status)}
                      className={`p-1.5 rounded-lg border text-xs font-semibold ${
                        u.status === 'SUSPENDED'
                          ? 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                          : 'border-rose-200 text-rose-600 hover:bg-rose-50'
                      }`}
                      title={u.status === 'SUSPENDED' ? 'Activate account' : 'Suspend account'}
                    >
                      {u.status === 'SUSPENDED' ? <UserCheck size={13} /> : <UserX size={13} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspect Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-serif font-bold text-xl text-navy-950">
                {selectedUser.first_name} {selectedUser.last_name}
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-700 bg-ivory-200 p-4 rounded-2xl">
              <p><span className="font-bold text-navy-900">Email:</span> {selectedUser.email}</p>
              <p><span className="font-bold text-navy-900">Phone:</span> {selectedUser.mobile_number}</p>
              <p><span className="font-bold text-navy-900">Church:</span> {selectedUser.church_name}</p>
              <p><span className="font-bold text-navy-900">Denomination:</span> {selectedUser.denomination}</p>
              <p><span className="font-bold text-navy-900">Registered on:</span> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-navy-900 text-white rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
