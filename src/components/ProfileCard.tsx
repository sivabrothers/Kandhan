import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Briefcase, GraduationCap, Star, MessageSquare, CheckCircle2 } from 'lucide-react';
import { Profile } from '../types';
import { getCompatibilityScore } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { calculateMatch, MatchResult } from '../utils/astrology';

interface ProfileCardProps {
  profile: Profile;
  userProfile?: Profile | null;
  onSendInterest: (id: number) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, userProfile, onSendInterest }) => {
  const [aiMatch, setAiMatch] = useState<{score: number, reasoning: string, keyMatches: string[]} | null>(null);
  const [porutham, setPorutham] = useState<MatchResult | null>(null);
  const [showPorutham, setShowPorutham] = useState(false);

  const photos = JSON.parse(profile.photos || '[]');
  const mainPhoto = photos[0] || `https://picsum.photos/seed/${profile.user_id}/400/500`;

  useEffect(() => {
    if (userProfile && profile && userProfile.user_id !== profile.user_id) {
      getCompatibilityScore(userProfile, profile).then(setAiMatch);
      
      if (userProfile.star && profile.star) {
        const brideStar = userProfile.gender === 'Bride' ? userProfile.star : profile.star;
        const groomStar = userProfile.gender === 'Groom' ? userProfile.star : profile.star;
        setPorutham(calculateMatch(brideStar, groomStar));
      }
    }
  }, [userProfile, profile]);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-accent-500/10 hover:border-accent-500/30"
    >
      <AnimatePresence>
        {showPorutham && porutham && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary-900/60 backdrop-blur-sm"
            onClick={() => setShowPorutham(false)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-primary-900 p-6 text-white flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-serif font-bold">10 Porutham Match</h3>
                  <p className="text-xs text-accent-500 font-bold uppercase tracking-widest">Traditional Compatibility Analysis</p>
                </div>
                <button onClick={() => setShowPorutham(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <Star size={20} className="rotate-45" />
                </button>
              </div>
              
              <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                <div className="flex items-center justify-between p-4 bg-bg-50 rounded-2xl border border-accent-500/10">
                  <div>
                    <div className="text-2xl font-serif font-bold text-primary-900">{porutham.score} / {porutham.total}</div>
                    <div className="text-[10px] font-bold uppercase text-accent-600">Total Points</div>
                  </div>
                  <div className={`px-4 py-1 rounded-full text-xs font-bold ${porutham.indicator === 'Green' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {porutham.indicator === 'Green' ? 'Highly Compatible' : 'Check Rajju/Dina'}
                  </div>
                </div>

                <div className="space-y-2">
                  {Object.entries(porutham.poruthams).map(([name, matched], i) => (
                    <div key={i} className="flex items-start gap-3 p-3 hover:bg-bg-50 rounded-xl transition-colors group">
                      <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${matched ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-bold text-primary-900">{name}</span>
                          <span className={`text-[10px] font-bold uppercase ${matched ? 'text-emerald-600' : 'text-red-600'}`}>{matched ? 'Matched' : 'Not Matched'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-6 bg-bg-50 border-t border-accent-500/10">
                <p className="text-[10px] text-center text-primary-700/40 italic">
                  * This is a traditional calculation based on Nakshatras. For deep analysis, consult an expert.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative h-72 overflow-hidden">
        <img 
          src={mainPhoto} 
          alt={profile.name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/20 to-transparent opacity-60"></div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-xl font-serif font-bold mb-1">{profile.name}</h3>
          <p className="text-xs text-accent-400 font-bold uppercase tracking-widest">{profile.age} Yrs • {profile.height}</p>
        </div>
        
        {aiMatch && (
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-accent-500 text-primary-900 px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1">
              <Star size={14} className="fill-primary-900" /> {aiMatch.score}% AI Match
            </div>
            {porutham && (
              <button 
                onClick={() => setShowPorutham(true)}
                className="bg-primary-900 text-accent-500 px-3 py-1 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 hover:bg-primary-800 transition-colors"
              >
                <CheckCircle2 size={12} /> {porutham.score}/{porutham.total} Porutham
              </button>
            )}
          </div>
        )}

        <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-accent-500 hover:text-primary-900 transition-all">
          <Star size={18} />
        </button>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-primary-700/70">
            <Briefcase size={14} className="text-accent-600" />
            <span className="truncate">{profile.profession}</span>
          </div>
          <div className="flex items-center gap-2 text-primary-700/70">
            <GraduationCap size={14} className="text-accent-600" />
            <span className="truncate">{profile.education}</span>
          </div>
          <div className="flex items-center gap-2 text-primary-700/70">
            <MapPin size={14} className="text-accent-600" />
            <span className="truncate">{profile.city}, {profile.state}</span>
          </div>
          <div className="flex items-center gap-2 text-primary-700/70">
            <Star size={14} className="text-accent-600" />
            <span className="truncate">{profile.star} ({profile.rasi})</span>
          </div>
        </div>
        
        {aiMatch && (
          <div className="bg-accent-500/5 p-3 rounded-xl border border-accent-500/10">
            <p className="text-[10px] font-bold text-accent-700 uppercase mb-1">AI Insights</p>
            <p className="text-[11px] text-primary-800 leading-relaxed italic">"{aiMatch.reasoning}"</p>
          </div>
        )}

        <div className="pt-4 border-t border-accent-500/10 flex items-center justify-between">
          <div className="text-[10px] font-bold uppercase text-primary-700/40">
            {profile.caste} • {profile.marital_status}
          </div>
          <button 
            onClick={() => onSendInterest(profile.user_id)}
            className="flex items-center gap-2 text-accent-600 font-bold text-sm hover:text-accent-700 transition-colors"
          >
            <Heart size={16} className="fill-accent-600" />
            Send Interest
          </button>
          <button 
            onClick={() => (window as any).openChat?.(profile.user_id, profile.name)}
            className="p-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            title="Chat"
          >
            <MessageSquare size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileCard;
