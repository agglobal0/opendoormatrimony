import React, { useState, useEffect } from 'react';
import { Settings, Church, Heart, Save, CheckCircle2, Plus } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function AdminCMS() {
  const { settings, refreshSettings } = useSettings();

  const [formSettings, setFormSettings] = useState({
    site_name: '',
    site_tagline: '',
    church_name: '',
    church_location: '',
    church_website: '',
    contact_email: '',
    contact_phone: '',
    office_hours: '',
    hero_heading: '',
    hero_subheading: '',
    scripture_verse: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // New Story Form State
  const [newStory, setNewStory] = useState({
    couple_names: '',
    marriage_date: '2025-02-14',
    wedding_photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    story: '',
    church_blessing_notes: 'Solemnized with blessings at The Open Door Church'
  });
  const [addingStory, setAddingStory] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormSettings({
        site_name: settings.site_name || 'Open Door Matrimony',
        site_tagline: settings.site_tagline || 'Faith. Family. Forever.',
        church_name: settings.church_name || 'The Open Door Church',
        church_location: settings.church_location || 'Khojewala, Kapurthala - Jalandhar Road, Punjab, India',
        church_website: settings.church_website || 'https://theopendoorchurch.org',
        contact_email: settings.contact_email || 'matrimony@theopendoorchurch.org',
        contact_phone: settings.contact_phone || '+91 98765 43210',
        office_hours: settings.office_hours || 'Tuesday - Sunday: 9:00 AM - 5:00 PM (Monday Closed)',
        hero_heading: settings.hero_heading || 'Find a Life Partner Who Shares Your Faith & Values',
        hero_subheading: settings.hero_subheading || 'A trusted Christian matrimonial community supervised by The Open Door Church.',
        scripture_verse: settings.scripture_verse || '“Therefore what God has joined together, let no one separate.” — Mark 10:9'
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    try {
      const res = await api.put('/cms/settings', formSettings);
      if (res.data && res.data.success) {
        setSuccessMsg('Central church branding and site settings updated successfully!');
        await refreshSettings();
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStory = async (e) => {
    e.preventDefault();
    setAddingStory(true);
    try {
      const res = await api.post('/cms/success-stories', newStory);
      if (res.data && res.data.success) {
        alert('New couple testimony published successfully!');
        setNewStory({
          couple_names: '',
          marriage_date: '2025-02-14',
          wedding_photo_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          story: '',
          church_blessing_notes: 'Solemnized with blessings at The Open Door Church'
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error publishing success story.');
    } finally {
      setAddingStory(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      <div>
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Central Configuration</span>
        <h1 className="font-serif text-3xl font-bold text-navy-950">Church Branding & Content Management</h1>
        <p className="text-xs text-slate-500">Configure public platform branding, church credentials, and published testimonies.</p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <h3 className="font-serif font-bold text-xl text-navy-950 flex items-center gap-2">
          <Church size={20} className="text-gold-600" />
          <span>General Church & Brand Identity</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Platform Brand Name</label>
            <input
              type="text"
              name="site_name"
              value={formSettings.site_name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Brand Tagline</label>
            <input
              type="text"
              name="site_tagline"
              value={formSettings.site_tagline}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Parent Church Name</label>
            <input
              type="text"
              name="church_name"
              value={formSettings.church_name}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Church Website URL</label>
            <input
              type="url"
              name="church_website"
              value={formSettings.church_website}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Church Bureau Campus Address</label>
          <input
            type="text"
            name="church_location"
            value={formSettings.church_location}
            onChange={handleChange}
            className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bureau Contact Email</label>
            <input
              type="email"
              name="contact_email"
              value={formSettings.contact_email}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Bureau Contact Phone</label>
            <input
              type="text"
              name="contact_phone"
              value={formSettings.contact_phone}
              onChange={handleChange}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Homepage Hero Heading</label>
          <input
            type="text"
            name="hero_heading"
            value={formSettings.hero_heading}
            onChange={handleChange}
            className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Featured Biblical Scripture Verse</label>
          <input
            type="text"
            name="scripture_verse"
            value={formSettings.scripture_verse}
            onChange={handleChange}
            className="w-full p-2.5 rounded-xl text-xs border border-slate-300 font-serif italic"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-soft flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>{loading ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Add Success Story Form */}
      <form onSubmit={handleAddStory} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-soft space-y-6">
        <h3 className="font-serif font-bold text-xl text-navy-950 flex items-center gap-2">
          <Heart size={20} className="text-rose-600" />
          <span>Publish New Marriage Success Story</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Couple Names *</label>
            <input
              type="text"
              required
              placeholder="e.g. David & Rachel Masih"
              value={newStory.couple_names}
              onChange={(e) => setNewStory({ ...newStory, couple_names: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Marriage Date *</label>
            <input
              type="date"
              required
              value={newStory.marriage_date}
              onChange={(e) => setNewStory({ ...newStory, marriage_date: e.target.value })}
              className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Wedding Photo Image URL</label>
          <input
            type="url"
            value={newStory.wedding_photo_url}
            onChange={(e) => setNewStory({ ...newStory, wedding_photo_url: e.target.value })}
            className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Couple Testimony / Story *</label>
          <textarea
            rows={3}
            required
            placeholder="Share how God led the couple together..."
            value={newStory.story}
            onChange={(e) => setNewStory({ ...newStory, story: e.target.value })}
            className="w-full p-2.5 rounded-xl text-xs border border-slate-300"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={addingStory}
            className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 text-xs font-bold shadow-gold flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>{addingStory ? 'Publishing...' : 'Publish Success Story'}</span>
          </button>
        </div>
      </form>

    </div>
  );
}
