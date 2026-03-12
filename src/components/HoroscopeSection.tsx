import { useState } from 'react';
import { Upload, Star } from 'lucide-react';

export const HoroscopeSection = () => {
  const [horoscopeData, setHoroscopeData] = useState({
    rasi: '', nakshatra: '', lagna: '', dasa: '', pob: '', tob: ''
  });

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-accent-500/20">
      <h3 className="text-2xl font-serif font-bold text-primary-900 mb-6 flex items-center gap-3">
        <Star className="text-accent-500" /> Horoscope (ஜாதகம்)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {['Rasi', 'Nakshatra', 'Lagna', 'Dasa', 'Place of Birth', 'Time of Birth'].map(field => (
          <div key={field}>
            <label className="block text-sm font-bold text-primary-700 mb-2">{field}</label>
            <input type="text" className="w-full border rounded-lg p-3" placeholder={field} />
          </div>
        ))}
      </div>
      <div className="border-2 border-dashed border-accent-500/30 rounded-2xl p-10 text-center">
        <Upload className="mx-auto text-accent-500 mb-4" size={40} />
        <p className="text-primary-700 font-bold mb-2">Upload Horoscope (PDF/Image)</p>
        <input type="file" className="block mx-auto text-sm text-gray-500" />
      </div>
      <button className="w-full mt-8 btn-primary">Save Horoscope Details</button>
    </div>
  );
};
