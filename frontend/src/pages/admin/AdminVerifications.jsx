import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertCircle, Eye, Church, MapPin, Phone, Mail, User } from 'lucide-react';
import VerificationBadge from '../../components/common/VerificationBadge';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

export default function AdminVerifications() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [notes, setNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/users');
      if (res.data && res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching verification queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleUpdateStatus = async (userId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/admin/profiles/${userId}/verify`, {
        status: newStatus,
        notes
      });
      if (res.data && res.data.success) {
        alert(res.data.message || `Profile status updated to ${newStatus}.`);
        setSelectedUser(null);
        setNotes('');
        await fetchQueue();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating verification status.');
    } finally {
      setActionLoading(false);
    }
  };

  const pendingList = users.filter(u => u.verification_status === 'PENDING' || u.verification_status === 'UNDER_REVIEW');
  const verifiedList = users.filter(u => u.verification_status === 'VERIFIED');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Pastoral Committee</span>
        <h1 className="font-serif text-3xl font-bold text-navy-950">Church Profile Verifications</h1>
        <p className="text-xs text-slate-500">
          Review matrimonial registrations, church references, and grant church-verified status.
        </p>
      </div>

      {/* Pending Applications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="font-serif font-bold text-lg text-navy-950">
            Pending Queue ({pendingList.length} Applications)
          </h3>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading verification applications...</div>
        ) : pendingList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            ✓ All pending member applications have been reviewed!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-4">Gender / Age</th>
                  <th className="py-3 px-4">Home Church & Denomination</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-navy-950">
                      {u.first_name} {u.last_name}
                      <span className="block text-[11px] font-normal text-slate-400">{u.email}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {u.gender} • {u.occupation}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {u.church_name || 'The Open Door Church'}
                      <span className="block text-[11px] text-slate-400">{u.denomination}</span>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{u.city}, {u.state}</td>
                    <td className="py-3 px-4">
                      <VerificationBadge status={u.verification_status} size="sm" />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => { setSelectedUser(u); setNotes(''); }}
                        className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye size={12} />
                        <span>Review & Verify</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Review Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-bold text-2xl text-navy-950">
                  Verification Review: {selectedUser.first_name} {selectedUser.last_name}
                </h3>
                <p className="text-xs text-slate-500">Registered on {new Date(selectedUser.created_at).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Unmasked Details for Admin */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-ivory-200 p-4 rounded-2xl text-xs border border-slate-200">
              <div>
                <span className="text-slate-500 block">Candidate Email:</span>
                <span className="font-bold text-navy-900">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Mobile Phone:</span>
                <span className="font-bold text-navy-900">{selectedUser.mobile_number}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Home Church:</span>
                <span className="font-bold text-navy-900">{selectedUser.church_name || 'The Open Door Church, Khojewala'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Christian Denomination:</span>
                <span className="font-bold text-navy-900">{selectedUser.denomination || 'Evangelical / Pentecostal'}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Pastoral Committee Verification Notes / Feedback
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Cross-verified with Pastor reference. Approved for church verified badge."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedUser.id, 'REJECTED')}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5"
              >
                <XCircle size={14} />
                <span>Reject / Request Changes</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedUser.id, 'UNDER_REVIEW')}
                disabled={actionLoading}
                className="px-4 py-2.5 rounded-xl border border-amber-300 text-amber-800 hover:bg-amber-50 text-xs font-semibold flex items-center gap-1.5"
              >
                <AlertCircle size={14} />
                <span>Mark Under Review</span>
              </button>

              <button
                type="button"
                onClick={() => handleUpdateStatus(selectedUser.id, 'VERIFIED')}
                disabled={actionLoading}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-soft flex items-center gap-1.5"
              >
                <CheckCircle2 size={15} />
                <span>Approve & Verify Profile ✓</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
