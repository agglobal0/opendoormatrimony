import React from 'react';
import { useSettings } from '../../context/SettingsContext';

export default function Terms() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Bureau Terms</span>
        <h1 className="font-serif text-4xl font-bold text-navy-950">Terms & Conditions of Service</h1>
        <p className="text-sm text-slate-600">Sacred code of conduct and disclaimer for matrimonial participants.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
        <h3 className="font-serif font-bold text-lg text-navy-900">1. Solemn Marriage Intentions</h3>
        <p>
          Open Door Matrimony is exclusively intended for Christian men and women seeking holy matrimony in the presence of God and family. Use of this platform for casual dating, commercial solicitation, harassment, or misrepresentation is strictly prohibited and subject to immediate suspension.
        </p>

        <h3 className="font-serif font-bold text-lg text-navy-900">2. Disclaimers & Independent Caution</h3>
        <p className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900">
          “The platform facilitates matrimonial introductions under church guidance but does not guarantee the personal character, background truthfulness, or future marital outcome of any member. Users and their families must independently exercise due diligence and prayer before proceeding to marriage.”
        </p>

        <h3 className="font-serif font-bold text-lg text-navy-900">3. Verification & Pastoral Oversight</h3>
        <p>
          {settings.church_name || 'The Open Door Church, Khojewala'} reserves the right to review, reject, or request amendments to any registration that does not adhere to the Christian tenets and ethical guidelines of the ministry.
        </p>
      </div>
    </div>
  );
}
