import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchFilters from '../../components/common/SearchFilters';
import ProfileCard from '../../components/common/ProfileCard';
import { ProfileCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

export default function BrowseMatches() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    gender: searchParams.get('gender') || '',
    denomination: searchParams.get('denomination') || '',
    city: searchParams.get('city') || '',
    education_level: searchParams.get('education_level') || '',
    marital_status: searchParams.get('marital_status') || '',
    page: parseInt(searchParams.get('page') || '1', 10),
    limit: 12
  });

  const [profiles, setProfiles] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) query.set(k, v);
      });

      setSearchParams(query);

      const res = await api.get(`/matches?${query.toString()}`);
      if (res.data && res.data.success) {
        setProfiles(res.data.data || []);
        setPagination(res.data.pagination || { total: 0, totalPages: 1, page: 1 });
      }
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMatches();
    }, 250);

    return () => clearTimeout(timer);
  }, [
    filters.search,
    filters.gender,
    filters.denomination,
    filters.city,
    filters.education_level,
    filters.marital_status,
    filters.page
  ]);

  const handleApplySearch = () => {
    fetchMatches();
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      gender: '',
      denomination: '',
      city: '',
      education_level: '',
      marital_status: '',
      page: 1,
      limit: 12
    });
  };

  const removeFilter = (key) => {
    setFilters(prev => ({ ...prev, [key]: '', page: 1 }));
  };

  const hasActiveFilters = Boolean(
    filters.gender || filters.denomination || filters.city || filters.education_level || filters.search
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-navy-950">Discover Verified Christian Matches</h1>
          <p className="text-xs text-slate-500">
            {loading ? 'Searching profiles...' : `${pagination.total} church-supervised Christian profiles found`}
          </p>
        </div>
      </div>

      {/* Filter Bar Component */}
      <SearchFilters
        filters={filters}
        setFilters={setFilters}
        onApply={handleApplySearch}
        onReset={handleResetFilters}
      />

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-[11px] font-semibold text-slate-400">Active filters:</span>
          {filters.gender && (
            <button
              onClick={() => removeFilter('gender')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-navy-50 text-navy-900 border border-navy-200 text-[11px] font-medium hover:bg-navy-100"
            >
              <span>{filters.gender === 'FEMALE' ? 'Brides' : 'Grooms'}</span>
              <span className="text-navy-400">×</span>
            </button>
          )}
          {filters.denomination && (
            <button
              onClick={() => removeFilter('denomination')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gold-50 text-gold-900 border border-gold-200 text-[11px] font-medium hover:bg-gold-100"
            >
              <span>{filters.denomination}</span>
              <span className="text-gold-500">×</span>
            </button>
          )}
          {filters.city && (
            <button
              onClick={() => removeFilter('city')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-medium hover:bg-slate-200"
            >
              <span>{filters.city}</span>
              <span className="text-slate-400">×</span>
            </button>
          )}
          {filters.search && (
            <button
              onClick={() => removeFilter('search')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300 text-[11px] font-medium hover:bg-slate-200"
            >
              <span>"{filters.search}"</span>
              <span className="text-slate-400">×</span>
            </button>
          )}
          <button
            onClick={handleResetFilters}
            className="text-[11px] font-semibold text-slate-500 hover:text-navy-900 ml-1 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Profile Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <EmptyState
          icon="search"
          title="No Matching Profiles Found"
          description="Try broadening your denomination or location filters to see more verified members."
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {profiles.map((p) => (
            <ProfileCard key={p.id} profile={p} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-xs font-medium text-slate-600 px-3">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            disabled={filters.page >= pagination.totalPages}
            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}

    </div>
  );
}
