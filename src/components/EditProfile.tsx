import React, { useState } from 'react';
import { Profile } from '../types';
import { NAKSHATRAS, RASIS } from '../utils/astrology';

interface EditProfileProps {
  profile: Profile;
  onUpdate: (updatedProfile: Partial<Profile>) => void;
  onCancel: () => void;
}

const EditProfile: React.FC<EditProfileProps> = ({ profile, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Profile>>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="glass-card w-full max-w-5xl p-10 mx-auto">
      <h2 className="text-3xl font-serif font-bold text-primary-900 mb-8 border-b border-accent-500/10 pb-4">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Basic Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-primary-800 border-l-4 border-accent-500 pl-3">Basic Details</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Full Name</label>
                <input type="text" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Age</label>
                  <input type="number" value={formData.age || ''} onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Height</label>
                  <input type="text" value={formData.height || ''} onChange={(e) => setFormData({...formData, height: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Weight</label>
                  <input type="text" value={formData.weight || ''} onChange={(e) => setFormData({...formData, weight: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Mother Tongue</label>
                  <input type="text" value={formData.mother_tongue || ''} onChange={(e) => setFormData({...formData, mother_tongue: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Caste</label>
                  <input type="text" value={formData.caste || ''} onChange={(e) => setFormData({...formData, caste: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Gothram</label>
                  <input type="text" value={formData.gothram || ''} onChange={(e) => setFormData({...formData, gothram: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
                </div>
              </div>
            </div>
          </div>

          {/* Horoscope Details */}
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-primary-800 border-l-4 border-accent-500 pl-3">Horoscope (ஜாதகம்)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Rasi (ராசி)</label>
                <select value={formData.rasi || ''} onChange={(e) => setFormData({...formData, rasi: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all">
                  <option value="">Select Rasi</option>
                  {RASIS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Star (நட்சத்திரம்)</label>
                <select value={formData.star || ''} onChange={(e) => setFormData({...formData, star: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all">
                  <option value="">Select Star</option>
                  {NAKSHATRAS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Lagnam (லக்னம்)</label>
                <input type="text" value={formData.lagnam || ''} onChange={(e) => setFormData({...formData, lagnam: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Dasa (தசை)</label>
                <input type="text" value={formData.dasa || ''} onChange={(e) => setFormData({...formData, dasa: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Birth Place</label>
                <input type="text" value={formData.birth_place || ''} onChange={(e) => setFormData({...formData, birth_place: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Manglik / Dosham</label>
                <select value={formData.manglik || 'No'} onChange={(e) => setFormData({...formData, manglik: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all">
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                  <option value="Don't Know">Don't Know</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Professional & Family */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-accent-500/10">
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-primary-800 border-l-4 border-accent-500 pl-3">Professional Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Education</label>
                <input type="text" value={formData.education || ''} onChange={(e) => setFormData({...formData, education: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Occupation</label>
                <input type="text" value={formData.profession || ''} onChange={(e) => setFormData({...formData, profession: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Annual Income</label>
                <input type="text" value={formData.salary || ''} onChange={(e) => setFormData({...formData, salary: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-primary-800 border-l-4 border-accent-500 pl-3">Family Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Father Name</label>
                <input type="text" value={formData.father_name || ''} onChange={(e) => setFormData({...formData, father_name: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Mother Name</label>
                <input type="text" value={formData.mother_name || ''} onChange={(e) => setFormData({...formData, mother_name: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Siblings (Brothers)</label>
                <input type="number" value={formData.brothers || 0} onChange={(e) => setFormData({...formData, brothers: parseInt(e.target.value)})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Siblings (Sisters)</label>
                <input type="number" value={formData.sisters || 0} onChange={(e) => setFormData({...formData, sisters: parseInt(e.target.value)})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-accent-500/10">
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-primary-800 border-l-4 border-accent-500 pl-3">Contact & Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Phone Number</label>
                <input type="text" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Address</label>
                <textarea value={formData.address || ''} onChange={(e) => setFormData({...formData, address: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all h-24" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">City</label>
                  <input type="text" value={formData.city || ''} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">District</label>
                  <input type="text" value={formData.district || ''} onChange={(e) => setFormData({...formData, district: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">State</label>
                <input type="text" value={formData.state || ''} onChange={(e) => setFormData({...formData, state: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all" />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h3 className="text-xl font-serif font-bold text-primary-800 border-l-4 border-accent-500 pl-3">About & Expectations</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Bio / About Me</label>
                <textarea value={formData.bio || ''} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all h-24" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-primary-700/60 mb-2 tracking-widest">Partner Expectations</label>
                <textarea value={formData.partner_expectations || ''} onChange={(e) => setFormData({...formData, partner_expectations: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:border-accent-500 outline-none transition-all h-24" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-8 border-t border-accent-500/10">
          <button type="submit" className="btn-primary py-4 px-12 shadow-xl shadow-accent-500/20">Save Changes</button>
          <button type="button" onClick={onCancel} className="py-4 px-12 border-2 border-primary-700 rounded-xl text-primary-700 font-bold hover:bg-primary-50 transition-all">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
