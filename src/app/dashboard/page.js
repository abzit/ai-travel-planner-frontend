"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Plane, Calendar, MapPin, Plus } from 'lucide-react';

export default function Dashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips/my-trips');
        setTrips(res.data);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrips();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-black text-slate-800">Your Trips</h1>
        <Link 
          href="/create-trip" 
          className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-3 rounded-xl font-medium hover:bg-indigo-700 transition"
        >
          <Plus className="w-5 h-5" />
          <span>New Trip</span>
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center shadow-lg border border-slate-100">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-700 mb-4">No trips planned yet</h2>
          <p className="text-slate-500 max-w-md mx-auto mb-8">
            Tell us where you want to go and what you love doing, and our AI will plan the perfect itinerary for you.
          </p>
          <Link 
            href="/create-trip" 
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-full font-bold hover:bg-indigo-700 hover:shadow-lg transition"
          >
            Start Your First Adventure
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <Link 
              href={`/trip/${trip._id}`} 
              key={trip._id}
              className="glass rounded-2xl p-6 hover:shadow-xl hover:scale-[1.02] transition-all border border-slate-100 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition">
                  <MapPin className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="block text-2xl font-black text-slate-800">{trip.days}</span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Days</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{trip.destination}</h3>
              <div className="flex items-center text-sm text-slate-500 space-x-4">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1"/> {new Date(trip.createdAt).toLocaleDateString()}</span>
                <span className="bg-slate-100 px-2 py-1 rounded-md text-xs font-medium">{trip.budgetType} Budget</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
