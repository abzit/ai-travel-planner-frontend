"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, MapPin, List, Map as MapIcon, UserPlus } from 'lucide-react';
import BudgetSummary from '@/components/trip/BudgetSummary';
import HotelRecommendations from '@/components/trip/HotelRecommendations';
import dynamic from 'next/dynamic';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-slate-100 animate-pulse rounded-3xl"></div>
});

export default function GuestTripView() {
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');

  useEffect(() => {
    const stored = localStorage.getItem('guestTrip');
    if (!stored) {
      router.push('/create-trip');
      return;
    }
    try {
      setTrip(JSON.parse(stored));
    } catch {
      router.push('/create-trip');
    }
  }, [router]);

  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col md:flex-row gap-8">
      {/* Left Column: Details & Itinerary */}
      <div className="w-full md:w-7/12 lg:w-2/3 flex flex-col space-y-8">

        {/* Sign-up Banner */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center text-white">
            <UserPlus className="w-6 h-6 mr-3 shrink-0" />
            <div>
              <p className="font-bold text-lg">Sign up to save & edit this trip</p>
              <p className="text-indigo-100 text-sm">Create a free account to unlock editing, day regeneration, and unlimited trip planning.</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/register')}
            className="shrink-0 px-6 py-3 bg-white text-indigo-700 font-bold rounded-full hover:bg-indigo-50 hover:scale-105 transition-all shadow-md"
          >
            Sign Up Free
          </button>
        </div>

        {/* Header Section */}
        <div className="glass rounded-3xl p-8 sm:p-10 shadow-lg border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 tracking-tight">
              {trip.destination}
            </h1>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="flex items-center bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-semibold text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {trip.days} Days
              </span>
              <span className="flex items-center bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-semibold text-sm tracking-wide">
                {trip.budgetType} Budget
              </span>
              {trip.currency && (
                 <span className="flex items-center bg-sky-50 text-sky-700 px-4 py-2 rounded-full font-semibold text-sm">
                   Currency: {trip.currency} ({trip.currencySymbol})
                 </span>
              )}
            </div>

            {trip.interests?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {trip.interests.map((interest, idx) => (
                  <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="md:hidden flex rounded-2xl bg-white p-1 border border-slate-200 shadow-sm sticky top-20 z-40">
          <button 
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center font-bold text-sm transition ${activeTab === 'itinerary' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'}`}
            onClick={() => setActiveTab('itinerary')}
          >
            <List className="w-4 h-4 mr-2" /> Itinerary
          </button>
          <button 
            className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center font-bold text-sm transition ${activeTab === 'map' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-600'}`}
            onClick={() => setActiveTab('map')}
          >
            <MapIcon className="w-4 h-4 mr-2" /> Map View
          </button>
        </div>

        {/* Itinerary Section (Read-Only) */}
        <div className={`space-y-6 ${activeTab === 'itinerary' ? 'block' : 'hidden md:block'}`}>
          <h2 className="text-3xl font-black text-slate-800 flex items-center mb-6 pl-2">
            Your Itinerary
          </h2>
          
          <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[1.125rem] md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-indigo-100 before:via-purple-100 before:to-indigo-50 before:rounded-full pt-4">
            {trip.itinerary?.map((dayPlan, dayIdx) => (
              <div key={dayIdx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Timeline dot */}
                <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform hover:scale-110 border-4 border-white text-white font-black text-sm md:text-lg">
                  {dayIdx + 1}
                </div>
                
                {/* Content */}
                <div className="w-[calc(100%-3.5rem)] md:w-[calc(50%-3rem)] bg-white/80 backdrop-blur-sm p-6 sm:p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-indigo-100 relative group-hover:-translate-y-1">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100/80">
                    <h3 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">Day {dayPlan.day}</h3>
                  </div>
                  
                  <ul className="space-y-3">
                    {dayPlan.activities?.map((activity, actIdx) => (
                      <li key={actIdx} className="flex items-start bg-slate-50/80 hover:bg-white p-4 rounded-2xl border border-transparent hover:border-indigo-100 hover:shadow-md transition-all duration-200 relative">
                        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 mt-0.5 mr-4 shrink-0 font-bold text-xs shadow-sm">
                          {actIdx + 1}
                        </div>
                        <span className="text-slate-700 font-medium leading-relaxed pt-0.5">{activity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Sticky Map & Budget */}
      <div className={`w-full md:w-5/12 lg:w-1/3 space-y-8 ${activeTab === 'map' ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-24 space-y-8">
          <div className="h-[400px] md:h-[450px] w-full relative z-0">
             <MapView locations={trip.mapLocations || []} />
          </div>
          
          <BudgetSummary budget={trip.budgetEstimate} currencySymbol={trip.currencySymbol} />
          <HotelRecommendations hotels={trip.hotels} destination={trip.destination} />
        </div>
      </div>
    </div>
  );
}
