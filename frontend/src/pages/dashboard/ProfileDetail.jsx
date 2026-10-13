import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Church, ShieldCheck, Heart, Bookmark, Flag, MapPin, Briefcase, GraduationCap, Users, BookOpen, Lock, Send, AlertTriangle, Printer } from 'lucide-react';
import VerificationBadge from '../../components/common/VerificationBadge';
import PrintableBiodataModal from '../../components/common/PrintableBiodataModal';
import MembershipPaywallModal from '../../components/common/MembershipPaywallModal';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ProfileDetail() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [biodataModalOpen, setBiodataModalOpen] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);

  // Interest Modal State
  const [interestModalOpen, setInterestModalOpen] = useState(false);
  const [interestMessage, setInterestMessage] = useState('Praise the Lord. I have reviewed your profile and would be honored to connect through the church matrimonial bureau.');
  const [sendingInterest, setSendingInterest] = useState(false);
  const [interestSuccess, setInterestSuccess] = useState(false);

  // Report Modal State
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('MISLEADING_INFO');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get(`/profile/${id}`);
        if (res.data && res.data.success) {
          setProfile(res.data.profile);
        }
      } catch (err) {
        console.error('Error loading profile details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  const handleSaveToggle = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark profiles.');
      return;
    }
    try {
      const res = await api.post(`/saved/toggle/${profile.id || profile.user_id}`);
      if (res.data && res.data.success) {
        setIsSaved(res.data.is_saved);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendInterest = async (e) => {
    e.preventDefault();
    setSendingInterest(true);
    try {
      const res = await api.post('/interests', {
        receiver_id: profile.user_id,
        message: interestMessage
      });
      if (res.data && res.data.success) {
        setInterestSuccess(true);
        setTimeout(() => {
          setInterestModalOpen(false);
          setInterestSuccess(false);
        }, 1500);
      }
    } catch (err) {
      if (err.response?.data?.requires_membership || err.response?.status === 403) {
        setInterestModalOpen(false);
        setPaywallOpen(true);
      } else {
        alert(err.response?.data?.message || 'Failed to send interest.');
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

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/reports', {
        reported_user_id: profile.user_id,
        reason: reportReason,
        description: reportDesc
      });
      if (res.data && res.data.success) {
        setReportSuccess(true);
        setTimeout(() => {
          setReportModalOpen(false);
          setReportSuccess(false);
        }, 1500);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit report.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500">
        Loading profile details...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-navy-950">Profile Not Found</h2>
        <p className="text-xs text-slate-500">This profile may have been withdrawn or suspended.</p>
        <Link to="/matches" className="inline-block px-6 py-2 rounded-xl bg-navy-900 text-white text-xs font-semibold">
          Back to Matches
        </Link>
      </div>
    );
  }

  const isOwnProfile = user && user.id === profile.user_id;
  const defaultPhoto = profile.gender === 'FEMALE'
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Profile Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Left Avatar */}
          <div className="md:col-span-4 aspect-4/5 rounded-2xl overflow-hidden bg-slate-100 relative shadow-soft">
            <img
              src={profile.profile_photo || defaultPhoto}
              alt={profile.first_name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultPhoto;
              }}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute top-3 left-3">
              <VerificationBadge status={profile.verification_status} size="sm" />
            </div>
          </div>

          {/* Right Core Details & Actions */}
          <div className="md:col-span-8 space-y-5">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h1 className="font-serif text-3xl font-bold text-navy-950">
                  {profile.first_name} {profile.last_name}
                </h1>
                <VerificationBadge status={profile.verification_status} />
              </div>
              <p className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
                <MapPin size={15} className="text-gold-600" />
                <span>{profile.city}, {profile.state}, {profile.country}</span>
              </p>
            </div>

            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-ivory-200 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-slate-500 block">Age / Height</span>
                <span className="font-bold text-navy-900">{profile.age || '26'} yrs • {profile.height_cm || 172} cm</span>
              </div>
              <div>
                <span className="text-slate-500 block">Marital Status</span>
                <span className="font-bold text-navy-900">{profile.marital_status?.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Education</span>
                <span className="font-bold text-navy-900 truncate block">{profile.education_level}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Profession</span>
                <span className="font-bold text-navy-900 truncate block">{profile.occupation}</span>
              </div>
            </div>

            {/* Short Bio */}
            {profile.about_me && (
              <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                "{profile.about_me}"
              </p>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              {!isOwnProfile ? (
                <>
                  <button
                    onClick={handleConnectClick}
                    className="px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-soft flex items-center gap-2 transition-colors"
                  >
                    <Heart size={15} className="text-gold-400 fill-gold-400" />
                    <span>Express Matrimonial Interest</span>
                  </button>

                  <button
                    onClick={() => setBiodataModalOpen(true)}
                    className="px-4 py-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-navy-950 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Printer size={15} className="text-gold-600" />
                    <span>Print Bio-Data PDF</span>
                  </button>

                  <button
                    onClick={handleSaveToggle}
                    className={`px-4 py-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      isSaved ? 'bg-gold-500 border-gold-500 text-white' : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Bookmark size={15} className={isSaved ? 'fill-white' : ''} />
                    <span>{isSaved ? 'Saved' : 'Bookmark'}</span>
                  </button>

                  <button
                    onClick={() => setReportModalOpen(true)}
                    className="px-3 py-3 rounded-xl text-xs text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-auto"
                    title="Report discrepancy to church admin"
                  >
                    <Flag size={15} />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/dashboard/edit-profile"
                    className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold shadow-gold"
                  >
                    Edit My Profile Details
                  </Link>
                  <button
                    onClick={() => setBiodataModalOpen(true)}
                    className="px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-soft flex items-center gap-1.5"
                  >
                    <Printer size={15} className="text-gold-400" />
                    <span>Print / Export My Bio-Data</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Structured Details Tabs / Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Section 1: Christian Faith & Church Information */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Church className="w-5 h-5 text-gold-600" />
            <h3 className="font-serif font-bold text-lg text-navy-950">Christian Faith & Ministry</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Home Church:</span>
              <span className="font-semibold text-navy-900 text-right">{profile.church_name || 'The Open Door Church'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Denomination:</span>
              <span className="font-semibold text-navy-900 text-right">{profile.denomination || 'Christian'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Water Baptized:</span>
              <span className="font-semibold text-emerald-700">{profile.is_baptized ? 'Yes ✓' : 'No'}</span>
            </div>
            {profile.church_involvement && (
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Church Involvement:</span>
                <span className="font-semibold text-navy-900 text-right">{profile.church_involvement}</span>
              </div>
            )}
            {profile.faith_description && (
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Personal Faith Testimony:</span>
                <p className="text-slate-700 italic bg-ivory-200 p-3 rounded-xl leading-relaxed">
                  "{profile.faith_description}"
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Family Background */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Users className="w-5 h-5 text-navy-700" />
            <h3 className="font-serif font-bold text-lg text-navy-950">Family Information</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Family Type:</span>
              <span className="font-semibold text-navy-900">{profile.family_type === 'JOINT' ? 'Joint Family' : 'Nuclear Family'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Family Values:</span>
              <span className="font-semibold text-navy-900">{profile.family_values?.replace('_', ' ') || 'Traditional Christian'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Father's Vocation:</span>
              <span className="font-semibold text-navy-900">{profile.father_occupation || 'Senior Professional / Retd'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Mother's Vocation:</span>
              <span className="font-semibold text-navy-900">{profile.mother_occupation || 'Homemaker'}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Siblings:</span>
              <span className="font-semibold text-navy-900">{profile.brothers_count || 0} Brother(s), {profile.sisters_count || 0} Sister(s)</span>
            </div>
            {profile.about_family && (
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">About Family:</span>
                <p className="text-slate-700 bg-ivory-200 p-3 rounded-xl leading-relaxed">
                  {profile.about_family}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Section 3: Education & Career */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-gold-600" />
            <h3 className="font-serif font-bold text-lg text-navy-950">Education & Career</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Highest Degree:</span>
              <span className="font-semibold text-navy-900">{profile.education_level}</span>
            </div>
            {profile.education_field && (
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Specialization:</span>
                <span className="font-semibold text-navy-900">{profile.education_field}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Occupation:</span>
              <span className="font-semibold text-navy-900">{profile.occupation}</span>
            </div>
            {profile.annual_income_range && (
              <div className="flex justify-between py-1.5 border-b border-slate-50">
                <span className="text-slate-500">Annual Income Range:</span>
                <span className="font-semibold text-navy-900">{profile.annual_income_range}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Languages Known:</span>
              <span className="font-semibold text-navy-900">{profile.languages_spoken || 'Punjabi, Hindi, English'}</span>
            </div>
          </div>
        </div>

        {/* Section 4: Marriage Preferences & Expectations */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Heart className="w-5 h-5 text-rose-600" />
            <h3 className="font-serif font-bold text-lg text-navy-950">Partner Expectations</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Preferred Age:</span>
              <span className="font-semibold text-navy-900">{profile.min_age || 20} to {profile.max_age || 35} years</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-50">
              <span className="text-slate-500">Preferred Denominations:</span>
              <span className="font-semibold text-navy-900">{profile.preferred_denominations || 'Any Bible-Believing Christian'}</span>
            </div>
            {profile.general_expectations && (
              <div className="pt-2">
                <span className="text-slate-500 block mb-1">Expectations in a Life Partner:</span>
                <p className="text-slate-700 bg-ivory-200 p-3 rounded-xl leading-relaxed">
                  {profile.general_expectations}
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Privacy Notice Shield */}
      <div className="bg-navy-900 text-white rounded-3xl p-6 border border-navy-800 flex items-start gap-3">
        <Lock className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-gold-300">Contact Information Shielded</p>
          <p className="text-slate-300 leading-relaxed">
            Personal contact details: <span className="font-mono bg-navy-950 px-2 py-0.5 rounded text-gold-400">{profile.mobile_number}</span> & <span className="font-mono bg-navy-950 px-2 py-0.5 rounded text-gold-400">{profile.email}</span>. Direct communication is enabled once both candidates confirm mutual interest and request church facilitation.
          </p>
        </div>
      </div>

      {/* Express Interest Modal */}
      {interestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-serif font-bold text-xl text-navy-950">Express Matrimonial Interest</h3>
            <p className="text-xs text-slate-500">
              Send a polite introductory message to {profile.first_name}. If accepted, a church-facilitated introduction can be requested.
            </p>

            {interestSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold border border-emerald-200 text-center">
                ✓ Interest sent successfully!
              </div>
            ) : (
              <form onSubmit={handleSendInterest} className="space-y-4">
                <textarea
                  rows={3}
                  value={interestMessage}
                  onChange={(e) => setInterestMessage(e.target.value)}
                  className="w-full text-xs p-3 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setInterestModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingInterest}
                    className="px-6 py-2 rounded-xl bg-navy-900 text-white text-xs font-semibold hover:bg-navy-800 flex items-center gap-1.5"
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

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle size={20} />
              <h3 className="font-serif font-bold text-lg text-navy-950">Report Profile to Church Admin</h3>
            </div>

            {reportSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-xs font-semibold border border-emerald-200 text-center">
                ✓ Confidential report submitted for review.
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                  >
                    <option value="MISLEADING_INFO">Misleading Information</option>
                    <option value="INAPPROPRIATE_CONTENT">Inappropriate Content</option>
                    <option value="FAKE_PROFILE">Fake Profile</option>
                    <option value="HARASSMENT">Harassment / Disrespect</option>
                    <option value="FRAUD_SCAM">Fraud or Financial Request</option>
                    <option value="ALREADY_MARRIED">Already Married</option>
                    <option value="OTHER">Other Reason</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Details for Pastoral Committee</label>
                  <textarea
                    rows={3}
                    required
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="Provide context for our review..."
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Printable Bio-Data PDF Modal */}
      {biodataModalOpen && (
        <PrintableBiodataModal
          profile={profile}
          onClose={() => setBiodataModalOpen(false)}
        />
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
