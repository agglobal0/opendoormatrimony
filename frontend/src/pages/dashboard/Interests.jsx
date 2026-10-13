import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Check, X, Church, ShieldCheck, MessageCircle, ArrowRight } from 'lucide-react';
import VerificationBadge from '../../components/common/VerificationBadge';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

export default function Interests() {
  const [activeTab, setActiveTab] = useState('received');
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchInterests = async () => {
    setLoading(true);
    try {
      const [recRes, sentRes] = await Promise.all([
        api.get('/interests/received'),
        api.get('/interests/sent')
      ]);
      if (recRes.data && recRes.data.success) {
        setReceived(recRes.data.data || []);
      }
      if (sentRes.data && sentRes.data.success) {
        setSent(sentRes.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching interests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  const handleRespond = async (interestId, status) => {
    setActionLoading(true);
    try {
      const res = await api.put(`/interests/${interestId}/status`, { status });
      if (res.data && res.data.success) {
        await fetchInterests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error responding to interest.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestIntro = async (interestId) => {
    setActionLoading(true);
    try {
      const res = await api.post(`/interests/${interestId}/introduction`);
      if (res.data && res.data.success) {
        alert(res.data.message || 'Introduction request submitted to the Church Matrimonial Bureau.');
        await fetchInterests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error requesting introduction.');
    } finally {
      setActionLoading(false);
    }
  };

  const mutualMatches = received.filter(i => i.status === 'ACCEPTED').concat(sent.filter(i => i.status === 'ACCEPTED'));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy-950">Interests & Introductions</h1>
        <p className="text-xs text-slate-500">Manage your received requests, sent connections, and mutual matches.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'received' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Received Requests ({received.filter(i => i.status === 'PENDING').length})
        </button>
        <button
          onClick={() => setActiveTab('mutual')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'mutual' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Mutual Matches ({mutualMatches.length})
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'sent' ? 'bg-navy-900 text-white shadow-soft' : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Sent Requests ({sent.length})
        </button>
      </div>

      {/* Tab 1: Received */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          {received.length === 0 ? (
            <EmptyState
              icon="heart"
              title="No Received Interests Yet"
              description="When verified Christian members express interest in your profile, they will appear here."
              actionText="Browse Recommended Matches"
              actionLink="/matches"
            />
          ) : (
            received.map((item) => {
              const p = item.sender || item;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.profile_photo || (p.gender === 'FEMALE' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80')}
                      alt={p.first_name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = p?.gender === 'FEMALE' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link to={`/matches/${item.sender_id}`} className="font-serif font-bold text-lg text-navy-950 hover:text-gold-600">
                          {p.first_name} {p.last_name}
                        </Link>
                        <VerificationBadge status={p.verification_status} size="sm" />
                      </div>
                      <p className="text-xs text-slate-500">
                        {p.city}, {p.state} • {p.occupation}
                      </p>
                      {item.message && (
                        <p className="text-xs text-slate-600 italic bg-ivory-200 p-2 rounded-xl mt-1">
                          "{item.message}"
                        </p>
                      )}
                    </div>
                  </div>

                  {item.status === 'PENDING' ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => handleRespond(item.id, 'ACCEPTED')}
                        disabled={actionLoading}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-xs"
                      >
                        <Check size={14} />
                        <span>Accept Interest</span>
                      </button>
                      <button
                        onClick={() => handleRespond(item.id, 'DECLINED')}
                        disabled={actionLoading}
                        className="flex-1 sm:flex-none px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs font-medium"
                      >
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      ✓ Accepted (Mutual Match)
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Mutual Matches */}
      {activeTab === 'mutual' && (
        <div className="space-y-4">
          {mutualMatches.length === 0 ? (
            <EmptyState
              icon="heart"
              title="No Mutual Matches Yet"
              description="Once both you and a candidate accept mutual interest, church-assisted introductions can begin."
              actionText="Discover Profiles"
              actionLink="/matches"
            />
          ) : (
            mutualMatches.map((item) => {
              const p = item.sender || item.receiver || item;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 border border-gold-300/80 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.profile_photo || (p.gender === 'FEMALE' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80')}
                      alt={p.first_name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = p?.gender === 'FEMALE' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-16 h-16 rounded-2xl object-cover border border-gold-300 shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link to={`/matches/${item.sender_id || item.receiver_id}`} className="font-serif font-bold text-lg text-navy-950 hover:text-gold-600">
                          {p.first_name} {p.last_name}
                        </Link>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-100 text-gold-900 border border-gold-300">
                          Mutual Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        {p.city}, {p.state} • {p.denomination || 'Christian'}
                      </p>
                      {p.user_email && (
                        <p className="text-xs text-emerald-800 font-mono">
                          Contact: {p.user_phone} • {p.user_email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    {item.introduction_requested ? (
                      <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-50 text-navy-900 text-xs font-semibold border border-navy-200">
                        <Church size={14} className="text-gold-600" />
                        <span>Pastoral Intro Requested ✓</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleRequestIntro(item.id)}
                        disabled={actionLoading}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-soft flex items-center justify-center gap-2"
                      >
                        <Church size={14} className="text-gold-400" />
                        <span>Request Pastoral Introduction</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 3: Sent */}
      {activeTab === 'sent' && (
        <div className="space-y-4">
          {sent.length === 0 ? (
            <EmptyState
              icon="search"
              title="No Sent Interests"
              description="You have not sent express interest requests to any profiles yet."
              actionText="Browse Profiles"
              actionLink="/matches"
            />
          ) : (
            sent.map((item) => {
              const p = item.receiver || item;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.profile_photo || (p.gender === 'FEMALE' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80')}
                      alt={p.first_name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = p?.gender === 'FEMALE' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80' : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';
                      }}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <Link to={`/matches/${item.receiver_id}`} className="font-serif font-bold text-lg text-navy-950 hover:text-gold-600">
                        {p.first_name} {p.last_name}
                      </Link>
                      <p className="text-xs text-slate-500">
                        {p.city}, {p.state} • Sent on {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      item.status === 'ACCEPTED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.status === 'DECLINED'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {item.status === 'PENDING' ? 'Awaiting Candidate Response' : item.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

    </div>
  );
}
