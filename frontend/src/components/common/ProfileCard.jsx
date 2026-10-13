import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Bookmark, MapPin, Briefcase, GraduationCap, Church, ShieldCheck, Sparkles, Send, CheckCircle2, Clock } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import MembershipPaywallModal from './MembershipPaywallModal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function ProfileCard({ profile, onInterestSent, onSavedToggle, isSavedInitial = false }) {
  const { isAuthenticated, user } = useAuth();
  const [isSaved, setIsSaved] = useState(isSavedInitial);
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [interestMessage, setInterestMessage] = useState('Praise the Lord. I have reviewed your profile and would be honored to connect through the church matrimonial bureau.');
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSentSuccess, setInterestSentSuccess] = useState(false);
  const [localInterestStatus, setLocalInterestStatus] = useState(profile.interest_status || null);

  const isOwnProfile = user && (user.id === profile.user_id || user.id === profile.id);

  const handleSaveToggle = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to bookmark profiles.');
      return;
    }
    try {
      const res = await api.post(`/saved/toggle/${profile.id || profile.user_id}`);
      if (res.data && res.data.success) {
        setIsSaved(res.data.is_saved);
        if (onSavedToggle) onSavedToggle(profile.id, res.data.is_saved);
      }
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleSendInterest = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login or register to express interest.');
      return;
    }
    setSendingInterest(true);
    try {
      const res = await api.post('/interests', {
        receiver_id: profile.user_id,
        message: interestMessage
      });
      if (res.data && res.data.success) {
        setInterestSentSuccess(true);
        setTimeout(() => {
          setInterestModalOpen(false);
          setInterestSentSuccess(false);
          if (onInterestSent) onInterestSent(profile.user_id);
        }, 1500);
      }
    } catch (err) {
      if (err.response?.data?.requires_membership || err.response?.status === 403) {
        setInterestModalOpen(false);
        setPaywallOpen(true);
      } else {
        alert(err.response?.data?.message || 'Unable to send interest request.');
      }
    } finally {
      setSendingInterest(false);
    }
  };

  const handleConnectClick = () => {
    if (!isAuthenticated) {
      alert('Please login or register to express matrimonial interest.');
      return;
    }
    const hasMembership = Boolean(
      user && (
        user.is_membership_active ||
        user.membership_tier !== 'FREE' ||
        user.connect_credits > 0 ||
        user.role === 'ADMIN' ||
        user.role === 'SUPER_ADMIN'
      )
    );
    if (!hasMembership) {
      setPaywallOpen(true);
    } else {
      setInterestModalOpen(true);
    }
  };

  const defaultAvatar = profile.gender === 'FEMALE'
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Top Image Container */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={profile.profile_photo || defaultAvatar}
          alt={profile.first_name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = defaultAvatar;
          }}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Verification Badge Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          <VerificationBadge status={profile.verification_status} size="sm" />
        </div>

        {/* Compatibility Score Tag Top Right */}
        {profile.compatibility_score && (
          <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-full text-[11px] font-bold text-navy-900 border border-gold-300 shadow-xs flex items-center gap-1">
            <Sparkles size={11} className="text-gold-600 fill-gold-500" />
            <span>{profile.compatibility_score}%</span>
          </div>
        )}

        {/* Name & Quick Age Overlay on Bottom of Image */}
        <div className="absolute bottom-2.5 left-3 right-3 text-white">
          <h3 className="text-base font-serif font-bold tracking-tight text-white drop-shadow-xs flex items-center gap-1.5">
            {profile.first_name} {profile.last_name}
            {profile.age && <span className="text-xs font-sans font-normal opacity-90">({profile.age} yrs)</span>}
          </h3>
          <p className="text-[11px] text-slate-200 flex items-center gap-1">
            <MapPin size={11} className="text-gold-400 shrink-0" />
            <span className="truncate">{profile.city}, {profile.state}</span>
          </p>
        </div>

        {/* Bookmark Action on Image */}
        {!isOwnProfile && (
          <button
            onClick={handleSaveToggle}
            className={`absolute bottom-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors ${
              isSaved ? 'bg-gold-500 text-white' : 'bg-white/80 text-slate-700 hover:bg-white'
            }`}
            title={isSaved ? 'Saved in bookmarks' : 'Bookmark profile'}
          >
            <Bookmark size={13} className={isSaved ? 'fill-white' : ''} />
          </button>
        )}
      </div>

      {/* Card Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        {/* Core Attributes */}
        <div className="space-y-1.5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Briefcase size={13} className="text-gold-600 shrink-0" />
            <span className="truncate font-medium text-slate-800">{profile.occupation || 'Professional'}</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap size={13} className="text-gold-600 shrink-0" />
            <span className="truncate text-slate-600">{profile.education_level || 'Graduate'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Church size={13} className="text-navy-700 shrink-0" />
            <span className="truncate text-slate-600">{profile.denomination || 'Christian'}</span>
          </div>
        </div>

        {/* Highlights Pill */}
        {profile.compatibility_highlights && profile.compatibility_highlights.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1">
            {profile.compatibility_highlights.slice(0, 2).map((hl, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-medium px-2 py-0.5 rounded-md truncate max-w-full">
                ✓ {hl}
              </span>
            ))}
          </div>
        )}

        {/* Actions Button Row */}
        <div className="pt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2 mt-auto">
          <Link
            to={`/matches/${profile.user_id || profile.id}`}
            className="w-full text-center py-2 px-2 rounded-xl text-xs font-semibold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Profile
          </Link>

          {!isOwnProfile ? (
            localInterestStatus === 'ACCEPTED' || profile.interest_status === 'ACCEPTED' ? (
              <Link
                to="/dashboard/interests"
                className="w-full py-2 px-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 flex items-center justify-center gap-1 shadow-xs transition-colors"
                title="Mutual Connection Confirmed! Click to view connection details."
              >
                <CheckCircle2 size={12} className="text-emerald-600" />
                <span>Connected ✓</span>
              </Link>
            ) : localInterestStatus === 'SENT_PENDING' || profile.interest_status === 'SENT_PENDING' ? (
              <Link
                to="/dashboard/interests"
                className="w-full py-2 px-2 rounded-xl text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 flex items-center justify-center gap-1 transition-colors"
                title="Interest sent. Awaiting candidate response."
              >
                <Clock size={12} className="text-amber-600" />
                <span>Sent</span>
              </Link>
            ) : localInterestStatus === 'RECEIVED_PENDING' || profile.interest_status === 'RECEIVED_PENDING' ? (
              <Link
                to="/dashboard/interests"
                className="w-full py-2 px-2 rounded-xl text-xs font-bold bg-gold-400 hover:bg-gold-500 text-navy-950 flex items-center justify-center gap-1 shadow-xs transition-colors"
                title="Candidate expressed interest in you! Click to respond."
              >
                <Heart size={12} className="text-navy-950 fill-navy-950" />
                <span>Respond</span>
              </Link>
            ) : (
              <button
                onClick={handleConnectClick}
                className="w-full py-2 px-2 rounded-xl text-xs font-semibold bg-navy-900 hover:bg-navy-800 text-white flex items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <Heart size={12} className="text-gold-400 fill-gold-400" />
                <span>Connect</span>
              </button>
            )
          ) : (
            <Link
              to="/dashboard/edit-profile"
              className="w-full text-center py-2 px-2 rounded-xl text-xs font-semibold bg-gold-500 hover:bg-gold-600 text-white transition-colors"
            >
              Edit Mine
            </Link>
          )}
        </div>
      </div>

      {/* Express Interest Modal */}
      {interestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-serif font-bold text-navy-900 mb-1">
              Express Interest in {profile.first_name}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Your interest will be conveyed respectfully. If accepted, pastoral contact and introduction options will become available.
            </p>

            {interestSentSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl text-center text-sm font-medium border border-emerald-200">
                ✓ Express Interest successfully sent!
              </div>
            ) : (
              <form onSubmit={handleSendInterest} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Personalized Message (Optional & Respectful)
                  </label>
                  <textarea
                    rows={3}
                    value={interestMessage}
                    onChange={(e) => setInterestMessage(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-navy-600"
                    placeholder="Enter a brief message..."
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setInterestModalOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingInterest}
                    className="px-5 py-2 text-xs font-semibold bg-navy-900 hover:bg-navy-800 text-white rounded-xl flex items-center gap-1.5 shadow-xs"
                  >
                    <Send size={13} />
                    <span>{sendingInterest ? 'Sending...' : 'Send Interest'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Membership Paywall Modal */}
      {paywallOpen && (
        <MembershipPaywallModal
          onClose={() => setPaywallOpen(false)}
          onSuccess={() => {
            setPaywallOpen(false);
            setInterestModalOpen(true);
          }}
        />
      )}
    </div>
  );
}
