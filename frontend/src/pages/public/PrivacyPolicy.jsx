import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function PrivacyPolicy() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Privacy Protection</span>
        <h1 className="font-serif text-4xl font-bold text-navy-950">Privacy Policy & Contact Protection</h1>
        <p className="text-sm text-slate-600">How Open Door Matrimony protects Christian member privacy and data dignity.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="font-serif font-bold text-lg text-navy-900">1. Contact Information Shield</h3>
        <p>
          We never publicly disclose member mobile numbers, email addresses, or precise residential addresses. These credentials remain strictly hidden until both parties express mutual interest and request pastoral facilitation.
        </p>

        <h3 className="font-serif font-bold text-lg text-navy-900">2. Pastoral Supervision & Data Usage</h3>
        <p>
          Information submitted during registration (faith description, baptism details, educational credentials, family background) is accessible solely to authorized administrative committee members of {settings.church_name || 'The Open Door Church, Khojewala'} for verification and matching purposes.
        </p>

        <h3 className="font-serif font-bold text-lg text-navy-900">3. Search Engine Non-Indexing (Noindex)</h3>
        <p>
          Personal profile details are shielded from public web crawlers and search engine scraping. Private profiles are accessible only within the authenticated, verified member directory.
        </p>

        <h3 className="font-serif font-bold text-lg text-navy-900">4. Right to Deletion</h3>
        <p>
          Any member may at any time request full profile deletion or temporary dormancy through their account settings or by contacting the church bureau directly at {settings.contact_email || 'matrimony@theopendoorchurch.org'}.
        </p>
      </div>
    </div>
  );
}
