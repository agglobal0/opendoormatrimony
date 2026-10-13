import React from 'react';
import { Church, Heart, ShieldCheck, Users, BookOpen } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function About() {
  const { settings } = useSettings();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Our Ministry & Mission</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy-950">About Open Door Matrimony</h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          A dedicated Christian Marriage Bureau managed under the leadership of {settings.church_name || 'The Open Door Church, Khojewala, Punjab'}.
        </p>
      </div>

      {/* Main Vision Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-soft space-y-6">
        <h2 className="font-serif text-2xl font-bold text-navy-900 flex items-center gap-3">
          <Church className="text-gold-600" />
          <span>Our Vision for Christian Marriage</span>
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          In Christian tradition, marriage is not merely a social arrangement or a casual contract; it is a sacred covenant instituted by God Almighty. The Open Door Church established this matrimonial platform to provide Christian sons, daughters, and their families a safe, respectful, and prayer-oriented ecosystem to discover life partners who share the same faith, moral values, and devotion to Christ.
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          Unlike commercial dating applications or secular matrimonial websites, our bureau is strictly church-supervised, privacy-protected, and committed to biblical principles of holy matrimony, family honor, and mutual respect.
        </p>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-600">
            <BookOpen size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-900">Scriptural Foundation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Encouraging relationships rooted in biblical faith, unconditional love, prayer, and spiritual commitment.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600">
            <ShieldCheck size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-900">Pastoral Verification</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Carefully verifying member backgrounds, church membership, and pastoral references before granting approval.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-300 flex items-center justify-center text-navy-900">
            <Users size={20} />
          </div>
          <h3 className="font-serif font-bold text-lg text-navy-900">Family Dignity</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Respecting the wisdom and blessings of parents and church elders in the sacred matchmaking process.
          </p>
        </div>
      </div>

      {/* Church Details Callout */}
      <div className="bg-gradient-to-r from-navy-900 to-navy-950 rounded-3xl p-8 text-white space-y-4">
        <h3 className="font-serif font-bold text-xl text-gold-400">The Open Door Church, Khojewala</h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          The Open Door Church in Khojewala, Punjab, serves thousands of believers across North India and international diaspora fellowships. Our Marriage Bureau functions as a benevolent ministry to protect young men and women from secular compromises and guide them toward honorable, blessed marriages.
        </p>
        <div className="pt-2">
          <a
            href={settings.church_website || 'https://theopendoorchurch.org'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-gold-400 hover:text-gold-300"
          >
            <span>Learn more on our official church portal</span>
            <span>→</span>
          </a>
        </div>
      </div>

    </div>
  );
}
