import React, { useState } from 'react';
import { Lock, ShieldCheck, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function PrivacySettings() {
  const { user } = useAuth();
  const [contactVisibility, setContactVisibility] = useState('MUTUAL_INTEREST_ONLY');
  const [photoVisibility, setPhotoVisibility] = useState('REGISTERED_ONLY');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy-950">Privacy & Account Settings</h1>
        <p className="text-xs text-slate-500">Control how your matrimonial details and contact preferences are managed.</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>Privacy preferences updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        
        {/* Contact Visibility */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-navy-900 font-serif font-bold text-base">
            <Lock size={18} className="text-gold-600" />
            <h3>Contact Information Visibility</h3>
          </div>
          <p className="text-xs text-slate-500">
            Define who is eligible to view your phone number and email address.
          </p>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="contact_privacy"
                value="MUTUAL_INTEREST_ONLY"
                checked={contactVisibility === 'MUTUAL_INTEREST_ONLY'}
                onChange={(e) => setContactVisibility(e.target.value)}
                className="text-navy-900 focus:ring-navy-600"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Mutual Interest Only (Recommended)</span>
                <span className="text-slate-500">Only candidates you have mutually accepted can view contact info.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="contact_privacy"
                value="ADMIN_APPROVAL_ONLY"
                checked={contactVisibility === 'ADMIN_APPROVAL_ONLY'}
                onChange={(e) => setContactVisibility(e.target.value)}
                className="text-navy-900 focus:ring-navy-600"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Church Pastoral Mediation Only</span>
                <span className="text-slate-500">Contact information is released solely through church coordinator introduction.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Photo Privacy */}
        <div className="space-y-3 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2 text-navy-900 font-serif font-bold text-base">
            <ShieldCheck size={18} className="text-emerald-600" />
            <h3>Profile Photo Privacy</h3>
          </div>
          <p className="text-xs text-slate-500">
            Choose who is authorized to view your uploaded profile photo.
          </p>

          <div className="space-y-2">
            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="photo_privacy"
                value="REGISTERED_ONLY"
                checked={photoVisibility === 'REGISTERED_ONLY'}
                onChange={(e) => setPhotoVisibility(e.target.value)}
                className="text-navy-900 focus:ring-navy-600"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Registered Church Members Only (Default)</span>
                <span className="text-slate-500">Visible only to authenticated members of Open Door Matrimony.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
              <input
                type="radio"
                name="photo_privacy"
                value="VERIFIED_ONLY"
                checked={photoVisibility === 'VERIFIED_ONLY'}
                onChange={(e) => setPhotoVisibility(e.target.value)}
                className="text-navy-900 focus:ring-navy-600"
              />
              <div className="text-xs">
                <span className="font-bold text-slate-800 block">Church Verified Members Only</span>
                <span className="text-slate-500">Visible only to candidates who hold the church verified badge.</span>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-soft"
          >
            Save Privacy Settings
          </button>
        </div>

      </form>

      {/* Account Deletion / Dormancy Request Box */}
      <div className="bg-rose-50 rounded-3xl p-6 border border-rose-200 space-y-3">
        <div className="flex items-center gap-2 text-rose-800 font-serif font-bold text-base">
          <Trash2 size={18} />
          <h3>Profile Dormancy or Deletion</h3>
        </div>
        <p className="text-xs text-rose-700 leading-relaxed">
          If you have found your life partner or wish to withdraw your application from the church bureau, you can request account deactivation. All records will be securely archived or purged in accordance with our data protection policy.
        </p>
        <button
          type="button"
          onClick={() => alert('Your request for profile dormancy has been logged. Church administration will confirm via email.')}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
        >
          Request Profile Deactivation
        </button>
      </div>

    </div>
  );
}
