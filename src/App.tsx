import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Search, User, MessageSquare, Bell, LogOut, 
  Filter, MapPin, Briefcase, GraduationCap, Star, 
  Check, X, Bookmark, Shield, Menu, ChevronRight,
  Camera, Info, Settings, CreditCard, Users, Palette
} from 'lucide-react';
import { User as UserType, Profile, Interest } from './types';
import { getCompatibilityScore } from './services/geminiService';
import { NAKSHATRAS, RASIS } from './utils/astrology';
import { SearchPage } from './components/SearchPage'; // Search page component
import { AdminPanel } from './components/AdminPanel';
import { HoroscopeSection } from './components/HoroscopeSection';
import { SuccessStoriesPage, MembershipPlansPage, AboutUsPage } from './components/ExtraPages';
import EditProfile from './components/EditProfile';
import ProfileCard from './components/ProfileCard';
import ChatWindow from './components/ChatWindow';

// --- Components ---

const ThemeSwitcher = () => {
  const themes = [
    { id: 'default', name: 'Royal Maroon', color: '#800000' },
    { id: 'modern', name: 'Premium Modern', color: '#6C63FF' },
    { id: 'sapphire', name: 'Sapphire Blue', color: '#233554' },
    { id: 'emerald', name: 'Emerald Green', color: '#047857' },
    { id: 'diwali', name: 'Diwali (Purple/Gold)', color: '#6B216D' },
    { id: 'pongal', name: 'Pongal (Green/Yellow)', color: '#059669' },
    { id: 'tamil-new-year', name: 'Tamil New Year', color: '#B91C1C' }
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // Auto-detect festival theme
      const date = new Date();
      const month = date.getMonth(); // 0-11
      const day = date.getDate();
      
      let festivalTheme = 'default';
      // Pongal: Jan 13-16
      if (month === 0 && day >= 13 && day <= 16) festivalTheme = 'pongal';
      // Tamil New Year: Apr 13-15
      else if (month === 3 && day >= 13 && day <= 15) festivalTheme = 'tamil-new-year';
      // Diwali: Oct 20 - Nov 15 (Approximate)
      else if ((month === 9 && day >= 20) || (month === 10 && day <= 15)) festivalTheme = 'diwali';
      
      applyTheme(festivalTheme);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    setCurrentTheme(themeId);
    if (themeId === 'default') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', themeId);
    }
  };

  const changeTheme = (themeId: string) => {
    applyTheme(themeId);
    localStorage.setItem('app-theme', themeId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-accent-500/20 border border-accent-500 flex items-center justify-center hover:bg-accent-500/30 transition-all text-accent-500"
        title="Change Theme"
      >
        <Palette size={20} />
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-primary-900/10 overflow-hidden z-50"
          >
            <div className="p-3 bg-primary-50 border-b border-primary-900/10">
              <h4 className="text-xs font-bold uppercase text-primary-900 tracking-wider">Select Theme</h4>
            </div>
            <div className="p-2 space-y-1">
              {themes.map(theme => (
                <button
                  key={theme.id}
                  onClick={() => changeTheme(theme.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors text-left text-sm font-medium text-primary-900"
                >
                  <div className="w-4 h-4 rounded-full border border-primary-900/20 shadow-sm" style={{ backgroundColor: theme.color }}></div>
                  {theme.name}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ user, onLogout, onNavigate }: { user: UserType | null, onLogout: () => void, onNavigate: (page: string) => void }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary-900 text-accent-500 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mr-3 shadow-inner">
              <Heart className="text-primary-900 fill-primary-900" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold tracking-wider leading-none">கந்தன் குடில்</h1>
              <p className="text-[10px] tracking-[0.2em] uppercase opacity-80">Matrimony - +91 97903 33735</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => onNavigate('search')} className="hover:text-white transition-colors flex items-center gap-2 font-medium">
              <Search size={18} /> Search
            </button>
            <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors flex items-center gap-2 font-medium">
              <Info size={18} /> About Us
            </button>
            <button onClick={() => onNavigate('plans')} className="hover:text-white transition-colors flex items-center gap-2 font-medium">
              <CreditCard size={18} /> Plans
            </button>
            {user ? (
              <>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors flex items-center gap-2 font-medium">
                  <Star size={18} /> Dashboard
                </button>
                <button onClick={() => onNavigate('messages')} className="hover:text-white transition-colors flex items-center gap-2 font-medium relative">
                  <MessageSquare size={18} /> Messages
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">2</span>
                </button>
                <div className="flex items-center gap-4 pl-4 border-l border-accent-500/30">
                  <ThemeSwitcher />
                  <button onClick={() => onNavigate('profile')} className="w-10 h-10 rounded-full bg-accent-500/20 border border-accent-500 flex items-center justify-center hover:bg-accent-500/30 transition-all">
                    <User size={20} />
                  </button>
                  <button onClick={onLogout} className="text-white/60 hover:text-white transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <ThemeSwitcher />
                <button onClick={() => onNavigate('login')} className="text-accent-500 font-bold hover:text-white transition-colors">Login</button>
                <button onClick={() => onNavigate('signup')} className="bg-accent-500 text-primary-900 px-6 py-2 rounded-full font-bold hover:bg-white transition-all shadow-lg">Register Free</button>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <ThemeSwitcher />
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-primary-800 border-t border-accent-500/20"
          >
            <div className="px-4 py-6 space-y-4">
              <button onClick={() => { onNavigate('search'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-lg">Search</button>
              <button onClick={() => { onNavigate('about'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-lg">About Us</button>
              <button onClick={() => { onNavigate('plans'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-lg">Plans</button>
              {user ? (
                <>
                  <button onClick={() => { onNavigate('dashboard'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-lg">Dashboard</button>
                  <button onClick={() => { onNavigate('profile'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-lg">My Profile</button>
                  <button onClick={onLogout} className="block w-full text-left py-2 text-lg text-red-400">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => { onNavigate('login'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-lg">Login</button>
                  <button onClick={() => { onNavigate('signup'); setIsMenuOpen(false); }} className="block w-full text-left py-2 text-lg bg-accent-500 text-primary-900 px-4 rounded-lg">Register</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

// --- Pages ---

const HomePage = ({ onNavigate }: { onNavigate: (page: string) => void }) => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=1920" 
            alt="Wedding Background" 
            className="w-full h-full object-cover brightness-[0.4] scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900/90 via-primary-900/50 to-transparent"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-accent-500 font-medium tracking-[0.3em] uppercase mb-4"
            >
              Trusted கந்தன் குடில் திருமண சேவை மையம்
            </motion.h2>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight"
            >
              Find Your <span className="text-accent-500 italic">Eternal</span> Soulmate
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="text-xl text-white/80 mb-10 leading-relaxed font-light"
            >
              கந்தன் குடில் திருமண சேவை மையம் brings together tradition and technology to help you find the perfect match with AI-powered compatibility.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <button onClick={() => onNavigate('signup')} className="btn-primary text-lg px-10 py-4">Get Started Free</button>
              <button onClick={() => onNavigate('search')} className="bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold py-4 px-10 rounded-full hover:bg-white/20 transition-all text-lg">Browse Profiles</button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-12 flex items-center gap-8"
            >
              <div className="flex -space-x-4">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-12 h-12 rounded-full border-2 border-primary-900 shadow-lg" alt="User" />
                ))}
              </div>
              <p className="text-sm font-medium"><span className="text-accent-500 text-lg">10,000+</span> Happy Couples Found Love</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quick Search Bar */}
      <div className="max-w-5xl mx-auto px-4 -mt-24 relative z-20">
        <div className="glass-card p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">I'm looking for a</label>
              <select className="w-full bg-bg-50 border border-accent-500/20 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent-500">
                <option>Bride</option>
                <option>Groom</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Age Range</label>
              <div className="flex items-center gap-2">
                <input type="number" placeholder="21" className="w-full bg-bg-50 border border-accent-500/20 rounded-lg p-3" />
                <span>to</span>
                <input type="number" placeholder="35" className="w-full bg-bg-50 border border-accent-500/20 rounded-lg p-3" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Religion</label>
              <select className="w-full bg-bg-50 border border-accent-500/20 rounded-lg p-3">
                <option>Hindu</option>
                <option>Christian</option>
                <option>Muslim</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={() => onNavigate('search')} className="w-full bg-primary-700 text-accent-500 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-primary-800 transition-all">
                <Search size={20} /> Search Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-accent-600 font-bold uppercase tracking-widest mb-2">Why Choose Us</h2>
          <h3 className="text-4xl font-serif font-bold text-primary-900">Experience a Better Way to Find Love</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: <Shield className="text-primary-700" size={32} />, title: "100% Verified Profiles", desc: "Every profile goes through a manual verification process to ensure authenticity." },
            { icon: <Star className="text-primary-700" size={32} />, title: "AI Compatibility", desc: "Our smart algorithms suggest matches based on lifestyle, values, and personality." },
            { icon: <Users className="text-primary-700" size={32} />, title: "Privacy Control", desc: "You decide who sees your photos and contact details with advanced privacy settings." }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-3xl shadow-xl border border-accent-500/10 text-center"
            >
              <div className="w-20 h-20 bg-accent-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                {f.icon}
              </div>
              <h4 className="text-xl font-serif font-bold mb-4">{f.title}</h4>
              <p className="text-primary-700/70 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Dashboard = ({ user, profile, onNavigate }: { user: UserType, profile: Profile | null, onNavigate: (page: string) => void }) => {
  const [recommendations, setRecommendations] = useState<Profile[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);

  useEffect(() => {
    fetch('/api/profiles')
      .then(res => res.json())
      .then(data => {
        // Filter out current user's profile and opposite gender
        const filtered = data.filter((p: Profile) => p.user_id !== user.id && p.gender !== profile.gender);
        setRecommendations(filtered);
      });
    
    fetch(`/api/interests/${user.id}`).then(res => res.json()).then(setInterests);
  }, [user.id, profile.gender]);

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-2xl border border-accent-500/20">
          <div className="w-24 h-24 bg-accent-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <User size={48} className="text-primary-700" />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-4">Complete Your Profile</h2>
          <p className="text-primary-700/70 mb-10 text-lg">You're just one step away from finding your perfect match. Fill in your details to start receiving recommendations.</p>
          <button onClick={() => onNavigate('edit-profile')} className="btn-primary w-full">Create Profile Now</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-card p-6 text-center relative">
            {user.unique_id && (
              <div className="absolute top-4 right-4 bg-primary-50 text-primary-700 font-mono text-xs px-2 py-1 rounded border border-primary-900/10 shadow-sm">
                {user.unique_id}
              </div>
            )}
            <div className="w-24 h-24 bg-primary-700 rounded-full mx-auto mb-4 border-4 border-accent-500 overflow-hidden mt-4">
              <img src={`https://i.pravatar.cc/150?u=${user.id}`} alt="Me" className="w-full h-full object-cover" />
            </div>
            <h3 className="text-xl font-serif font-bold">{profile.name}</h3>
            <p className="text-sm text-primary-700/60 mb-4">{user.email}</p>
            <div className="bg-accent-500/10 rounded-xl p-3 mb-6">
              <p className="text-xs font-bold uppercase text-accent-600 mb-1">Profile Strength</p>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-accent-500 h-full w-[85%]"></div>
              </div>
              <p className="text-[10px] text-right mt-1 font-bold">85%</p>
            </div>
            <button onClick={() => onNavigate('edit-profile')} className="w-full py-2 border border-primary-700 text-primary-700 rounded-lg text-sm font-bold hover:bg-primary-50 transition-colors">Edit Profile</button>
          </div>

          <div className="glass-card overflow-hidden">
            <div className="p-4 bg-primary-900 text-accent-500 font-bold text-sm uppercase tracking-wider">Quick Links</div>
            <div className="divide-y divide-accent-500/10">
              {[
                { icon: <Heart size={18} />, label: "Interests Received", count: interests.length },
                { icon: <Bookmark size={18} />, label: "Shortlisted", count: 5 },
                { icon: <Users size={18} />, label: "Recent Visitors", count: 12 },
                { icon: <CreditCard size={18} />, label: "Subscription", label2: "Premium" }
              ].map((item, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-accent-500/5 transition-colors text-primary-800">
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.count !== undefined ? (
                    <span className="bg-primary-700 text-accent-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{item.count}</span>
                  ) : (
                    <span className="text-[10px] font-bold text-accent-600 uppercase">{item.label2}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-primary-900">Recommended for You</h2>
              <button onClick={() => onNavigate('search')} className="text-accent-600 font-bold flex items-center gap-1 hover:underline">View All <ChevronRight size={16} /></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map(p => (
                <ProfileCard key={p.user_id} profile={p} userProfile={profile} onSendInterest={(id) => alert(`Interest sent to ${id}`)} />
              ))}
            </div>
          </section>

          <section className="bg-primary-900 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-serif font-bold mb-4">Upgrade to Premium</h3>
              <p className="text-white/70 mb-8 max-w-xl">Get unlimited access to contact details, direct chat, and priority listing in search results. Start your journey with the best tools.</p>
              <button className="bg-accent-500 text-primary-900 px-8 py-3 rounded-full font-bold hover:bg-white transition-all shadow-xl">View Plans</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};


const AuthPage = ({ type, onAuthSuccess }: { type: 'login' | 'signup', onAuthSuccess: (user: UserType, profile: Profile | null) => void }) => {
  const [email, setEmail] = useState(() => localStorage.getItem('reg_email') || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Signup State
  const [step, setStep] = useState(() => {
    const saved = localStorage.getItem('reg_step');
    return saved ? parseInt(saved) : 1;
  });
  const [userId, setUserId] = useState<number | null>(() => {
    const saved = localStorage.getItem('reg_userId');
    return saved ? parseInt(saved) : null;
  });
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (type === 'signup') {
      localStorage.setItem('reg_step', step.toString());
      if (userId) localStorage.setItem('reg_userId', userId.toString());
      localStorage.setItem('reg_email', email);
    }
  }, [step, userId, email, type]);

  const clearRegState = () => {
    localStorage.removeItem('reg_step');
    localStorage.removeItem('reg_userId');
    localStorage.removeItem('reg_email');
    setStep(1);
    setUserId(null);
    setEmail('');
  };
  const [profileData, setProfileData] = useState<any>({
    name: '', gender: 'Bride', dob: '', education: '', profession: '', city: ''
  });
  const [photoBase64, setPhotoBase64] = useState('');
  const [horoscopeBase64, setHoroscopeBase64] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  // Forgot Password State
  const [forgotPasswordStep, setForgotPasswordStep] = useState(0); // 0: none, 1: email, 2: otp & new password
  const [newPassword, setNewPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous error
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        onAuthSuccess(data.user, data.profile);
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Failed to connect to the server. Please check your internet connection.');
    }
  };

  const handleForgotPasswordInit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setUserId(data.userId);
        setForgotPasswordStep(2);
        if (data.debugOtp) {
          setOtp(data.debugOtp);
        }
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to initiate password reset.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Password reset successful! Please login with your new password.');
        setForgotPasswordStep(0);
        setOtp('');
        setNewPassword('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to reset password.');
    }
  };

  const handleRegisterInit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register-init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      setUserId(data.userId);
      setStep(2);
      setError('');
      if (data.debugOtp) {
        setOtp(data.debugOtp);
      }
    } else {
      setError(data.error);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, otp })
    });
    const data = await res.json();
    if (data.success) {
      setStep(3);
      setError('');
    } else {
      setError(data.error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setBase64: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalProfileData = {
      ...profileData,
      photos: JSON.stringify([photoBase64]),
      horoscope_img: horoscopeBase64
    };
    
    const res = await fetch('/api/auth/register-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, profileData: finalProfileData })
    });
    const data = await res.json();
    if (data.success) {
      setStep(5);
      setError('');
    } else {
      setError(data.error);
    }
  };

  const handlePayment = async () => {
    const res = await fetch('/api/payment/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (data.success) {
      setUniqueId(data.uniqueId);
      setStep(6);
      setError('');
      clearRegState();
    } else {
      setError(data.error);
    }
  };

  if (type === 'login') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-10">
          {forgotPasswordStep === 0 ? (
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-primary-900">Welcome Back</h2>
              </div>
              {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</div>}
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold uppercase text-primary-700/60 tracking-widest">Password</label>
                    <button type="button" onClick={() => setForgotPasswordStep(1)} className="text-[10px] font-bold text-accent-600 hover:underline uppercase tracking-widest">Forgot Password?</button>
                  </div>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-lg">Sign In</button>
              </form>
            </>
          ) : forgotPasswordStep === 1 ? (
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-primary-900">Reset Password</h2>
                <p className="text-primary-700/60 mt-2">Enter your email to receive a reset OTP.</p>
              </div>
              {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</div>}
              <form onSubmit={handleForgotPasswordInit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <div className="flex gap-4">
                  <button type="button" onClick={() => setForgotPasswordStep(0)} className="flex-1 py-4 border-2 border-primary-700 rounded-xl text-primary-700 font-bold">Back</button>
                  <button type="submit" className="flex-[2] btn-primary py-4 text-lg">Send OTP</button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="text-center mb-10">
                <h2 className="text-3xl font-serif font-bold text-primary-900">New Password</h2>
                <p className="text-primary-700/60 mt-2">Enter the OTP sent to your email and your new password.</p>
              </div>
              {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</div>}
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">OTP</label>
                  <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500 text-center text-2xl tracking-widest" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">New Password</label>
                  <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-lg">Reset Password</button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-2xl p-10">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-primary-900">Registration - Step {step} of 5</h2>
          <div className="flex justify-center gap-2 mt-4">
            {[1,2,3,4,5].map(s => (
              <div key={s} className={`h-2 w-12 rounded-full ${s <= step ? 'bg-accent-500' : 'bg-primary-900/10'}`}></div>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="space-y-4 mb-6">
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm font-medium border border-red-100">{error}</div>
            <button 
              type="button"
              onClick={clearRegState}
              className="text-[10px] font-bold text-accent-600 uppercase tracking-widest hover:underline"
            >
              Reset Registration & Start Over
            </button>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleRegisterInit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Email Address</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">Create Account</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 text-sm font-medium">An OTP has been sent to {email}. (Check server logs for demo OTP)</div>
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Enter OTP</label>
              <input type="text" required value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500 text-center text-2xl tracking-widest" />
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">Verify Email</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Profile For</label>
                <select value={profileData.gender} onChange={(e) => setProfileData({...profileData, gender: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500">
                  <option value="Bride">Bride (பெண்)</option>
                  <option value="Groom">Groom (ஆண்)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Full Name</label>
                <input type="text" required value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Date of Birth</label>
                <input type="date" required value={profileData.dob} onChange={(e) => setProfileData({...profileData, dob: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Mother Tongue</label>
                <input type="text" required value={profileData.mother_tongue} onChange={(e) => setProfileData({...profileData, mother_tongue: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="e.g. Tamil" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Caste / Sub Caste</label>
                <input type="text" required value={profileData.caste} onChange={(e) => setProfileData({...profileData, caste: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Star (நட்சத்திரம்)</label>
                <select required value={profileData.star} onChange={(e) => setProfileData({...profileData, star: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500">
                  <option value="">Select Star</option>
                  {NAKSHATRAS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Rasi (ராசி)</label>
                <select required value={profileData.rasi} onChange={(e) => setProfileData({...profileData, rasi: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500">
                  <option value="">Select Rasi</option>
                  {RASIS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Education</label>
                <input type="text" required value={profileData.education} onChange={(e) => setProfileData({...profileData, education: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Profession</label>
                <input type="text" required value={profileData.profession} onChange={(e) => setProfileData({...profileData, profession: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">City</label>
                <input type="text" required value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">Next: Upload Photos</button>
          </form>
        )}

        {step === 4 && (
          <form onSubmit={handleUploadsSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Upload Photo</label>
              <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setPhotoBase64)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4" />
              {photoBase64 && <img src={photoBase64} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-xl" />}
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Upload Horoscope (Image)</label>
              <input type="file" accept="image/*" required onChange={(e) => handleFileChange(e, setHoroscopeBase64)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4" />
              {horoscopeBase64 && <img src={horoscopeBase64} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-xl" />}
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">Save & Continue to Payment</button>
          </form>
        )}

        {step === 5 && (
          <div className="text-center space-y-6">
            <div className="bg-primary-50 p-6 rounded-xl border border-primary-900/10">
              <h3 className="text-xl font-bold text-primary-900 mb-2">Registration Fee</h3>
              <p className="text-3xl font-bold text-accent-600">₹1,500</p>
              <p className="text-sm text-primary-700/60 mt-2">One-time fee for lifetime validity</p>
            </div>
            <button onClick={handlePayment} className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2">
              <CreditCard size={20} /> Pay Now (Mock Gateway)
            </button>
          </div>
        )}

        {step === 6 && (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={40} />
            </div>
            <h3 className="text-2xl font-bold text-primary-900">Registration Successful!</h3>
            <p className="text-primary-700/80">Your profile has been created and payment is confirmed.</p>
            <div className="bg-primary-50 p-6 rounded-xl border border-primary-900/10 inline-block">
              <p className="text-sm text-primary-700/60 uppercase font-bold mb-1">Your Unique ID</p>
              <p className="text-3xl font-bold text-accent-600 tracking-wider">{uniqueId}</p>
            </div>
            <button onClick={() => window.location.reload()} className="btn-primary w-full py-4 text-lg mt-6">
              Login to Dashboard
            </button>
          </div>
        )}

      </motion.div>
    </div>
  );
};
const ContactPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-accent-600 font-bold uppercase tracking-widest mb-2">Get In Touch</h2>
        <h3 className="text-4xl font-serif font-bold text-primary-900">Contact கந்தன் குடில் செங்குந்தர் திருமண ஜாதக பரிவர்த்தனை மையம்</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="glass-card p-10">
          <h4 className="text-2xl font-serif font-bold mb-8 text-primary-900">Send us a Message</h4>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Full Name</label>
                <input type="text" className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="Your Name" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Email Address</label>
                <input type="email" className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="name@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Subject</label>
              <input type="text" className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="How can we help?" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Message</label>
              <textarea rows={5} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" placeholder="Your message here..."></textarea>
            </div>
            <button type="button" className="btn-primary w-full py-4 text-lg">Send Message</button>
          </form>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 flex gap-6">
            <div className="w-14 h-14 bg-accent-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <MapPin className="text-primary-700" size={28} />
            </div>
            <div>
              <h5 className="font-serif font-bold text-xl mb-2 text-primary-900">Our Office</h5>
              <p className="text-primary-700/70 leading-relaxed">
                43-F/121, அருணாசலம் தெரு, அம்மாபேட்டை,<br />
                சேலம் – 636003.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 flex gap-6">
            <div className="w-14 h-14 bg-accent-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <MessageSquare className="text-primary-700" size={28} />
            </div>
            <div>
              <h5 className="font-serif font-bold text-xl mb-2 text-primary-900">Email Us</h5>
              <p className="text-primary-700/70 leading-relaxed">
                kandhankudilmatrimony@gmail.com
              </p>
            </div>
          </div>

          <div className="glass-card p-8 flex gap-6">
            <div className="w-14 h-14 bg-accent-500/10 rounded-2xl flex items-center justify-center shrink-0">
              <Shield className="text-primary-700" size={28} />
            </div>
            <div>
              <h5 className="font-serif font-bold text-xl mb-2 text-primary-900">Customer Support</h5>
              <p className="text-primary-700/70 leading-relaxed">
                Available Mon-Sat: 9:00 AM - 6:00 PM<br />
                +91 97903 33735
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeChat, setActiveChat] = useState<{targetId: number, targetName: string} | null>(null);

  useEffect(() => {
    (window as any).openChat = (targetId: number, targetName: string) => {
      setActiveChat({ targetId, targetName });
    };
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get('session_id');
    if (params.get('payment') === 'success' && sessionId) {
      fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("Payment successful! Your membership has been activated.");
          if (user) {
            setUser({ ...user, payment_status: 'completed', unique_id: data.uniqueId });
            setCurrentPage('dashboard');
          }
        }
      });
    }
  }, [user]);

  const handleAuthSuccess = (u: UserType, p: Profile | null) => {
    setUser(u);
    setProfile(p);
    if (u.payment_status === 'completed') {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('plans');
    }
  };

  const handleUpdateProfile = async (updatedProfile: Partial<Profile>) => {
    if (!user) return;
    const res = await fetch('/api/auth/register-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, profileData: updatedProfile })
    });
    const data = await res.json();
    if (data.success) {
      setProfile({ ...profile!, ...updatedProfile });
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setProfile(null);
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} onLogout={handleLogout} onNavigate={setCurrentPage} />
      
      <main className="flex-grow">
        <a 
          href="https://wa.me/919790333735" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition-all"
        >
          <MessageSquare size={28} />
        </a>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentPage === 'home' && <HomePage onNavigate={setCurrentPage} />}
            {currentPage === 'login' && <AuthPage type="login" onAuthSuccess={handleAuthSuccess} />}
            {currentPage === 'signup' && <AuthPage type="signup" onAuthSuccess={handleAuthSuccess} />}
            {currentPage === 'about' && <AboutUsPage />}
            {currentPage === 'contact' && <ContactPage />}
            {currentPage === 'dashboard' && user && <Dashboard user={user} profile={profile} onNavigate={setCurrentPage} />}
            {currentPage === 'search' && <SearchPage userProfile={profile} />}
            {currentPage === 'admin' && user && <AdminPanel user={user} />}
            {currentPage === 'horoscope' && <HoroscopeSection />}
            {currentPage === 'success' && <SuccessStoriesPage />}
            {currentPage === 'plans' && <MembershipPlansPage user={user} profile={profile} />}
            {currentPage === 'edit-profile' && profile && <EditProfile profile={profile} onUpdate={handleUpdateProfile} onCancel={() => setCurrentPage('dashboard')} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {activeChat && user && (
        <ChatWindow 
          currentUserId={user.id} 
          targetUserId={activeChat.targetId} 
          targetName={activeChat.targetName} 
          onClose={() => setActiveChat(null)} 
        />
      )}

      <footer className="bg-primary-900 text-accent-500 py-20 border-t border-accent-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center mr-3">
                  <Heart className="text-primary-900 fill-primary-900" size={20} />
                </div>
                <h2 className="text-xl font-serif font-bold tracking-wider">கந்தன் குடில்</h2>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-8">
                The most trusted matrimonial service for the Tamil community worldwide. Helping souls find their eternal partners since 2010.
              </p>
              <div className="flex gap-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border border-accent-500/30 flex items-center justify-center hover:bg-accent-500 hover:text-primary-900 transition-all cursor-pointer">
                    <Star size={18} />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li><button onClick={() => setCurrentPage('home')} className="hover:text-accent-500 transition-colors">Home</button></li>
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-accent-500 transition-colors">About Us</button></li>
                <li><button onClick={() => setCurrentPage('search')} className="hover:text-accent-500 transition-colors">Search Profiles</button></li>
                <li><button onClick={() => setCurrentPage('success')} className="hover:text-accent-500 transition-colors">Success Stories</button></li>
                <li><button onClick={() => setCurrentPage('plans')} className="hover:text-accent-500 transition-colors">Membership Plans</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Support</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li><button onClick={() => setCurrentPage('contact')} className="hover:text-accent-500 transition-colors">Contact Us</button></li>
                <li><button className="hover:text-accent-500 transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-accent-500 transition-colors">Terms of Service</button></li>
                <li><button className="hover:text-accent-500 transition-colors">Help Center</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Contact Us</h4>
              <ul className="space-y-4 text-white/60 text-sm">
                <li className="flex gap-3">
                  <MapPin size={18} className="text-accent-500 shrink-0" />
                  <span>43-F/121, அருணாசலம் தெரு, அம்மாபேட்டை, சேலம் – 636003.</span>
                </li>
                <li className="flex gap-3">
                  <Info size={18} className="text-accent-500 shrink-0" />
                  <span>kandhankudilmatrimony@gmail.com</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Newsletter</h4>
              <p className="text-white/60 text-sm mb-6">Get the latest match recommendations directly in your inbox.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email address" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-accent-500" />
                <button className="bg-accent-500 text-primary-900 px-4 py-2 rounded-lg font-bold text-sm hover:bg-white transition-all">Join</button>
              </div>
            </div>
          </div>
          
          <div className="mt-20 pt-8 border-t border-white/10 text-center text-white/40 text-xs">
            <p>© 2026 கந்தன் குடில் செங்குந்தர் திருமண ஜாதக பரிவர்த்தனை மையம். All rights reserved. Designed with love for the community.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
