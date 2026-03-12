import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const newAuthPage = `
const AuthPage = ({ type, onAuthSuccess }: { type: 'login' | 'signup', onAuthSuccess: (user: UserType, profile: Profile | null) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // Signup State
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<number | null>(null);
  const [otp, setOtp] = useState('');
  const [profileData, setProfileData] = useState<any>({
    name: '', gender: 'Bride', dob: '', education: '', profession: '', city: ''
  });
  const [photoBase64, setPhotoBase64] = useState('');
  const [horoscopeBase64, setHoroscopeBase64] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) {
      onAuthSuccess(data.user, data.profile);
    } else {
      setError(data.error);
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
      horoscope: horoscopeBase64
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
    } else {
      setError(data.error);
    }
  };

  if (type === 'login') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-md p-10">
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
              <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Password</label>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">Sign In</button>
          </form>
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
              <div key={s} className={\`h-2 w-12 rounded-full \${s <= step ? 'bg-accent-500' : 'bg-primary-900/10'}\`}></div>
            ))}
          </div>
        </div>
        
        {error && <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 text-sm font-medium border border-red-100">{error}</div>}

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
                <select value={profileData.gender} onChange={(e) => setProfileData({...profileData, gender: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4">
                  <option value="Bride">Bride</option>
                  <option value="Groom">Groom</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Full Name</label>
                <input type="text" required value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Date of Birth</label>
                <input type="date" required value={profileData.dob} onChange={(e) => setProfileData({...profileData, dob: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Education</label>
                <input type="text" required value={profileData.education} onChange={(e) => setProfileData({...profileData, education: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Profession</label>
                <input type="text" required value={profileData.profession} onChange={(e) => setProfileData({...profileData, profession: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">City</label>
                <input type="text" required value={profileData.city} onChange={(e) => setProfileData({...profileData, city: e.target.value})} className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4" />
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-4 text-lg">Continue</button>
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
`

const startIndex = content.indexOf("const AuthPage = ({ type, onAuthSuccess }");
const endIndex = content.indexOf("const ContactPage = () => {");

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newAuthPage + content.substring(endIndex);
  fs.writeFileSync('src/App.tsx', content);
  console.log('Replaced AuthPage');
} else {
  console.log('Could not find AuthPage bounds');
}
