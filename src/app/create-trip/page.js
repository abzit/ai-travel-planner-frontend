"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Plane, Calendar, Wallet, Heart, Sparkles, Plus, X, LogIn } from 'lucide-react';

const PREDEFINED_INTERESTS = [
  "Historical Sites", "Local Cuisine", "Art & Museums", 
  "Nature & Hiking", "Adventure & Sports", "Nightlife", 
  "Shopping", "Relaxation & Spas", "Photography", "Cultural Events"
];

export default function CreateTrip() {
  const [formData, setFormData] = useState({
    destination: '',
    days: 3,
    budgetType: 'Medium',
    interests: []
  });
  const [customInterest, setCustomInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const router = useRouter();

  const isLoggedIn = typeof window !== 'undefined' && !!localStorage.getItem('token');

  const toggleInterest = (interest) => {
    if (formData.interests.includes(interest)) {
      setFormData({ ...formData, interests: formData.interests.filter(i => i !== interest) });
    } else {
      setFormData({ ...formData, interests: [...formData.interests, interest] });
    }
  };

  const addCustomInterest = (e) => {
    e.preventDefault();
    if (customInterest.trim() && !formData.interests.includes(customInterest.trim())) {
      setFormData({ ...formData, interests: [...formData.interests, customInterest.trim()] });
      setCustomInterest('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.interests.length === 0) {
      setError('Please select at least one interest to help AI plan better.');
      return;
    }

    const token = localStorage.getItem('token');
    const hasUsedFreeTrial = localStorage.getItem('hasUsedFreeTrial');

    // Not logged in and already used the free trial — prompt to sign up
    if (!token && hasUsedFreeTrial === 'true') {
      setShowAuthPrompt(true);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        days: Number(formData.days),
      };

      if (token) {
        // Authenticated user — use the normal flow (saves to DB)
        const res = await api.post('/trips/generate', payload);
        router.push(`/trip/${res.data._id}`);
      } else {
        // Guest user — use the guest endpoint (no DB save)
        const res = await api.post('/trips/generate-guest', payload);
        localStorage.setItem('hasUsedFreeTrial', 'true');
        localStorage.setItem('guestTrip', JSON.stringify(res.data));
        router.push('/trip/guest');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate trip.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
          <Sparkles className="w-16 h-16 text-indigo-600 animate-bounce relative z-10" />
        </div>
        <h2 className="mt-8 text-2xl font-bold text-slate-800">AI is crafting your perfect itinerary...</h2>
        <p className="mt-2 text-slate-500">This might take 10-20 seconds as we analyze the best spots in {formData.destination}.</p>
      </div>
    );
  }

  // Auth prompt modal for users who've used their free trial
  if (showAuthPrompt) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4">
        <div className="glass rounded-3xl p-10 sm:p-14 max-w-lg text-center shadow-2xl border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn className="w-10 h-10 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-3">You've Used Your Free Trip!</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            You've already generated a free itinerary as a guest. Sign up for a free account to plan unlimited trips, save your itineraries, and unlock editing features.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push('/register')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-full hover:shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all text-lg"
            >
              Sign Up Free
            </button>
            <button
              onClick={() => router.push('/login')}
              className="px-8 py-4 bg-white text-slate-700 font-bold rounded-full hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all text-lg"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="glass rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-3">
            Design Your Journey
          </h1>
          <p className="text-lg text-slate-500">Share your preferences and let our AI handle the logistics.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                <Plane className="w-4 h-4 mr-2 text-indigo-500" /> Destination
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Tokyo, Japan or Paris"
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition text-lg"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2 text-indigo-500" /> Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  required
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-lg"
                  value={formData.days}
                  onChange={(e) => setFormData({...formData, days: e.target.value})}
                />
              </div>
              
              <div>
                <label className="flex items-center text-sm font-bold text-slate-700 mb-2">
                  <Wallet className="w-4 h-4 mr-2 text-indigo-500" /> Budget Category
                </label>
                <select
                  className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition text-lg"
                  value={formData.budgetType}
                  onChange={(e) => setFormData({...formData, budgetType: e.target.value})}
                >
                  <option value="Low">Backpacker / Low</option>
                  <option value="Medium">Standard / Medium</option>
                  <option value="High">Luxury / High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-bold text-slate-700 mb-3">
                <Heart className="w-4 h-4 mr-2 text-indigo-500" /> Interests & Vibe
              </label>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {PREDEFINED_INTERESTS.map(interest => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.interests.includes(interest)
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              {/* Custom interests currently added */}
              {formData.interests.filter(i => !PREDEFINED_INTERESTS.includes(i)).length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {formData.interests.filter(i => !PREDEFINED_INTERESTS.includes(i)).map(interest => (
                    <span key={interest} className="px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-700 flex items-center shadow-sm">
                      {interest}
                      <button type="button" onClick={() => toggleInterest(interest)} className="ml-2 hover:text-purple-900 transition border-l border-purple-200 pl-2">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <div className="flex gap-2 relative">
                <input
                  type="text"
                  placeholder="e.g., specific activities, dietary needs, or hidden gems..."
                  className="flex-1 px-5 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomInterest(e)}
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  disabled={!customInterest.trim()}
                  className="bg-slate-100 text-slate-600 px-4 rounded-xl hover:bg-slate-200 transition disabled:opacity-50 font-medium"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl py-4 font-bold text-lg hover:shadow-lg hover:shadow-indigo-200 hover:scale-[1.02] transition-all flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate My Perfect Itinerary
          </button>
        </form>
      </div>
    </div>
  );
}
