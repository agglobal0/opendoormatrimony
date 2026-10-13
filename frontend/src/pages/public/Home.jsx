import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Church, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Users, 
  Lock, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Phone,
  HelpCircle,
  ChevronDown,
  Calendar,
  Award,
  Flame,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import ProfileCard from '../../components/common/ProfileCard';
import { ProfileCardSkeleton } from '../../components/common/SkeletonLoader';
import api from '../../services/api';

export default function Home() {
  const { settings } = useSettings();
  const { isAuthenticated, user, login } = useAuth();
  const navigate = useNavigate();

  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [stories, setStories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGender, setFilterGender] = useState('ALL');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [demoLoginLoading, setDemoLoginLoading] = useState(false);

  // Quick Match Finder State
  const [quickGender, setQuickGender] = useState('FEMALE');
  const [quickAgeRange, setQuickAgeRange] = useState('any');
  const [quickDenomination, setQuickDenomination] = useState('');
  const [quickCity, setQuickCity] = useState('');

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [profRes, storyRes, faqRes] = await Promise.all([
          api.get('/matches?limit=8'),
          api.get('/cms/success-stories'),
          api.get('/cms/faqs')
        ]);
        if (profRes.data && profRes.data.success) {
          setFeaturedProfiles(profRes.data.data || []);
        }
        if (storyRes.data && storyRes.data.success) {
          setStories(storyRes.data.data || []);
        }
        if (faqRes.data && faqRes.data.success) {
          setFaqs(faqRes.data.data || []);
        }
      } catch (err) {
        console.error('Home data load note:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { message: 'Please sign in to browse match search results and view full verified profiles.' } });
      return;
    }
    const query = new URLSearchParams();
    if (quickGender) query.set('gender', quickGender);
    if (quickDenomination) query.set('denomination', quickDenomination);
    if (quickCity) query.set('city', quickCity);
    if (quickAgeRange && quickAgeRange !== 'any') {
      const [min, max] = quickAgeRange.split('-');
      if (min) query.set('min_age', min);
      if (max) query.set('max_age', max);
    }
    navigate(`/matches?${query.toString()}`);
  };

  const handleQuickDemoLogin = async (email) => {
    setDemoLoginLoading(true);
    try {
      const result = await login(email, 'Password@123');
      if (result.success) {
        if (result.user?.role === 'ADMIN' || result.user?.role === 'SUPER_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Demo login error:', err);
    } finally {
      setDemoLoginLoading(false);
    }
  };

  const filteredProfiles = featuredProfiles.filter(p => {
    if (filterGender === 'ALL') return true;
    return p.gender === filterGender;
  });

  return (
    <div className="space-y-16 sm:space-y-20 pb-24 overflow-hidden">
      
      {/* 1. TOP NOTICE & SCRIPTURE BANNER */}
      <section className="bg-navy-950 text-slate-200 text-xs border-b border-navy-800 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-400 font-semibold border border-gold-500/30 text-[11px]">
              <Church size={12} />
              Official Marriage Bureau
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="font-serif italic text-gold-200">
              “Therefore what God has joined together, let no one separate.” — Mark 10:9
            </span>
          </div>
          
          {/* Quick Demo Test Access */}
          {!isAuthenticated && (
            <div className="flex items-center gap-2 text-[11px] font-medium text-slate-300">
              <span className="hidden lg:inline text-slate-400">1-Click Test Access:</span>
              <button 
                onClick={() => handleQuickDemoLogin('joshua.masih@example.com')} 
                disabled={demoLoginLoading}
                className="hover:text-gold-400 transition-colors underline underline-offset-2"
              >
                Groom
              </button>
              <span>•</span>
              <button 
                onClick={() => handleQuickDemoLogin('grace.matthew@example.com')} 
                disabled={demoLoginLoading}
                className="hover:text-gold-400 transition-colors underline underline-offset-2"
              >
                Bride
              </button>
              <span>•</span>
              <button 
                onClick={() => handleQuickDemoLogin('admin@opendoormatrimony.org')} 
                disabled={demoLoginLoading}
                className="hover:text-gold-400 transition-colors underline underline-offset-2 text-gold-400 font-bold"
              >
                Admin
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 2. MAJESTIC HERO SECTION WITH INTUITIVE QUICK SEARCH */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50/90 to-ivory-100/60 pt-8 pb-16 border-b border-slate-200/80">
        
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-gold-100/40 via-gold-50/10 to-transparent pointer-events-none blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Church Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-50/90 border border-gold-300 text-gold-800 text-xs font-semibold shadow-xs mb-5">
            <Church size={15} className="text-gold-600" />
            <span>{settings.church_name || 'The Open Door Church, Khojewala'} • Matrimonial Ministry</span>
          </div>

          {/* Main Title */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-950 tracking-tight leading-[1.12] max-w-4xl mx-auto">
            {settings.hero_heading || 'Find Your God-Given Christian Life Partner'}
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-2xl mx-auto">
            {settings.hero_subheading || 'A prayerful, church-supervised platform connecting sincere Punjabi and Indian Christian believers worldwide with pastoral blessing.'}
          </p>

          {/* HERO CALL-TO-ACTION BUTTONS */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/register"
                  className="px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-sm shadow-gold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  <span>Register Free Matrimonial Profile</span>
                </Link>
                <Link
                  to="/matches"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-navy-900 font-semibold text-sm shadow-xs transition-all duration-200 flex items-center gap-2"
                >
                  <Users size={16} className="text-navy-700" />
                  <span>Browse Verified Matches</span>
                </Link>
                <Link
                  to="/login"
                  className="px-5 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-sm shadow-soft transition-all duration-200 flex items-center gap-2"
                >
                  <KeyRound size={16} className="text-gold-400" />
                  <span>Member Login</span>
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-200 shadow-soft">
                <span className="text-xs text-slate-600">Welcome back, <strong className="text-navy-950">{user?.email}</strong>!</span>
                <Link
                  to="/dashboard"
                  className="px-4 py-2 rounded-xl bg-navy-900 text-white font-bold text-xs hover:bg-navy-800 transition-colors"
                >
                  Go to Member Dashboard →
                </Link>
              </div>
            )}
          </div>

          {/* FLOATING QUICK MATCHMAKER SEARCH BAR */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-2xl md:rounded-3xl p-4 sm:p-5 shadow-xl border border-slate-200/90 text-left relative z-10">
            <div className="mb-3 px-1 flex items-center justify-between">
              <span className="text-xs font-bold text-navy-950 flex items-center gap-1.5">
                <Flame size={14} className="text-gold-600" />
                Quick Match Finder
              </span>
              <span className="text-[11px] text-slate-500 font-medium">100% Free & Church Supervised</span>
            </div>

            <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
              
              {/* Looking for */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">I am looking for</label>
                <select
                  value={quickGender}
                  onChange={(e) => setQuickGender(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-navy-950 focus:outline-none cursor-pointer pt-1"
                >
                  <option value="FEMALE">A Christian Bride</option>
                  <option value="MALE">A Christian Groom</option>
                </select>
              </div>

              {/* Age Range */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Age Range</label>
                <select
                  value={quickAgeRange}
                  onChange={(e) => setQuickAgeRange(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-navy-950 focus:outline-none cursor-pointer pt-1"
                >
                  <option value="any">Any Age Range</option>
                  <option value="20-26">20 to 26 Years</option>
                  <option value="25-32">25 to 32 Years</option>
                  <option value="30-38">30 to 38 Years</option>
                  <option value="38-50">38 to 50 Years</option>
                </select>
              </div>

              {/* Denomination */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Denomination</label>
                <select
                  value={quickDenomination}
                  onChange={(e) => setQuickDenomination(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-navy-950 focus:outline-none cursor-pointer pt-1"
                >
                  <option value="">All Denominations</option>
                  <option value="Evangelical">Pentecostal / Evangelical</option>
                  <option value="CNI">Church of North India (CNI)</option>
                  <option value="Assemblies of God">Assemblies of God</option>
                  <option value="Baptist">Baptist</option>
                  <option value="Methodist">Methodist</option>
                </select>
              </div>

              {/* Location */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Location / Region</label>
                <select
                  value={quickCity}
                  onChange={(e) => setQuickCity(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-navy-950 focus:outline-none cursor-pointer pt-1"
                >
                  <option value="">All Locations</option>
                  <option value="Jalandhar">Jalandhar</option>
                  <option value="Kapurthala">Kapurthala / Khojewala</option>
                  <option value="Ludhiana">Ludhiana</option>
                  <option value="Amritsar">Amritsar</option>
                  <option value="Chandigarh">Chandigarh / Mohali</option>
                  <option value="Canada">Canada (NRI Believers)</option>
                  <option value="UK">UK / Europe (NRI)</option>
                </select>
              </div>

              {/* Find Matches CTA Button */}
              <div>
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gold-500 hover:bg-gold-600 text-navy-950 font-bold text-xs shadow-gold transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <span>Search Matches</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </form>
          </div>

          {/* 3. TRUST HIGHLIGHTS BAR */}
          <div className="flex flex-wrap justify-center items-center gap-6 mt-10 text-xs font-medium text-slate-600">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-emerald-600" />
              100% Church Verified Profiles
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Lock size={16} className="text-gold-600" />
              Strict Contact Privacy Shield
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Users size={16} className="text-navy-700" />
              Pastoral & Family Facilitation
            </span>
          </div>

        </div>
      </section>

      {/* 4. CHURCH STATS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-navy-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl border border-navy-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="block font-serif text-3xl sm:text-4xl font-extrabold text-gold-400">40+</span>
            <span className="text-xs text-slate-300 font-medium">Verified Active Profiles</span>
          </div>
          <div className="space-y-1">
            <span className="block font-serif text-3xl sm:text-4xl font-extrabold text-gold-400">100%</span>
            <span className="text-xs text-slate-300 font-medium">Pastoral Reference Checked</span>
          </div>
          <div className="space-y-1">
            <span className="block font-serif text-3xl sm:text-4xl font-extrabold text-gold-400">12+</span>
            <span className="text-xs text-slate-300 font-medium">Districts & NRI Believers</span>
          </div>
          <div className="space-y-1">
            <span className="block font-serif text-3xl sm:text-4xl font-extrabold text-gold-400">100%</span>
            <span className="text-xs text-slate-300 font-medium">Confidential & Protected</span>
          </div>
        </div>
      </section>

      {/* 5. SIMPLE 4-STEP PRAYERFUL JOURNEY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Simple, Safe & Respectful</span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">How Open Door Matrimony Works</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            A biblical approach to finding a life partner with family honor and pastoral blessings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-navy-50 text-navy-900 font-serif font-bold text-lg flex items-center justify-center">
              01
            </div>
            <h3 className="font-serif font-bold text-base text-navy-950">1. Register Profile</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Create your free profile. Share your faith testimony, church membership, education, and career.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-700 font-serif font-bold text-lg flex items-center justify-center border border-gold-200">
              02
            </div>
            <h3 className="font-serif font-bold text-base text-navy-950">2. Pastoral Check</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              The church matrimonial committee reviews water baptism details and pastor references to grant the verified badge.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-serif font-bold text-lg flex items-center justify-center border border-blue-200">
              03
            </div>
            <h3 className="font-serif font-bold text-base text-navy-950">3. Match & Connect</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse compatible Christian believers by denomination, lifestyle, and values, and express mutual interest.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all duration-300 space-y-3 relative">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-serif font-bold text-lg flex items-center justify-center border border-emerald-200">
              04
            </div>
            <h3 className="font-serif font-bold text-base text-navy-950">4. Holy Matrimony</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Request church-facilitated family introductions and pre-marital pastoral counseling toward a blessed wedding.
            </p>
          </div>

        </div>
      </section>

      {/* 6. FEATURED VERIFIED MEMBERS (WITH TABS FOR BRIDES / GROOMS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Church Supervised Believers</span>
            <h2 className="font-serif text-3xl font-bold text-navy-950 mt-1">Featured Verified Members</h2>
            <p className="text-xs text-slate-500 mt-1">
              Active Christian profiles verified through water baptism and pastoral references.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setFilterGender('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterGender === 'ALL' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              All Matches
            </button>
            <button
              onClick={() => setFilterGender('FEMALE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterGender === 'FEMALE' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Brides 👰
            </button>
            <button
              onClick={() => setFilterGender('MALE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterGender === 'MALE' ? 'bg-white text-navy-950 shadow-xs' : 'text-slate-600 hover:text-navy-900'
              }`}
            >
              Grooms 🤵
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <ProfileCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProfiles.slice(0, 4).map((prof) => (
              <ProfileCard key={prof.id} profile={prof} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/matches"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs shadow-soft transition-colors"
          >
            <span>Explore Verified Christian Matches</span>
            <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* 7. WHY CHRISTIAN FAMILIES TRUST US */}
      <section className="bg-navy-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Built On Scripture & Honor</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white">Why Christian Families Trust Us</h2>
            <p className="text-sm text-slate-300">
              A sacred platform prioritizing Christian integrity, family honor, and church guidance over casual dating.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-navy-800/90 p-8 rounded-3xl border border-navy-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                <BookOpen size={24} />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">Faith-Centered Matching</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Connect with believers who share essential Christian doctrine, regular church involvement, and sincere devotion to Jesus Christ.
              </p>
            </div>

            <div className="bg-navy-800/90 p-8 rounded-3xl border border-navy-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">Verified Profiles Only</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every application is scrutinized by the church matrimonial committee to prevent false claims and protect family safety.
              </p>
            </div>

            <div className="bg-navy-800/90 p-8 rounded-3xl border border-navy-700 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Lock size={24} />
              </div>
              <h3 className="font-serif font-bold text-xl text-white">Absolute Privacy Shield</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Personal contact numbers and emails are NEVER exposed publicly. Contact details are shared only upon mutual consent and pastoral introduction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. DENOMINATIONS SERVED */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">United in Christ</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-950 mt-1 mb-8">
          Serving Christian Believers Across Denominations
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Pentecostal / Evangelical', count: '18+ Profiles' },
            { name: 'Church of North India (CNI)', count: '10+ Profiles' },
            { name: 'Assemblies of God', count: '6+ Profiles' },
            { name: 'Baptist Church', count: '4+ Profiles' },
            { name: 'Methodist Church', count: '3+ Profiles' },
            { name: 'NRI Believers (Global)', count: '7+ Profiles' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-gold-300 transition-colors">
              <Church size={20} className="text-gold-600 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-navy-950 leading-tight">{item.name}</h4>
              <span className="block text-[10px] text-slate-400 mt-1">{item.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 9. SUCCESS STORIES */}
      {stories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Blessed Unions</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-950">God’s Grace in Holy Matrimony</h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Christian couples brought together in holy matrimony through prayer and church pastoral guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((s) => (
              <div key={s.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft flex flex-col hover:shadow-card transition-all">
                <div className="aspect-16/10 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={s.wedding_photo_url}
                    alt={s.couple_names}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif font-bold text-lg text-navy-950">{s.couple_names}</h3>
                    <p className="text-xs text-slate-600 italic leading-relaxed">"{s.story}"</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 text-[11px] text-gold-700 font-medium flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-gold-600 shrink-0" />
                    <span>{s.church_blessing_notes || 'Solemnized with church blessings'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 10. INTERACTIVE FAQ ACCORDION */}
      {faqs.length > 0 && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Clarity & Confidence</span>
            <h2 className="font-serif text-3xl font-bold text-navy-950">Frequently Asked Questions</h2>
            <p className="text-xs sm:text-sm text-slate-500">Everything you need to know about registering and connecting safely.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={faq.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none"
                  >
                    <span className="font-serif font-bold text-sm text-navy-900">{faq.question}</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-gold-600' : ''}`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 11. PASTORAL BUREAU CONTACT CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-soft flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-gold-600 uppercase tracking-widest">Pastoral Bureau Office</span>
            <h3 className="font-serif text-2xl font-bold text-navy-950">
              Need Personal Guidance or Prayer?
            </h3>
            <p className="text-xs text-slate-500 max-w-xl">
              Visit our marriage bureau office at <strong>The Open Door Church, Khojewala, Kapurthala - Jalandhar Road, Punjab</strong>, or reach out to the pastoral committee directly.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="px-6 py-3 rounded-xl bg-navy-900 text-white font-semibold text-xs hover:bg-navy-800 transition-colors shadow-soft"
            >
              Contact Pastoral Bureau
            </Link>
            <Link
              to="/how-it-works"
              className="px-6 py-3 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              Learn Verification Process
            </Link>
          </div>
        </div>
      </section>

      {/* 12. GRAND CALL TO ACTION BANNER (Only shown for non-logged in visitors) */}
      {!isAuthenticated && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden border border-gold-500/20">
            <div className="max-w-2xl mx-auto space-y-4 relative z-10">
              <span className="text-xs font-bold text-gold-400 uppercase tracking-widest">Faith • Family • Forever</span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight">
                Begin Your Prayerful Journey Toward Holy Matrimony Today
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Join hundreds of Christian men and women finding life partners with the blessing of family and pastoral guidance.
              </p>
              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to="/register"
                  className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold bg-gold-500 hover:bg-gold-600 text-navy-950 shadow-gold transition-colors"
                >
                  Create Your Profile Today (Free)
                </Link>
                <Link
                  to="/matches"
                  className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-semibold border border-white/30 hover:bg-white/10 text-white transition-colors"
                >
                  Explore Verified Matches
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
