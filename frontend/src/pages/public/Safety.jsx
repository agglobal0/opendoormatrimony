import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Users } from 'lucide-react';

export default function Safety() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Trust & Integrity</span>
        <h1 className="font-serif text-4xl font-bold text-navy-950">Safety Guidelines & Best Practices</h1>
        <p className="text-sm text-slate-600">Guidance for Christian members and families on conducting safe matrimonial meetings.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gold-50 border border-gold-300 flex items-center justify-center text-gold-600 shrink-0">
            <Users size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-navy-950">Always Involve Parents & Family</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Christian marriage is a union of two families in Christ. We strongly advise candidates to involve parents, guardians, and church mentors from the very beginning of matrimonial discussions.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-navy-950">Independent Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              While our bureau verifies church references and initial records, families must independently verify employment, family reputation, and character before finalizing marital arrangements.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-300 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-navy-950">Never Send Financial Help</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No genuine matrimonial candidate or church official will ever request money transfers, emergency funds, or financial assistance. Report any financial solicitation to the bureau immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
