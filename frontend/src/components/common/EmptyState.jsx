import React from 'react';
import { Church, Search, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  icon = 'search',
  title = 'No Profiles Found',
  description = 'Try adjusting your search filters or preferences to discover more matching profiles.',
  actionText = 'Reset Filters',
  onAction,
  actionLink
}) {
  const renderIcon = () => {
    switch (icon) {
      case 'heart':
        return <Heart className="w-12 h-12 text-gold-500 stroke-1" />;
      case 'shield':
        return <Shield className="w-12 h-12 text-navy-600 stroke-1" />;
      case 'church':
        return <Church className="w-12 h-12 text-gold-600 stroke-1" />;
      default:
        return <Search className="w-12 h-12 text-navy-500 stroke-1" />;
    }
  };

  return (
    <div className="text-center py-16 px-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft max-w-lg mx-auto my-8">
      <div className="w-20 h-20 bg-ivory-300 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold-300/40">
        {renderIcon()}
      </div>
      <h3 className="text-xl font-serif font-bold text-navy-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">{description}</p>
      {actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold bg-navy-900 text-white hover:bg-navy-800 transition-colors shadow-xs"
        >
          {actionText}
        </Link>
      ) : onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl text-sm font-semibold bg-navy-900 text-white hover:bg-navy-800 transition-colors shadow-xs"
        >
          {actionText}
        </button>
      ) : null}
    </div>
  );
}
