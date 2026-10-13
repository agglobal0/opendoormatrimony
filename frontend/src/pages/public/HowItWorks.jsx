import React from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, ShieldCheck, Heart, Users, Lock, ArrowRight, Church } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function HowItWorks() {
  const { isAuthenticated } = useAuth();
  const steps = [
    {
      num: '01',
      title: 'Create Your Free Profile',
      desc: 'Complete the structured registration with your education, profession, family background, and Christian faith journey.',
      icon: <UserCheck className="w-8 h-8 text-gold-600" />
    },
    {
      num: '02',
      title: 'Church Pastoral Verification',
      desc: 'Our bureau committee reviews submitted details, cross-verifies church attendance, and awards the trusted Verified badge.',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-600" />
    },
    {
      num: '03',
      title: 'Discover Compatible Matches',
      desc: 'Browse verified Christian brothers and sisters using transparent compatibility scores, denomination, and lifestyle preferences.',
      icon: <Heart className="w-8 h-8 text-rose-600" />
    },
    {
      num: '04',
      title: 'Connect with Family Blessing',
      desc: 'Send an express interest. Once mutual consent is established, request a church-facilitated family introduction.',
      icon: <Users className="w-8 h-8 text-navy-600" />
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Guided Process</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy-950">How Open Door Matrimony Works</h1>
        <p className="text-sm sm:text-base text-slate-600">
          A dignified, prayer-oriented process ensuring privacy, church supervision, and family peace of mind.
        </p>
      </div>

      <div className="space-y-8">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft flex flex-col md:flex-row items-start md:items-center gap-6"
          >
            <div className="w-16 h-16 rounded-2xl bg-ivory-300 border border-gold-300/40 flex items-center justify-center shrink-0">
              {step.icon}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-serif text-gold-600">STEP {step.num}</span>
              </div>
              <h3 className="font-serif font-bold text-xl text-navy-950">{step.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Privacy Notice Box */}
      <div className="bg-navy-50 rounded-3xl p-8 border border-navy-200 flex items-start gap-4">
        <Lock className="w-8 h-8 text-navy-900 shrink-0 mt-1" />
        <div className="space-y-2">
          <h4 className="font-serif font-bold text-base text-navy-900">Our Privacy Commitment</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your personal telephone numbers, home addresses, and private contact information are strictly shielded. They will never appear in public search engines or open listings. Contact exchange occurs only after mutual interest and pastoral clearance.
          </p>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="text-center pt-4">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-soft transition-colors"
          >
            <span>Register Free & Begin Verification</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
}
