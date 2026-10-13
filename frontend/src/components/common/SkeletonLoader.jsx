import React from 'react';

export function ProfileCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-4 animate-pulse">
      <div className="aspect-4/3 bg-slate-200 rounded-xl w-full" />
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-3/4" />
        <div className="h-3 bg-slate-200 rounded w-1/2" />
      </div>
      <div className="space-y-1.5 pt-2 border-t border-slate-100">
        <div className="h-3 bg-slate-200 rounded w-full" />
        <div className="h-3 bg-slate-200 rounded w-5/6" />
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2">
        <div className="h-8 bg-slate-200 rounded-xl" />
        <div className="h-8 bg-slate-200 rounded-xl" />
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}
