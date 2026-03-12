import { Check, Star, Shield, Zap, Download } from 'lucide-react';
import { generateInvoice } from '../utils/invoice';
import { User, Profile } from '../types';

export const SuccessStoriesPage = () => {
  const stories = [
    {
      id: 1,
      couple: "Karthik & Priya",
      date: "August 2025",
      image: "https://picsum.photos/seed/couple1/800/600",
      story: "We found each other through Kandhan Kudil Matrimony. The horoscope matching was spot on, and our families clicked instantly. Thank you for helping us find our soulmate!"
    },
    {
      id: 2,
      couple: "Suresh & Meenakshi",
      date: "November 2025",
      image: "https://picsum.photos/seed/couple2/800/600",
      story: "The AI matchmaking suggested Meenakshi's profile to me. I was impressed by the detailed profile and the ease of communication. We are now happily married!"
    },
    {
      id: 3,
      couple: "Arun & Deepa",
      date: "January 2026",
      image: "https://picsum.photos/seed/couple3/800/600",
      story: "Finding a partner who shares the same values and traditions was important to us. Kandhan Kudil made the process so simple and trustworthy."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold text-primary-900 mb-4">Success Stories</h2>
        <p className="text-primary-700/60 text-lg max-w-2xl mx-auto">Real stories of love and companionship found through our platform.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {stories.map((story) => (
          <div key={story.id} className="glass-card overflow-hidden group">
            <div className="h-64 overflow-hidden">
              <img 
                src={story.image} 
                alt={story.couple} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif font-bold text-primary-900 mb-2">{story.couple}</h3>
              <p className="text-xs text-accent-600 font-bold uppercase tracking-widest mb-4">Married in {story.date}</p>
              <p className="text-primary-800 leading-relaxed italic">"{story.story}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AboutUsPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-20">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div>
        <h2 className="text-5xl font-serif font-bold text-primary-900 mb-8">About Kandhan Kudil</h2>
        <div className="space-y-6 text-primary-800 text-lg leading-relaxed">
          <p>
            Welcome to <strong>Kandhan Kudil Matrimony</strong>, the most trusted matrimonial service for the Tamil community. Our mission is to help individuals find their perfect life partners through a blend of traditional values and modern technology.
          </p>
          <p>
            We understand that marriage is not just the union of two individuals but also two families. That's why we emphasize detailed profiles, horoscope compatibility, and verified information to ensure a secure and meaningful search experience.
          </p>
          <p>
            With our advanced AI matchmaking and traditional 10 Porutham analysis, we provide a comprehensive platform that respects our cultural heritage while embracing the convenience of the digital age.
          </p>
        </div>
      </div>
      <div className="relative">
        <img 
          src="https://picsum.photos/seed/temple/800/1000" 
          alt="Tamil Tradition" 
          className="rounded-3xl shadow-2xl"
          referrerPolicy="no-referrer"
        />
        <div className="absolute -bottom-8 -left-8 bg-accent-500 p-8 rounded-2xl shadow-xl max-w-xs">
          <p className="text-primary-900 font-serif font-bold text-xl mb-2">Our Vision</p>
          <p className="text-primary-900/80 text-sm">To be the leading platform for Tamil alliances, fostering happy and lasting marriages across the globe.</p>
        </div>
      </div>
    </div>
  </div>
);

export const ContactPage = () => (
  <div className="max-w-7xl mx-auto px-4 py-20">
    <div className="text-center mb-16">
      <h2 className="text-5xl font-serif font-bold text-primary-900 mb-4">Contact Us</h2>
      <p className="text-primary-700/60 text-lg">We are here to assist you in your search. Feel free to reach out to us.</p>
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="glass-card p-8 text-center">
        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-900">
          <Zap size={24} />
        </div>
        <h3 className="font-bold text-primary-900 mb-2">Phone</h3>
        <p className="text-primary-700">+91 97903 33735</p>
      </div>
      <div className="glass-card p-8 text-center">
        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-900">
          <Star size={24} />
        </div>
        <h3 className="font-bold text-primary-900 mb-2">Email</h3>
        <p className="text-primary-700">support@kandhankudil.com</p>
      </div>
      <div className="glass-card p-8 text-center">
        <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4 text-primary-900">
          <Shield size={24} />
        </div>
        <h3 className="font-bold text-primary-900 mb-2">Address</h3>
        <p className="text-primary-700">Tamil Nadu, India</p>
      </div>
    </div>

    <div className="max-w-2xl mx-auto glass-card p-10">
      <h3 className="text-2xl font-serif font-bold text-primary-900 mb-8">Send us a Message</h3>
      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Name</label>
            <input type="text" className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Email</label>
            <input type="email" className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Subject</label>
          <input type="text" className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-primary-700/60 mb-2">Message</label>
          <textarea className="w-full bg-bg-50 border border-accent-500/20 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-accent-500 h-32" />
        </div>
        <button type="button" className="btn-primary w-full py-4 text-lg">Send Message</button>
      </form>
    </div>
  </div>
);

export const MembershipPlansPage = ({ user, profile }: { user?: User | null, profile?: Profile | null }) => {
  const plans = [
    {
      id: 'silver',
      name: 'Silver Plan',
      price: '2,500',
      duration: '3 Months',
      features: ['View 50 Contacts', 'Send Unlimited Interests', 'Basic Support'],
      icon: <Shield className="text-slate-400" size={32} />,
      color: 'bg-slate-50'
    },
    {
      id: 'gold',
      name: 'Gold Plan',
      price: '5,000',
      duration: '6 Months',
      features: ['View 150 Contacts', 'AI Matchmaking Insights', 'Horoscope Matching', 'Priority Support'],
      icon: <Star className="text-amber-400" size={32} />,
      color: 'bg-amber-50',
      popular: true
    },
    {
      id: 'diamond',
      name: 'Diamond Plan',
      price: '10,000',
      duration: '12 Months',
      features: ['View Unlimited Contacts', 'Personal Relationship Manager', 'Profile Highlighting', 'WhatsApp Alerts'],
      icon: <Zap className="text-cyan-400" size={32} />,
      color: 'bg-cyan-50'
    }
  ];

  const handlePayment = async (planId: string) => {
    if (!user) {
      alert("Please login to choose a plan.");
      return;
    }

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, planId })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to initiate payment");
      }
    } catch (err) {
      alert("Error connecting to payment gateway");
    }
  };

  const handleDownloadInvoice = (planId: string) => {
    if (!user) return;
    const plan = plans.find(p => p.id === planId);
    if (plan) {
      generateInvoice(user, profile || null, plan);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-serif font-bold text-primary-900 mb-4">Choose Your Path to Happiness</h2>
        <p className="text-primary-700/60 text-lg max-w-2xl mx-auto">Select a membership plan that fits your needs and start your journey towards finding your perfect life partner.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`relative glass-card p-8 flex flex-col ${plan.popular ? 'border-accent-500 border-2 shadow-2xl scale-105 z-10' : 'border-accent-500/10'}`}
          >
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent-500 text-primary-900 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <div className={`w-16 h-16 ${plan.color} rounded-2xl flex items-center justify-center mb-6`}>
              {plan.icon}
            </div>
            
            <h3 className="text-2xl font-serif font-bold text-primary-900 mb-2">{plan.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-primary-900">₹{plan.price}</span>
              <span className="text-primary-700/60 text-sm">/ {plan.duration}</span>
            </div>
            
            <ul className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-primary-800">
                  <Check className="text-accent-600 shrink-0" size={18} />
                  {feature}
                </li>
              ))}
            </ul>
            
            <div className="space-y-3">
              <button 
                onClick={() => handlePayment(plan.id)}
                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'btn-primary' : 'border-2 border-primary-700 text-primary-700 hover:bg-primary-50'}`}
              >
                Choose {plan.name}
              </button>
              
              {user?.payment_status === 'completed' && (
                <button 
                  onClick={() => handleDownloadInvoice(plan.id)}
                  className="w-full py-2 flex items-center justify-center gap-2 text-xs font-bold text-primary-700/60 hover:text-primary-900 transition-colors"
                >
                  <Download size={14} /> Download Last Invoice
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
