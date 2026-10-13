import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Church, CheckCircle2, ArrowRight, ArrowLeft, Upload, ShieldCheck, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export default function Register() {
  const { register } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [photoPreview, setPhotoPreview] = useState(null);

  const [formData, setFormData] = useState({
    // Step 1: Basic
    first_name: '',
    last_name: '',
    email: '',
    mobile_number: '',
    password: '',
    confirm_password: '',
    gender: 'MALE',
    dob: '1998-01-01',
    city: 'Jalandhar',
    state: 'Punjab',
    country: 'India',

    // Step 2: Personal
    height_cm: 175,
    marital_status: 'NEVER_MARRIED',
    mother_tongue: 'Punjabi',
    languages_spoken: 'Punjabi, Hindi, English',
    education_level: 'Graduate',
    education_field: 'Computer Applications / IT',
    occupation: 'Software Engineer',
    employed_in: 'PRIVATE_SECTOR',
    annual_income_range: 'Rs. 10 - 15 Lakhs',
    about_me: '',

    // Step 3: Faith
    church_name: 'The Open Door Church, Khojewala',
    denomination: 'Evangelical / Pentecostal',
    is_baptized: true,
    born_again_year: 2016,
    church_involvement: 'Active in choir & worship',
    ministry_involvement: '',
    faith_description: 'Born again Christian walking faithfully with the Lord.',
    pastor_reference_name: '',
    pastor_reference_phone: '',

    // Step 4: Family
    father_occupation: 'Senior Officer (Retd)',
    mother_occupation: 'Homemaker',
    brothers_count: 1,
    sisters_count: 0,
    family_type: 'NUCLEAR',
    family_values: 'TRADITIONAL_CHRISTIAN',
    about_family: 'God-fearing family with strong Christian morals.',

    // Step 5: Preferences
    min_age: 22,
    max_age: 30,
    preferred_marital_status: 'NEVER_MARRIED',
    preferred_denominations: 'Evangelical, Pentecostal, CNI',
    general_expectations: 'Seeking a sincere born-again believer who loves God and family.',

    // Step 6: Photo URL / default
    profile_photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!formData.first_name || !formData.last_name || !formData.email || !formData.mobile_number || !formData.password) {
        setErrorMsg('Please fill in all required basic account details.');
        return;
      }
      if (formData.password !== formData.confirm_password) {
        setErrorMsg('Passwords do not match.');
        return;
      }
    }

    setStep(prev => Math.min(6, prev + 1));
  };

  const handlePrev = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result;
        setPhotoPreview(base64Url);
        setFormData(prev => ({ ...prev, profile_photo: base64Url }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await register(formData);
      if (res.success) {
        navigate('/dashboard');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const stepTitles = [
    'Basic Account',
    'Personal Information',
    'Christian & Faith',
    'Family Background',
    'Marriage Preferences',
    'Profile Photo'
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-card space-y-8">
        
        {/* Header & Step Indicator */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-50 border border-gold-300 text-gold-800 text-xs font-semibold">
            <Church size={14} className="text-gold-600" />
            <span>{settings.church_name || 'The Open Door Church Matrimony'}</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-navy-950">Member Registration</h1>
          <p className="text-xs text-slate-500">Step {step} of 6: {stepTitles[step - 1]}</p>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gold-500 h-full transition-all duration-300 rounded-full"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={step === 6 ? handleSubmit : handleNext} className="space-y-6">
          
          {/* STEP 1: Basic Account */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="first_name"
                    required
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="e.g. Joshua"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="last_name"
                    required
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="e.g. Masih"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number (Confidential) *</label>
                  <input
                    type="tel"
                    name="mobile_number"
                    required
                    value={formData.mobile_number}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="+91 98765 00000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="Min 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirm_password"
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender *</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                  >
                    <option value="MALE">Christian Groom (Male)</option>
                    <option value="FEMALE">Christian Bride (Female)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    name="dob"
                    required
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    name="height_cm"
                    value={formData.height_cm}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                    placeholder="175"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Marital Status</label>
                  <select
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                  >
                    <option value="NEVER_MARRIED">Never Married</option>
                    <option value="DIVORCED">Divorced (Legally)</option>
                    <option value="WIDOWED">Widowed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mother Tongue</label>
                  <input
                    type="text"
                    name="mother_tongue"
                    value={formData.mother_tongue}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Education Level *</label>
                  <input
                    type="text"
                    name="education_level"
                    required
                    value={formData.education_level}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                    placeholder="e.g. B.Tech / M.B.B.S / Masters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Occupation / Career *</label>
                  <input
                    type="text"
                    name="occupation"
                    required
                    value={formData.occupation}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                    placeholder="e.g. Senior Software Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">About Me & Personal Christian Walk</label>
                <textarea
                  name="about_me"
                  rows={3}
                  value={formData.about_me}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  placeholder="Describe your character, interests, and aspirations..."
                />
              </div>
            </div>
          )}

          {/* STEP 3: Christian / Faith Information */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Church Name *</label>
                  <input
                    type="text"
                    name="church_name"
                    required
                    value={formData.church_name}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Denomination *</label>
                  <input
                    type="text"
                    name="denomination"
                    required
                    value={formData.denomination}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pastor Reference Name</label>
                  <input
                    type="text"
                    name="pastor_reference_name"
                    value={formData.pastor_reference_name}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                    placeholder="Pastor Harpreet Masih"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pastor Contact Phone</label>
                  <input
                    type="tel"
                    name="pastor_reference_phone"
                    value={formData.pastor_reference_phone}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                    placeholder="+91 98140 00000"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_baptized"
                  name="is_baptized"
                  checked={formData.is_baptized}
                  onChange={handleChange}
                  className="rounded border-slate-300 text-navy-900 focus:ring-navy-600"
                />
                <label htmlFor="is_baptized" className="text-xs font-medium text-slate-700">
                  Water Baptized believer in Christ
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Family Information */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Father's Occupation</label>
                  <input
                    type="text"
                    name="father_occupation"
                    value={formData.father_occupation}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mother's Occupation</label>
                  <input
                    type="text"
                    name="mother_occupation"
                    value={formData.mother_occupation}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Family Type</label>
                  <select
                    name="family_type"
                    value={formData.family_type}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                  >
                    <option value="NUCLEAR">Nuclear Family</option>
                    <option value="JOINT">Joint Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Family Values</label>
                  <select
                    name="family_values"
                    value={formData.family_values}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                  >
                    <option value="TRADITIONAL_CHRISTIAN">Traditional Christian Values</option>
                    <option value="MODERATE">Moderate / Modern Christian</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Marriage Preferences */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Min Preferred Age</label>
                  <input
                    type="number"
                    name="min_age"
                    value={formData.min_age}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Max Preferred Age</label>
                  <input
                    type="number"
                    name="max_age"
                    value={formData.max_age}
                    onChange={handleChange}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">General Marriage Expectations</label>
                <textarea
                  name="general_expectations"
                  rows={3}
                  value={formData.general_expectations}
                  onChange={handleChange}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                  placeholder="What qualities and spiritual values are you praying for in a spouse?"
                />
              </div>
            </div>
          )}

          {/* STEP 6: Profile Photo */}
          {step === 6 && (
            <div className="space-y-6 text-center">
              <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-4 border-gold-400 shadow-soft bg-slate-100 flex items-center justify-center">
                <img
                  src={photoPreview || formData.profile_photo}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 text-xs font-semibold cursor-pointer border border-slate-300 transition-colors">
                  <Upload size={14} />
                  <span>Upload Profile Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-500 mt-2">
                  JPG, PNG, or WEBP. All profile photos undergo respectful pastoral verification.
                </p>
              </div>

              <div className="bg-navy-50 p-4 rounded-2xl border border-navy-200 text-left flex items-start gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600">
                  By clicking Register, your profile will be safely created and submitted to The Open Door Church Matrimonial Bureau for review.
                </p>
              </div>
            </div>
          )}

          {/* Nav Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {step < 6 ? (
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-soft flex items-center gap-1.5 transition-colors"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold shadow-gold flex items-center gap-1.5 transition-colors"
              >
                <span>{loading ? 'Submitting Registration...' : 'Complete & Submit Profile'}</span>
                <CheckCircle2 size={15} />
              </button>
            )}
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-navy-900 hover:text-gold-600 underline">
              Member Login
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
