import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function VerificationBadge({ status, showText = true, size = 'md' }) {
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 20 : 16;
  
  if (status === 'VERIFIED') {
    return (
      <span
        title="Church Verified: This profile has been officially reviewed and approved by The Open Door Church Matrimonial Bureau."
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs cursor-help"
      >
        <CheckCircle2 size={iconSize} className="text-emerald-600 fill-emerald-100" />
        {showText && <span>Church Verified ✓</span>}
      </span>
    );
  }

  if (status === 'UNDER_REVIEW' || status === 'PENDING') {
    return (
      <span
        title="Verification Pending: Profile is currently undergoing pastoral and background checks by the church bureau."
        className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/80 cursor-help"
      >
        <Clock size={iconSize} className="text-amber-600" />
        {showText && <span>Verification In Progress</span>}
      </span>
    );
  }

  if (status === 'REJECTED' || status === 'SUSPENDED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200">
        <AlertCircle size={iconSize} className="text-rose-600" />
        {showText && <span>{status === 'SUSPENDED' ? 'Suspended' : 'Changes Requested'}</span>}
      </span>
    );
  }

  return null;
}
