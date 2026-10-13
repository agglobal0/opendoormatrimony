import React from 'react';
import { Link } from 'react-router-dom';
import { Church, MapPin, Mail, Phone, ShieldCheck, Heart } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer className="bg-navy-950 text-slate-300 border-t border-navy-800">
      {/* Holy Scripture Top Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 py-6 border-b border-navy-800/80">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="font-serif italic text-base md:text-lg text-gold-300 font-normal tracking-wide">
            {settings.scripture_verse || '“Therefore what God has joined together, let no one separate.” — Mark 10:9'}
          </p>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Col 1: Church & Matrimonial Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <Church size={22} />
              </div>
              <div>
                <span className="block font-serif text-lg font-bold text-white">
                  {settings.site_name || 'Open Door Matrimony'}
                </span>
                <span className="block text-[11px] text-gold-400 font-medium">
                  {settings.site_tagline || 'Faith. Family. Forever.'}
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              A sacred matrimonial service under the prayerful leadership and supervision of The Open Door Church, Khojewala, Punjab. Dedicated to helping Christian families build Christ-centered marriages.
            </p>
            <div className="pt-2">
              <a
                href={settings.church_website || 'https://theopendoorchurch.org'}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 hover:text-gold-300 transition-colors"
              >
                <span>Visit Main Church Website</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/matches" className="hover:text-gold-400 transition-colors">Browse Verified Matches</Link></li>
              <li><Link to="/how-it-works" className="hover:text-gold-400 transition-colors">How Verification Works</Link></li>
              <li><Link to="/success-stories" className="hover:text-gold-400 transition-colors">Couple Testimonies</Link></li>
              <li><Link to="/about" className="hover:text-gold-400 transition-colors">Our Pastoral Vision</Link></li>
              <li><Link to="/faq" className="hover:text-gold-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Bureau Office & Support</Link></li>
            </ul>
          </div>

          {/* Col 3: Privacy & Safety */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase">
              Privacy & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/safety" className="hover:text-gold-400 transition-colors">Safety Guidelines</Link></li>
              <li><Link to="/privacy" className="hover:text-gold-400 transition-colors">Strict Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-gold-400 transition-colors">Terms of Bureau Service</Link></li>
              <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Report Discrepancy</Link></li>
            </ul>
            <div className="pt-2 flex items-start gap-2 text-xs text-slate-400 bg-navy-900/60 p-3 rounded-xl border border-navy-800">
              <ShieldCheck size={18} className="text-gold-400 shrink-0 mt-0.5" />
              <span>Contact details remain protected until mutual consent & pastoral approval.</span>
            </div>
          </div>

          {/* Col 4: Church Bureau Office Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-serif font-bold text-white tracking-wider uppercase">
              Church Bureau Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-gold-400 shrink-0 mt-0.5" />
                <span>{settings.church_location || 'Khojewala, Kapurthala - Jalandhar Road, Punjab, India'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-gold-400 shrink-0" />
                <span>{settings.contact_email || 'matrimony@theopendoorchurch.org'}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-gold-400 shrink-0" />
                <span>{settings.contact_phone || '+91 98765 43210'}</span>
              </div>
            </div>
            <div className="pt-3">
              <p className="text-[11px] text-slate-400">
                Office Hours: Tue - Sun (9:00 AM - 5:00 PM IST)
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} {settings.site_name || 'Open Door Matrimony'}. Managed by {settings.church_name || 'The Open Door Church, Khojewala'}.
          </p>
          <p className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Solemnizing Christian marriages in faith and prayer</span>
            <Heart size={12} className="text-gold-500 fill-gold-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
