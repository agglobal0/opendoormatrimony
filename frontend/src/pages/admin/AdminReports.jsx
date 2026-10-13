import React, { useState, useEffect } from 'react';
import { AlertTriangle, ShieldCheck, Check, X, Eye } from 'lucide-react';
import api from '../../services/api';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports');
      if (res.data && res.data.success) {
        setReports(res.data.data || []);
      }
    } catch (err) {
      console.error('Error loading reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleUpdateStatus = async (reportId, status) => {
    try {
      const res = await api.put(`/admin/reports/${reportId}`, {
        status,
        admin_notes: adminNotes
      });
      if (res.data && res.data.success) {
        alert(`Report marked as ${status}.`);
        setSelectedReport(null);
        setAdminNotes('');
        await fetchReports();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating report.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Discrepancy & Moderation</span>
        <h1 className="font-serif text-3xl font-bold text-navy-950">Reported Profiles Queue</h1>
        <p className="text-xs text-slate-500">Confidential reports submitted by members for church administration review.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden p-6 space-y-4">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-500">Loading reports...</div>
        ) : reports.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">✓ No pending discrepancy reports.</div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                      {r.reason?.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-500">Reported Profile ID: {r.reported_user_id}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium pt-1">"{r.description}"</p>
                  <span className="text-[10px] text-slate-400 block">
                    Reported on {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setSelectedReport(r); setAdminNotes(r.admin_notes || ''); }}
                    className="px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800"
                  >
                    Moderate Report
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Moderation Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-serif font-bold text-xl text-navy-950">Resolve Discrepancy Report</h3>
            <p className="text-xs text-slate-600 bg-ivory-200 p-3 rounded-xl">"{selectedReport.description}"</p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Administrative Action Notes</label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="e.g. Contacted member, verified credentials, report resolved."
                className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none"
              />
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setSelectedReport(null)}
                className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'DISMISSED')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Dismiss Report
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedReport.id, 'RESOLVED')}
                className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                Mark Resolved ✓
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
