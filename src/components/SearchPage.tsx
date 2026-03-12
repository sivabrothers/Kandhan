import { useState, useEffect } from 'react';
import { Filter, Search as SearchIcon } from 'lucide-react';
import { Profile } from '../types';
import ProfileCard from './ProfileCard';
import { NAKSHATRAS, RASIS } from '../utils/astrology';

export const SearchPage = ({ userProfile }: { userProfile: Profile | null }) => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ 
    religion: '', 
    caste: '', 
    gender: '',
    minAge: '',
    maxAge: '',
    star: '',
    rasi: '',
    district: '',
    city: '',
    education: ''
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.minAge) params.append('minAge', filters.minAge);
    if (filters.maxAge) params.append('maxAge', filters.maxAge);
    if (filters.religion) params.append('religion', filters.religion);
    if (filters.caste) params.append('caste', filters.caste);
    if (filters.star) params.append('star', filters.star);
    if (filters.rasi) params.append('rasi', filters.rasi);
    if (filters.district) params.append('district', filters.district);
    if (filters.city) params.append('city', filters.city);
    if (filters.education) params.append('education', filters.education);

    fetch(`/api/search?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProfiles(data);
        setLoading(false);
      });
  }, [filters]);

  const filteredProfiles = profiles;

  if (loading) return <div className="py-20 text-center">Loading profiles...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-primary-900 rounded-3xl p-8 mb-12 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-serif font-bold mb-6">Find Your Perfect Match</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-accent-500">I'm looking for</label>
              <select 
                value={filters.gender}
                onChange={(e) => setFilters({...filters, gender: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500"
              >
                <option value="" className="text-primary-900">All</option>
                <option value="Bride" className="text-primary-900">Bride</option>
                <option value="Groom" className="text-primary-900">Groom</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-accent-500">Star (நட்சத்திரம்)</label>
              <select 
                value={filters.star}
                onChange={(e) => setFilters({...filters, star: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500"
              >
                <option value="" className="text-primary-900">All Stars</option>
                {NAKSHATRAS.map(s => <option key={s} value={s} className="text-primary-900">{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-accent-500">Rasi (ராசி)</label>
              <select 
                value={filters.rasi}
                onChange={(e) => setFilters({...filters, rasi: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white focus:outline-none focus:border-accent-500"
              >
                <option value="" className="text-primary-900">All Rasis</option>
                {RASIS.map(r => <option key={r} value={r} className="text-primary-900">{r}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-accent-500">District</label>
              <input 
                type="text"
                placeholder="Search District"
                value={filters.district}
                onChange={(e) => setFilters({...filters, district: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-accent-500">Age Range</label>
              <div className="flex gap-2">
                <input 
                  type="number"
                  placeholder="Min"
                  value={filters.minAge}
                  onChange={(e) => setFilters({...filters, minAge: e.target.value})}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-500"
                />
                <input 
                  type="number"
                  placeholder="Max"
                  value={filters.maxAge}
                  onChange={(e) => setFilters({...filters, maxAge: e.target.value})}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-accent-500">City</label>
              <input 
                type="text"
                placeholder="Search City"
                value={filters.city}
                onChange={(e) => setFilters({...filters, city: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-accent-500">Caste</label>
              <input 
                type="text"
                placeholder="Search Caste"
                value={filters.caste}
                onChange={(e) => setFilters({...filters, caste: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-accent-500">Education</label>
              <input 
                type="text"
                placeholder="Search Education"
                value={filters.education}
                onChange={(e) => setFilters({...filters, education: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-accent-500"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full btn-primary py-3 flex items-center justify-center gap-2">
                <SearchIcon size={18} />
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8">
        <p className="text-primary-700/60 font-medium">Showing {filteredProfiles.length} profiles</p>
        <div className="flex items-center gap-2 text-sm font-bold text-primary-900">
          <Filter size={16} />
          Sort by: <span className="text-accent-600">Newest First</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProfiles.map(p => (
          <ProfileCard 
            key={p.user_id} 
            profile={p} 
            userProfile={userProfile}
            onSendInterest={(id) => alert(`Interest sent to ${id}`)} 
          />
        ))}
      </div>
      
      {filteredProfiles.length === 0 && (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-accent-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <SearchIcon size={32} className="text-accent-600" />
          </div>
          <h3 className="text-2xl font-serif font-bold text-primary-900 mb-2">No profiles found</h3>
          <p className="text-primary-700/60">Try adjusting your filters to find more matches.</p>
        </div>
      )}
    </div>
  );
};
