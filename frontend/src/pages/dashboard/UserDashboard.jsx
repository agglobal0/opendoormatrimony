import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Bookmark, Bell, Sparkles, User, Edit3, ArrowRight, AlertCircle, CheckCircle2, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import VerificationBadge from '../../components/common/VerificationBadge';
import ProfileCard from '../../components/common/ProfileCard';
import PrintableBiodataModal from '../../components/common/PrintableBiodataModal';
import api from '../../services/api';

export default function UserDashboard() {
  const { user, profile } = useAuth();
  const [matches, setMatches] = useState([]);
  const [receivedInterests, setReceivedInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [biodataModalOpen, setBiodataModalOpen] = useState(false);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [matchRes, interestRes] = await Promise.all([
          api.get('/matches?limit=4'),
          api.get('/interests/received')
        ]);
        if (matchRes.data && matchRes.data.success) {
          setMatches(matchRes.data.data || []);
        }
        if (interestRes.data && interestRes.data.success) {
          setReceivedInterests(interestRes.data.data || []);
        }
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const completion = profile?.completion_percentage || 70;
  const pendingInterests = receivedInterests.filter(i => i.status === 'PENDING');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Welcome Banner with Verification Status & Profile Meter */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-card relative overflow-hidden border border-gold-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img
                src={profile?.profile_photo || (profile?.gender === 'MALE' ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80')}
                alt={profile?.first_name || 'Member'}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = profile?.gender === 'MALE' ? 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80';
                }}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-gold-400 shadow-soft"
              />
              <div className="absolute -bottom-2 -right-2">
                <VerificationBadge status={profile?.verification_status || 'PENDING'} showText={false} size="sm" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Praise the Lord, {profile?.first_name || 'Member'}!
                </h1>
                <VerificationBadge status={profile?.verification_status || 'PENDING'} />
              </div>
              <p className="text-xs text-slate-300">
                {profile?.city}, {profile?.state} • {profile?.occupation || 'Christian Member'}
              </p>
            </div>
          </div>

          {/* Profile Completion Meter */}
          <div className="lg:col-span-4 bg-navy-800/80 rounded-2xl p-4 border border-navy-700/80 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-gold-300">Profile Completion</span>
              <span className="font-bold text-white">{completion}%</span>
            </div>
            <div className="w-full bg-navy-950 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gold-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completion}%` }}
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setBiodataModalOpen(true)}
                className="text-[11px] font-bold text-gold-400 hover:text-gold-300 flex items-center gap-1"
              >
                <Printer size={11} />
                <span>Print Bio-Data PDF</span>
              </button>
              <Link
                to="/dashboard/edit-profile"
                className="text-[11px] font-bold text-slate-300 hover:text-white flex items-center gap-1"
              >
                <span>Edit Profile</span>
                <Edit3 size={11} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Verification Notice if Pending */}
      {profile?.verification_status !== 'VERIFIED' && (
        <div className="bg-amber-50/90 rounded-2xl p-5 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 space-y-1">
              <p className="font-bold text-sm">Church Pastoral Verification in Progress</p>
              <p className="text-amber-800 leading-relaxed max-w-xl">
                To receive the green <strong>Church Verified ✓</strong> badge, your water baptism and pastor reference are reviewed by The Open Door Church matrimonial committee.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/dashboard/edit-profile"
              className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100/50 transition-colors"
            >
              Update Church / Baptism Info
            </Link>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/matches"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Discover</span>
            <h3 className="font-serif font-bold text-lg text-navy-950">Browse Matches</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-navy-50 text-navy-900 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Sparkles size={20} className="text-gold-600" />
          </div>
        </Link>

        <Link
          to="/dashboard/interests"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Requests</span>
            <h3 className="font-serif font-bold text-lg text-navy-950">
              Interests {pendingInterests.length > 0 && <span className="text-xs text-rose-600 font-sans">({pendingInterests.length} New)</span>}
            </h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Heart size={20} className="fill-rose-500" />
          </div>
        </Link>

        <Link
          to="/dashboard/saved"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bookmarks</span>
            <h3 className="font-serif font-bold text-lg text-navy-950">Saved Profiles</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Bookmark size={20} className="fill-gold-500" />
          </div>
        </Link>

        <Link
          to="/dashboard/edit-profile"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-soft hover:shadow-card transition-all flex items-center justify-between group"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">My Account</span>
            <h3 className="font-serif font-bold text-lg text-navy-950">Edit Profile</h3>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
            <User size={20} />
          </div>
        </Link>
      </div>

      {/* Recommended Matches Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-navy-950">Top Recommended Matches For You</h2>
            <p className="text-xs text-slate-500">Based on your Christian faith, age, and location preferences</p>
          </div>
          <Link
            to="/matches"
            className="text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {matches.slice(0, 4).map((m) => (
            <ProfileCard key={m.id} profile={m} />
          ))}
        </div>
      </div>

      {/* Printable Bio-Data PDF Modal */}
      {biodataModalOpen && profile && (
        <PrintableBiodataModal
          profile={profile}
          onClose={() => setBiodataModalOpen(false)}
        />
      )}

    </div>
  );
}
