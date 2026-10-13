import React, { useState } from 'react';
import { Filter, RotateCcw, X, Search } from 'lucide-react';

export default function SearchFilters({ filters, setFilters, onApply, onReset }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const denominations = [
    'All Denominations',
    'Evangelical / Pentecostal',
    'Church of North India (CNI)',
    'Assemblies of God',
    'Baptist',
    'Methodist',
    'Anglican / CNI',
    'Church of South India (CSI)',
    'Independent Christian'
  ];

  const locations = [
    'All Locations',
    'Jalandhar',
    'Kapurthala',
    'Ludhiana',
    'Amritsar',
    'Chandigarh',
    'Batala',
    'Mohali',
    'New Delhi',
    'Canada (Diaspora)',
    'UK / Australia'
  ];

  const educations = [
    'All Education Levels',
    'Doctor / Medicine',
    'Engineering / B.Tech / M.Tech',
    'Chartered Accountant / Finance',
    'Post Graduate / Masters',
    'Graduate / Bachelor Degree',
    'Nursing / Healthcare'
  ];

  const handleChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-soft">
      {/* Mobile Filter Header & Toggle */}
      <div className="md:hidden flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-navy-900" />
          <span className="font-semibold text-xs text-navy-900">Search & Filter</span>
        </div>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-semibold"
        >
          Filters
        </button>
      </div>

      {/* Desktop Filter Form */}
      <div className="hidden md:flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-6 gap-2.5 items-center">
          
          {/* Gender Filter Buttons */}
          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-[11px] font-semibold">
            <button
              type="button"
              onClick={() => handleChange('gender', '')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                !filters.gender ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => handleChange('gender', 'FEMALE')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filters.gender === 'FEMALE' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Brides
            </button>
            <button
              type="button"
              onClick={() => handleChange('gender', 'MALE')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filters.gender === 'MALE' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Grooms
            </button>
          </div>

          {/* Keyword Search */}
          <div className="relative lg:col-span-2">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, career, city..."
              value={filters.search || ''}
              onChange={(e) => handleChange('search', e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-navy-700 focus:outline-none"
            />
          </div>

          {/* Denomination Select */}
          <div>
            <select
              value={filters.denomination || ''}
              onChange={(e) => handleChange('denomination', e.target.value === 'All Denominations' ? '' : e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-navy-700 focus:outline-none"
            >
              {denominations.map((d, i) => (
                <option key={i} value={d === 'All Denominations' ? '' : d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Location Select */}
          <div>
            <select
              value={filters.city || ''}
              onChange={(e) => handleChange('city', e.target.value === 'All Locations' ? '' : e.target.value)}
              className="w-full py-2 px-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:border-navy-700 focus:outline-none"
            >
              {locations.map((loc, i) => (
                <option key={i} value={loc === 'All Locations' ? '' : loc}>{loc}</option>
              ))}
            </select>
          </div>

          {/* Reset Action */}
          <div>
            <button
              onClick={onReset}
              className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-slate-200 text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/60 backdrop-blur-xs md:hidden">
          <div className="bg-white w-full max-w-xs h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-serif font-bold text-lg text-navy-900">Refine Search</h3>
                <button onClick={() => setMobileDrawerOpen(false)} className="p-1 rounded-lg text-slate-500">
                  <X size={20} />
                </button>
              </div>

              {/* Keyword */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Search Term</label>
                <input
                  type="text"
                  placeholder="Name, occupation, city..."
                  value={filters.search || ''}
                  onChange={(e) => handleChange('search', e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
                />
              </div>

              {/* Denomination */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Denomination</label>
                <select
                  value={filters.denomination || ''}
                  onChange={(e) => handleChange('denomination', e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                >
                  {denominations.map((d, i) => (
                    <option key={i} value={d === 'All Denominations' ? '' : d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">City / Region</label>
                <select
                  value={filters.city || ''}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                >
                  {locations.map((loc, i) => (
                    <option key={i} value={loc === 'All Locations' ? '' : loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Education */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Education</label>
                <select
                  value={filters.education_level || ''}
                  onChange={(e) => handleChange('education_level', e.target.value)}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-300 bg-white"
                >
                  {educations.map((edu, i) => (
                    <option key={i} value={edu === 'All Education Levels' ? '' : edu}>{edu}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => { onReset(); setMobileDrawerOpen(false); }}
                className="flex-1 py-2.5 text-xs font-semibold border border-slate-300 text-slate-600 rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileDrawerOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold bg-navy-900 text-white rounded-xl shadow-soft"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
