"use client";
import Link from 'next/link';
import { Plane, Map, Globe, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener('storage', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-300 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-300 w-[400px] h-[400px] rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-4xl text-center space-y-8 relative z-10 animate-fade-in-up">
        <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-tight">
          Your Next Adventure, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Perfectly Planned
          </span>
        </h1>
        
        <p className="text-xl sm:text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Tell our AI where you want to go. We'll instantly generate a complete day-by-day itinerary, budget estimates, and hotel recommendations tailored just for you.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link
            href="/create-trip"
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl hover:shadow-indigo-300 flex items-center justify-center text-lg"
          >
            {isLoggedIn ? "Plan a New Trip" : "Start Planning Free"}
            <Plane className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-full hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center text-lg"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 font-bold rounded-full hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all shadow-sm flex items-center justify-center text-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 sm:grid-cols-3 gap-8 mt-32 relative z-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="glass p-8 rounded-3xl hidden sm:block">
          <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
            <Globe className="w-7 h-7 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Any Destination</h3>
          <p className="text-slate-600 leading-relaxed">From bustling cities to hidden natural wonders. Our generative AI creates expert-level plans anywhere.</p>
        </div>
        
        <div className="glass p-8 rounded-3xl hidden sm:block">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-7 h-7 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">AI Personalization</h3>
          <p className="text-slate-600 leading-relaxed">Foodie? Museum lover? Adventure seeker? Your itinerary is crafted exactly to your stated interests.</p>
        </div>
        
        <div className="glass p-8 rounded-3xl hidden sm:block">
          <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6">
            <Map className="w-7 h-7 text-sky-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-3">Dynamic Editing</h3>
          <p className="text-slate-600 leading-relaxed">Easily discard activities, add your own, or ask the AI to regenerate an entirely new plan for a specific day.</p>
        </div>
      </div>
    </div>
  );
}
