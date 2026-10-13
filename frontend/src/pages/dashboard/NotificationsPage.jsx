import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCircle2, Heart, ShieldCheck, Clock, Check, Sparkles, Church, Users, ArrowRight, Filter } from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('ALL');

  const fetchNotifs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res.data && res.data.success) {
        setNotifications(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.put('/notifications/all/read');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filterCategory === 'VERIFIED') return n.type?.includes('VERIFIED') || n.type?.includes('REVIEW');
    if (filterCategory === 'INTERESTS') return n.type?.includes('INTEREST');
    if (filterCategory === 'INTRO') return n.type?.includes('INTRO');
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gold-50 border border-gold-300 text-gold-800 text-[11px] font-bold mb-1">
            <Bell size={12} className="text-gold-600" />
            <span>Real-Time Alerts & Updates</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-950">Notification Center</h1>
          <p className="text-xs text-slate-500">
            Timely spiritual updates regarding interest requests, church pastoral approvals, and introductions.
          </p>
        </div>

        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-bold text-navy-900 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Check size={14} className="text-emerald-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            filterCategory === 'ALL' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Alerts ({notifications.length})
        </button>
        <button
          onClick={() => setFilterCategory('INTERESTS')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            filterCategory === 'INTERESTS' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Matches & Requests ({notifications.filter(n => n.type?.includes('INTEREST')).length})
        </button>
        <button
          onClick={() => setFilterCategory('VERIFIED')}
          className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-colors ${
            filterCategory === 'VERIFIED' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          Church Approvals ({notifications.filter(n => n.type?.includes('VERIFIED') || n.type?.includes('REVIEW')).length})
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400">Loading alerts...</div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState
            icon="shield"
            title="No Notifications Found"
            description="You are all caught up. When someone expresses interest or the church committee approves a badge, alerts will appear here."
          />
        ) : (
          filteredNotifications.map((notif) => {
            const isVerified = notif.type?.includes('VERIFIED');
            const isInterest = notif.type?.includes('INTEREST');
            const isIntro = notif.type?.includes('INTRO');

            return (
              <div
                key={notif.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  notif.is_read ? 'bg-white border-slate-200 shadow-2xs' : 'bg-gold-50/60 border-gold-300 shadow-soft'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
                    isVerified ? 'bg-emerald-100 text-emerald-800' :
                    isInterest ? 'bg-rose-100 text-rose-700' :
                    isIntro ? 'bg-gold-100 text-gold-800' : 'bg-navy-100 text-navy-900'
                  }`}>
                    {isVerified ? <ShieldCheck size={22} /> :
                     isInterest ? <Heart size={22} className="fill-rose-500" /> :
                     isIntro ? <Users size={22} /> : <Bell size={22} />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-serif font-bold text-sm text-navy-950">{notif.title}</h4>
                      {!notif.is_read && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-gold-500 text-navy-950">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 font-mono block pt-0.5">
                      {new Date(notif.created_at).toLocaleDateString()} at {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {notif.link_url && (
                  <Link
                    to={notif.link_url}
                    className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shrink-0 shadow-soft transition-colors flex items-center justify-center gap-1.5 self-end sm:self-center"
                  >
                    <span>View Details</span>
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
