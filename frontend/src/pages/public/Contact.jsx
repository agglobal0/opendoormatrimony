import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import api from '../../services/api';

export default function Contact() {
  const { settings } = useSettings();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry / Bureau Guidance',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await api.post('/contact', formData);
      if (res.data && res.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry / Bureau Guidance', message: '' });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Error sending inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Connect With Bureau</span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-navy-950">Contact Church Bureau Office</h1>
        <p className="text-sm text-slate-600">
          Our pastoral and bureau counseling team is here to assist candidates and families in prayer and guidance.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Contact Info */}
        <div className="lg:col-span-5 bg-navy-900 text-white rounded-3xl p-8 space-y-8 shadow-card">
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-2xl text-gold-400">Marriage Bureau Office</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Located at the main campus of {settings.church_name || 'The Open Door Church, Khojewala'}.
            </p>
          </div>

          <div className="space-y-5 text-xs text-slate-200">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="text-gold-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Bureau Campus Address:</p>
                <p className="text-slate-300">{settings.church_location || 'Khojewala, Kapurthala - Jalandhar Road, Punjab, India'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={18} className="text-gold-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Email Inquiries:</p>
                <p className="text-slate-300">{settings.contact_email || 'matrimony@theopendoorchurch.org'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={18} className="text-gold-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Bureau Telephone:</p>
                <p className="text-slate-300">{settings.contact_phone || '+91 98765 43210'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={18} className="text-gold-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">Operational Hours:</p>
                <p className="text-slate-300">{settings.office_hours || 'Tuesday - Sunday: 9:00 AM - 5:00 PM (Monday Closed)'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-200 shadow-soft">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="font-serif font-bold text-2xl text-navy-950">Thank You for Contacting Us</h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your message has been submitted to The Open Door Church Matrimonial Bureau. A pastoral coordinator will contact you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-semibold"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-serif font-bold text-xl text-navy-950 mb-2">Send an Inquiry</h3>

              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                    placeholder="+91 98765 00000"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none bg-white"
                  >
                    <option value="General Inquiry / Bureau Guidance">General Inquiry / Bureau Guidance</option>
                    <option value="Profile Verification Assistance">Profile Verification Assistance</option>
                    <option value="Pastoral Introduction Request">Pastoral Introduction Request</option>
                    <option value="Technical Support">Technical Support</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Message or Prayer Request *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-2.5 rounded-xl text-xs border border-slate-300 focus:ring-2 focus:ring-navy-600 focus:outline-none"
                  placeholder="How can the church matrimonial bureau assist your family?"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs shadow-soft flex items-center justify-center gap-2 transition-colors"
              >
                <Send size={14} />
                <span>{loading ? 'Submitting...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
