import React from 'react';
import { Church, ShieldCheck, Printer, X, Heart, MapPin, Briefcase, GraduationCap, Users, Calendar, Phone, Mail, Award, Sparkles } from 'lucide-react';
import VerificationBadge from './VerificationBadge';

export default function PrintableBiodataModal({ profile, onClose }) {
  if (!profile) return null;

  const handlePrint = () => {
    window.print();
  };

  const defaultPhoto = profile.gender === 'FEMALE'
    ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80'
    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-navy-950/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Container Dialog */}
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 my-auto max-h-[92vh] flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full">
        
        {/* Top Floating Control Bar (Hidden when printing) */}
        <div className="px-6 py-3.5 bg-navy-900 text-white flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-gold-400" />
            <span className="font-serif font-bold text-sm tracking-wide">
              Christian Matrimonial Bio-Data Document
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs flex items-center gap-1.5 shadow-gold transition-all"
            >
              <Printer size={14} />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Sheet Body */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 print:p-6 print:overflow-visible font-sans text-slate-800 bg-white" id="printable-biodata">
          
          {/* 1. CHURCH BUREAU OFFICIAL HEADER */}
          <div className="border-b-2 border-gold-500 pb-4 text-center space-y-1.5 relative">
            <div className="flex items-center justify-center gap-2 text-navy-950">
              <div className="w-9 h-9 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center shadow-xs">
                <Church size={20} />
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-navy-950">
                THE OPEN DOOR CHURCH
              </h1>
            </div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-gold-700">
              Christian Matrimonial Bureau • Khojewala, Kapurthala - Jalandhar Road, Punjab, India
            </p>
            <div className="pt-1">
              <p className="font-serif italic text-xs text-slate-600 bg-gold-50/80 py-1 px-4 rounded-full inline-block border border-gold-200">
                “Therefore what God has joined together, let no one separate.” — Mark 10:9
              </p>
            </div>
          </div>

          {/* 2. CANDIDATE PROFILE BANNER */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-200/90 relative">
            {/* Candidate Photo */}
            <div className="relative w-32 h-36 rounded-2xl overflow-hidden bg-white border-2 border-gold-400 shadow-soft shrink-0">
              <img
                src={profile.profile_photo || defaultPhoto}
                alt={profile.first_name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = defaultPhoto;
                }}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-1 right-1">
                <VerificationBadge status={profile.verification_status || 'VERIFIED'} showText={false} size="sm" />
              </div>
            </div>

            {/* Core Candidate Title */}
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                <h2 className="font-serif text-2xl font-bold text-navy-950">
                  {profile.first_name} {profile.last_name}
                </h2>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  ✓ Church Verified Believer
                </span>
              </div>

              <p className="text-xs text-slate-600 font-medium flex items-center justify-center sm:justify-start gap-1.5">
                <MapPin size={13} className="text-gold-600 shrink-0" />
                <span>{profile.city}, {profile.state}, {profile.country || 'India'}</span>
              </p>

              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Age / Gender</span>
                  <span className="font-bold text-navy-950">{profile.age || '27'} yrs • {profile.gender === 'MALE' ? 'Groom' : 'Bride'}</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Height</span>
                  <span className="font-bold text-navy-950">
                    {profile.height_cm || 175} cm ({Math.floor((profile.height_cm || 175) / 30.48)} ft {Math.round(((profile.height_cm || 175) % 30.48) / 2.54)} in)
                  </span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Marital Status</span>
                  <span className="font-bold text-navy-950">{profile.marital_status ? profile.marital_status.replace('_', ' ') : 'Never Married'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. STRUCTURED BIO-DATA SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            
            {/* Section A: Education & Profession */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 text-navy-950 font-serif font-bold text-sm">
                <Briefcase size={16} className="text-gold-600" />
                <span>Education & Occupation</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <p><strong>Highest Education:</strong> {profile.education_level || 'Graduate'}</p>
                <p><strong>Specialization:</strong> {profile.education_field || 'Professional Studies'}</p>
                <p><strong>Current Occupation:</strong> {profile.occupation || 'Professional'}</p>
                <p><strong>Employment Sector:</strong> {profile.employed_in ? profile.employed_in.replace('_', ' ') : 'Private Sector'}</p>
                <p><strong>Annual Income:</strong> {profile.annual_income_range || 'Confidential / As per industry'}</p>
                <p><strong>Languages Spoken:</strong> {profile.languages_spoken || 'Punjabi, Hindi, English'}</p>
              </div>
            </div>

            {/* Section B: Faith & Church Ministry */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 text-navy-950 font-serif font-bold text-sm">
                <Church size={16} className="text-gold-600" />
                <span>Christian Faith & Church Walk</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <p><strong>Church Membership:</strong> {profile.church_name || 'The Open Door Church, Khojewala'}</p>
                <p><strong>Denomination:</strong> {profile.denomination || 'Evangelical / Pentecostal'}</p>
                <p><strong>Water Baptism:</strong> Confirmed Believer's Baptism ✓</p>
                <p><strong>Born Again Journey:</strong> {profile.born_again_year ? `Walking with Christ since ${profile.born_again_year}` : 'Devoted Born-Again Believer'}</p>
                <p><strong>Ministry Involvement:</strong> {profile.ministry_involvement || 'Active in church fellowship & worship'}</p>
                <p><strong>Pastor Reference:</strong> {profile.pastor_reference_name || 'Pastor Harpreet Masih'} ({profile.pastor_reference_phone || 'Verified by Bureau'})</p>
              </div>
            </div>

            {/* Section C: Family Background */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 text-navy-950 font-serif font-bold text-sm">
                <Users size={16} className="text-gold-600" />
                <span>Family & Heritage</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <p><strong>Father's Occupation:</strong> {profile.father_occupation || 'Business / Retired'}</p>
                <p><strong>Mother's Occupation:</strong> {profile.mother_occupation || 'Homemaker'}</p>
                <p><strong>Family Type:</strong> {profile.family_type ? profile.family_type.replace('_', ' ') : 'Nuclear Family'}</p>
                <p><strong>Family Values:</strong> {profile.family_values ? profile.family_values.replace('_', ' ') : 'Traditional Born-Again Christian'}</p>
                <p><strong>Siblings:</strong> {profile.brothers_count || 0} Brother(s), {profile.sisters_count || 0} Sister(s)</p>
                <p><strong>Hometown / Origin:</strong> {profile.family_location || `${profile.city || 'Punjab'}, India`}</p>
              </div>
            </div>

            {/* Section D: Partner Expectations */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex items-center gap-1.5 pb-1.5 border-b border-slate-100 text-navy-950 font-serif font-bold text-sm">
                <Heart size={16} className="text-gold-600" />
                <span>Desired Partner Expectations</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <p><strong>Age Preference:</strong> {profile.min_age || 21} - {profile.max_age || 32} Years</p>
                <p><strong>Height Preference:</strong> {profile.min_height_cm || 155} - {profile.max_height_cm || 188} cm</p>
                <p><strong>Preferred Denomination:</strong> {profile.preferred_denominations || 'Evangelical / Born-Again Believers'}</p>
                <p><strong>Preferred Location:</strong> {profile.preferred_locations || 'Punjab / North India / NRI Open'}</p>
                <p><strong>Spiritual Expectation:</strong> Sincere, God-fearing Christian dedicated to family values and Christ.</p>
              </div>
            </div>

          </div>

          {/* 4. CANDIDATE BIO & TESTIMONY */}
          {profile.about_me && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <h4 className="font-bold text-navy-950 font-serif">Personal Statement & Faith Testimony:</h4>
              <p className="text-slate-600 italic leading-relaxed">
                "{profile.about_me}"
              </p>
            </div>
          )}

          {/* 5. OFFICIAL BUREAU FOOTER WATERMARK */}
          <div className="pt-4 border-t-2 border-slate-200 text-center space-y-1 text-[10px] text-slate-500">
            <p className="font-semibold text-navy-950">
              Open Door Matrimony • The Open Door Church, Khojewala Matrimonial Bureau
            </p>
            <p>
              This official bio-data document is issued for prayerful Christian matrimonial introduction. Contact details remain confidential until pastoral facilitation.
            </p>
            <p className="text-gold-700 font-medium">
              Web: https://theopendoorchurch.org • Email: matrimony@theopendoorchurch.org
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
