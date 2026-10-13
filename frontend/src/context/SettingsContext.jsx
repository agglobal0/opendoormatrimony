import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    site_name: 'Open Door Matrimony',
    site_tagline: 'Faith. Family. Forever.',
    church_name: 'The Open Door Church',
    church_location: 'Khojewala, Kapurthala - Jalandhar Road, Punjab, India',
    church_website: 'https://theopendoorchurch.org',
    contact_email: 'matrimony@theopendoorchurch.org',
    contact_phone: '+91 98765 43210',
    hero_heading: 'Find a Life Partner Who Shares Your Faith & Values',
    hero_subheading: 'A trusted Christian matrimonial community supervised by The Open Door Church, helping individuals and families take a prayerful, guided step toward holy matrimony.',
    scripture_verse: '“Therefore what God has joined together, let no one separate.” — Mark 10:9'
  });
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/cms/settings');
      if (res.data && res.data.success && res.data.data) {
        setSettings(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (err) {
      console.warn('Using default church branding settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings: fetchSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
