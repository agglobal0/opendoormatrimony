import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../services/api';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await api.get('/cms/faqs');
        if (res.data && res.data.success) {
          setFaqs(res.data.data || []);
          if (res.data.data && res.data.data.length > 0) {
            setOpenId(res.data.data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching faqs:', err);
      }
    }
    loadFaqs();
  }, []);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Help & Support</span>
        <h1 className="font-serif text-4xl font-bold text-navy-950">Frequently Asked Questions</h1>
        <p className="text-sm text-slate-600">Find answers to common questions about our Christian marriage bureau.</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all duration-200"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="font-serif font-bold text-base text-navy-950">{faq.question}</span>
                {isOpen ? <ChevronUp size={18} className="text-slate-400 shrink-0" /> : <ChevronDown size={18} className="text-slate-400 shrink-0" />}
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
