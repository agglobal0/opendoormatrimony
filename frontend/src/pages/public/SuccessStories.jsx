import React, { useState, useEffect } from 'react';
import { Heart, Church, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export default function SuccessStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await api.get('/cms/success-stories');
        if (res.data && res.data.success) {
          setStories(res.data.data || []);
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Testimonies of Grace</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy-950">Christian Marriage Success Stories</h1>
        <p className="text-sm sm:text-base text-slate-600">
          Rejoicing with Christian couples whose journeys toward holy matrimony were guided through Open Door Matrimony.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stories.map((s) => (
          <div key={s.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft flex flex-col justify-between">
            <div>
              <div className="aspect-16/10 w-full bg-slate-100 overflow-hidden">
                <img
                  src={s.wedding_photo_url || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80'}
                  alt={s.couple_names}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-serif font-bold text-xl text-navy-950">{s.couple_names}</h3>
                <p className="text-xs text-slate-500 font-medium">Married: {new Date(s.marriage_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p className="text-xs text-slate-600 italic leading-relaxed">"{s.story}"</p>
              </div>
            </div>
            <div className="p-6 pt-0">
              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] text-gold-700 font-medium">
                <CheckCircle2 size={14} className="text-gold-600 shrink-0" />
                <span>{s.church_blessing_notes || 'Solemnized with blessings at The Open Door Church'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
