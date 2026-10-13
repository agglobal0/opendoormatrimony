import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Church, User, Users, Heart, Camera, Upload, CheckCircle2, 
  Save, Eye, Sparkles, AlertCircle, ShieldCheck, Image as ImageIcon,
  MapPin, Briefcase, GraduationCap, Check
} from 'lucide-react';
import VerificationBadge from '../../components/common/VerificationBadge';
import api from '../../services/api';



export default function EditProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('photo');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');

  const [formData, setFormData] = useState({
    profile_photo: '',
    first_name: '',
    last_name: '',
    gender: 'MALE',
    dob: '',
    height_cm: 170,
    marital_status: 'NEVER_MARRIED',
    mother_tongue: 'Punjabi',
    languages_spoken: 'Punjabi, Hindi, English',
    education_level: '',
    education_field: '',
    occupation: '',
    employed_in: 'PRIVATE_SECTOR',
    annual_income_range: '',
    city: '',
    state: '',
    country: 'India',
    about_me: '',

    // Faith
    church_name: '',
    denomination: '',
    is_baptized: true,
    born_again_year: '',
    church_involvement: '',
    ministry_involvement: '',
    faith_description: '',
    pastor_reference_name: '',
    pastor_reference_phone: '',

    // Family
    father_occupation: '',
    mother_occupation: '',
    brothers_count: 0,
    sisters_count: 0,
    family_type: 'NUCLEAR',
    family_values: 'TRADITIONAL_CHRISTIAN',
    family_location: '',
    about_family: '',

    // Preferences
    min_age: 20,
    max_age: 35,
    min_height_cm: 150,
    max_height_cm: 190,
    preferred_marital_status: 'NEVER_MARRIED',
    preferred_education: '',
    preferred_occupation: '',
    preferred_denominations: '',
    preferred_locations: '',
    general_expectations: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        profile_photo: profile.profile_photo || '',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        gender: profile.gender || 'MALE',
        dob: profile.dob ? profile.dob.split('T')[0] : '',
        height_cm: profile.height_cm || 170,
        marital_status: profile.marital_status || 'NEVER_MARRIED',
        mother_tongue: profile.mother_tongue || 'Punjabi',
        languages_spoken: profile.languages_spoken || 'Punjabi, Hindi, English',
        education_level: profile.education_level || '',
        education_field: profile.education_field || '',
        occupation: profile.occupation || '',
        employed_in: profile.employed_in || 'PRIVATE_SECTOR',
        annual_income_range: profile.annual_income_range || '',
        city: profile.city || '',
        state: profile.state || '',
        country: profile.country || 'India',
        about_me: profile.about_me || '',

        church_name: profile.church_name || 'The Open Door Church, Khojewala',
        denomination: profile.denomination || 'Evangelical / Pentecostal',
        is_baptized: profile.is_baptized !== false,
        born_again_year: profile.born_again_year || '',
        church_involvement: profile.church_involvement || '',
        ministry_involvement: profile.ministry_involvement || '',
        faith_description: profile.faith_description || '',
        pastor_reference_name: profile.pastor_reference_name || 'Pastor Harpreet Masih',
        pastor_reference_phone: profile.pastor_reference_phone || '+91 98140 11111',

        father_occupation: profile.father_occupation || '',
        mother_occupation: profile.mother_occupation || '',
        brothers_count: profile.brothers_count || 0,
        sisters_count: profile.sisters_count || 0,
        family_type: profile.family_type || 'NUCLEAR',
        family_values: profile.family_values || 'TRADITIONAL_CHRISTIAN',
        family_location: profile.family_location || '',
        about_family: profile.about_family || '',

        min_age: profile.min_age || 20,
        max_age: profile.max_age || 35,
        min_height_cm: profile.min_height_cm || 150,
        max_height_cm: profile.max_height_cm || 190,
        preferred_marital_status: profile.preferred_marital_status || 'NEVER_MARRIED',
        preferred_education: profile.preferred_education || '',
        preferred_occupation: profile.preferred_occupation || '',
        preferred_denominations: profile.preferred_denominations || 'Evangelical, Pentecostal, CNI',
        preferred_locations: profile.preferred_locations || 'Punjab, Chandigarh, NRI',
        general_expectations: profile.general_expectations || ''
      }));
      setPhotoPreview(profile.profile_photo || '');
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Instant Base64 photo upload from gallery/device
  const handlePhotoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPhotoPreview(base64String);
        setFormData(prev => ({ ...prev, profile_photo: base64String }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await api.put('/profile/me', formData);
      if (res.data && res.data.success) {
        setSuccessMsg('Your matrimonial profile details and photo have been successfully saved!');
        await refreshProfile();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update profile. Please check your fields.');
    } finally {
      setLoading(false);
    }
  };

  const defaultAvatar = (formData.gender === 'FEMALE' || profile?.gender === 'FEMALE')
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80';

  const tabs = [
    { id: 'photo', name: 'Profile Photo', icon: <Camera size={16} /> },
    { id: 'personal', name: 'Personal & Career', icon: <User size={16} /> },
    { id: 'faith', name: 'Faith & Church', icon: <Church size={16} /> },
    { id: 'family', name: 'Family Background', icon: <Users size={16} /> },
    { id: 'preferences', name: 'Partner Preferences', icon: <Heart size={16} /> }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* 1. TOP HEADER & PROFILE PREVIEW BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative group shrink-0">
            <img
              src={photoPreview || formData.profile_photo || defaultAvatar}
              alt="Profile"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = defaultAvatar;
              }}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-gold-400 shadow-soft"
            />
            <button
              onClick={() => setActiveTab('photo')}
              className="absolute -bottom-2 -right-2 p-1.5 rounded-full bg-navy-900 text-gold-400 hover:bg-gold-500 hover:text-navy-950 border border-gold-300 shadow-xs transition-colors"
              title="Change Profile Photo"
            >
              <Camera size={13} />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-navy-950">
                {formData.first_name || profile?.first_name || 'My'} {formData.last_name || profile?.last_name || 'Profile'}
              </h1>
              <VerificationBadge status={profile?.verification_status || 'VERIFIED'} size="sm" />
            </div>
            <p className="text-xs text-slate-500">
              {formData.occupation || 'Professional'} • {formData.city || 'Punjab'}, {formData.state || 'India'}
            </p>
            <div className="flex items-center gap-3 pt-1">
              <span className="text-[11px] text-gold-700 font-semibold flex items-center gap-1">
                <Sparkles size={12} className="text-gold-500" />
                <span>Profile Completion: {profile?.completion_percentage || 100}%</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to={`/matches/${user?.id || profile?.user_id || profile?.id}`}
            className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Eye size={14} className="text-slate-500" />
            <span>View Public Profile</span>
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-soft flex items-center gap-1.5 transition-colors"
          >
            <Save size={14} className="text-gold-400" />
            <span>{loading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback Messages */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 text-rose-800 rounded-2xl border border-rose-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. TAB NAVIGATION */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === t.id
                ? 'bg-navy-900 text-white shadow-soft scale-[1.02]'
                : 'bg-white text-slate-600 hover:text-navy-950 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {t.icon}
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      {/* 3. TAB FORM CONTAINER */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        
        {/* TAB 1: PROFILE PHOTO MANAGEMENT (GALLERY UPLOAD ONLY) */}
        {activeTab === 'photo' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Profile Picture & Gallery Upload</h2>
              <p className="text-xs text-slate-500">
                Upload your genuine portrait photograph directly from your gallery or computer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left: Active Photo Card */}
              <div className="md:col-span-5 p-6 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="relative w-48 h-48 mx-auto rounded-3xl overflow-hidden border-4 border-gold-400 shadow-card bg-white">
                  <img
                    src={photoPreview || formData.profile_photo || defaultAvatar}
                    alt="Active Preview"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = defaultAvatar;
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <label className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold cursor-pointer shadow-soft hover:shadow-md transition-all">
                    <Upload size={15} className="text-gold-400" />
                    <span>Choose Photo from Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoFileChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Supports JPG, PNG, WEBP (Instant device upload)
                  </p>
                </div>
              </div>

              {/* Right: Pastoral Photo Guidelines & Privacy Notes */}
              <div className="md:col-span-7 space-y-4">
                <div className="p-6 rounded-3xl bg-gold-50/70 border border-gold-200 space-y-3">
                  <h4 className="text-xs font-bold text-gold-950 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-gold-600" />
                    <span>Church Pastoral Photo Guidelines</span>
                  </h4>
                  <ul className="text-xs text-gold-900 space-y-2 list-disc list-inside leading-relaxed">
                    <li>Choose a clear, front-facing single portrait with good lighting.</li>
                    <li>Ensure modest, respectful Christian attire suitable for holy matrimony.</li>
                    <li>Avoid group photographs or heavily filtered screenshots.</li>
                    <li>Your photograph is respectfully protected under church privacy standards.</li>
                  </ul>
                </div>

                {photoPreview && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                    <div className="text-xs text-emerald-900">
                      <p className="font-bold">Photo ready to save</p>
                      <p className="text-[11px] text-emerald-800">Click <strong>"Save Profile Changes"</strong> below to update your live profile across the platform.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PERSONAL & CAREER */}
        {activeTab === 'personal' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Personal Background & Profession</h2>
              <p className="text-xs text-slate-500">Provide accurate details regarding your lifestyle, education, career, and personal testimony.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Height (in cm)</label>
                <input
                  type="number"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Marital Status</label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                >
                  <option value="NEVER_MARRIED">Never Married</option>
                  <option value="WIDOWED">Widowed</option>
                  <option value="DIVORCED">Divorced</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mother Tongue</label>
                <input
                  type="text"
                  name="mother_tongue"
                  value={formData.mother_tongue}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Languages Spoken</label>
                <input
                  type="text"
                  name="languages_spoken"
                  value={formData.languages_spoken}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Highest Education Level</label>
                <input
                  type="text"
                  name="education_level"
                  value={formData.education_level}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech / M.Sc / Graduate"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Education Field / Degree</label>
                <input
                  type="text"
                  name="education_field"
                  value={formData.education_field}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science / Healthcare"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Occupation / Job Title</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer / Staff Nurse"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Income Range</label>
                <input
                  type="text"
                  name="annual_income_range"
                  value={formData.annual_income_range}
                  onChange={handleChange}
                  placeholder="e.g. Rs. 15 - 20 Lakhs"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">State / Province</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">About Me (Personal Biography & Values)</label>
                <textarea
                  name="about_me"
                  rows={4}
                  value={formData.about_me}
                  onChange={handleChange}
                  placeholder="Share a brief introduction about your character, hobbies, daily life, and what you cherish..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FAITH & CHURCH */}
        {activeTab === 'faith' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Christian Faith & Church Details</h2>
              <p className="text-xs text-slate-500">Document your baptism records, home church, and pastor reference for official matrimonial verification.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Home Church Name</label>
                <input
                  type="text"
                  name="church_name"
                  value={formData.church_name}
                  onChange={handleChange}
                  placeholder="e.g. The Open Door Church, Khojewala"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Christian Denomination</label>
                <input
                  type="text"
                  name="denomination"
                  value={formData.denomination}
                  onChange={handleChange}
                  placeholder="e.g. Evangelical / Pentecostal / CNI / Baptist"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <input
                  type="checkbox"
                  id="is_baptized"
                  name="is_baptized"
                  checked={formData.is_baptized}
                  onChange={handleChange}
                  className="w-4 h-4 text-navy-900 rounded focus:ring-navy-600"
                />
                <label htmlFor="is_baptized" className="font-bold text-slate-800 text-xs cursor-pointer">
                  Water Baptized believer by immersion
                </label>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Year Born Again (Saved)</label>
                <input
                  type="number"
                  name="born_again_year"
                  value={formData.born_again_year}
                  onChange={handleChange}
                  placeholder="e.g. 2016"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Church & Ministry Involvement</label>
                <input
                  type="text"
                  name="church_involvement"
                  value={formData.church_involvement}
                  onChange={handleChange}
                  placeholder="e.g. Worship team, youth ministry, Sunday school"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pastor Reference Name</label>
                <input
                  type="text"
                  name="pastor_reference_name"
                  value={formData.pastor_reference_name}
                  onChange={handleChange}
                  placeholder="e.g. Pastor Harpreet Masih"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pastor Reference Phone / Mobile</label>
                <input
                  type="tel"
                  name="pastor_reference_phone"
                  value={formData.pastor_reference_phone}
                  onChange={handleChange}
                  placeholder="e.g. +91 98140 11111"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Personal Faith Testimony & Spiritual Walk</label>
                <textarea
                  name="faith_description"
                  rows={3}
                  value={formData.faith_description}
                  onChange={handleChange}
                  placeholder="Describe your faith in Jesus Christ, prayer life, and church dedication..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FAMILY BACKGROUND */}
        {activeTab === 'family' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Family Background & Household Values</h2>
              <p className="text-xs text-slate-500">Provide respectful background information about your parents and siblings.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Father's Occupation</label>
                <input
                  type="text"
                  name="father_occupation"
                  value={formData.father_occupation}
                  onChange={handleChange}
                  placeholder="e.g. Senior Officer (Retd) / Business"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mother's Occupation</label>
                <input
                  type="text"
                  name="mother_occupation"
                  value={formData.mother_occupation}
                  onChange={handleChange}
                  placeholder="e.g. Teacher / Homemaker"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Brothers Count</label>
                <input
                  type="number"
                  name="brothers_count"
                  value={formData.brothers_count}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sisters Count</label>
                <input
                  type="number"
                  name="sisters_count"
                  value={formData.sisters_count}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Family Structure Type</label>
                <select
                  name="family_type"
                  value={formData.family_type}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                >
                  <option value="NUCLEAR">Nuclear Family</option>
                  <option value="JOINT">Joint Family</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Family Location</label>
                <input
                  type="text"
                  name="family_location"
                  value={formData.family_location}
                  onChange={handleChange}
                  placeholder="e.g. Jalandhar, Punjab"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">About Family & Cultural Heritage</label>
                <textarea
                  name="about_family"
                  rows={3}
                  value={formData.about_family}
                  onChange={handleChange}
                  placeholder="Briefly describe family atmosphere and Christian traditions..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PARTNER PREFERENCES */}
        {activeTab === 'preferences' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h2 className="font-serif text-xl font-bold text-navy-950">Marriage & Partner Preferences</h2>
              <p className="text-xs text-slate-500">Specify preferences for candidate compatibility calculation.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Minimum Age</label>
                <input
                  type="number"
                  name="min_age"
                  value={formData.min_age}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Maximum Age</label>
                <input
                  type="number"
                  name="max_age"
                  value={formData.max_age}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Denominations</label>
                <input
                  type="text"
                  name="preferred_denominations"
                  value={formData.preferred_denominations}
                  onChange={handleChange}
                  placeholder="e.g. Evangelical, Pentecostal, CNI"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Location / Region</label>
                <input
                  type="text"
                  name="preferred_locations"
                  value={formData.preferred_locations}
                  onChange={handleChange}
                  placeholder="e.g. Punjab, Chandigarh, NRI"
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-navy-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">General Expectations in a Life Partner</label>
                <textarea
                  name="general_expectations"
                  rows={3}
                  value={formData.general_expectations}
                  onChange={handleChange}
                  placeholder="What qualities and spiritual virtues are most important to you in a godly spouse?..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-navy-600"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Button Row */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>All updates are synchronized securely with your church bureau record.</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-soft flex items-center gap-2 transition-colors"
          >
            <Save size={14} className="text-gold-400" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
