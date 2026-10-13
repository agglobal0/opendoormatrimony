import React, { useState, useEffect } from 'react';
import ProfileCard from '../../components/common/ProfileCard';
import { ProfileCardSkeleton } from '../../components/common/SkeletonLoader';
import EmptyState from '../../components/common/EmptyState';
import api from '../../services/api';

export default function SavedProfiles() {
  const [savedList, setSavedList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    setLoading(true);
    try {
      const res = await api.get('/saved');
      if (res.data && res.data.success) {
        setSavedList(res.data.data || []);
      }
    } catch (err) {
      console.error('Error loading saved profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleSavedToggle = (profId, isSaved) => {
    if (!isSaved) {
      setSavedList(prev => prev.filter(item => item.profile?.id !== profId && item.profile?.user_id !== profId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-navy-950">Bookmarked Profiles</h1>
        <p className="text-xs text-slate-500">Profiles you have bookmarked for family review and prayer.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <ProfileCardSkeleton key={i} />
          ))}
        </div>
      ) : savedList.length === 0 ? (
        <EmptyState
          icon="shield"
          title="No Bookmarked Profiles"
          description="Click the bookmark icon on any profile to save it here for family reference."
          actionText="Discover Matches"
          actionLink="/matches"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {savedList.map((item) => (
            <ProfileCard
              key={item.id}
              profile={item.profile}
              isSavedInitial={true}
              onSavedToggle={handleSavedToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
