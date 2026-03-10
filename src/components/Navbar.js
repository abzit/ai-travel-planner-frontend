'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Plane, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    // Dispatch storage event so other components update too
    window.dispatchEvent(new Event('storage'));
    router.push('/login');
  };

  return (
    <nav className="fixed w-full z-50 glass transition-all duration-300">
      <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              AI Travel Planner
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className={`transition px-3 py-2 ${pathname === '/dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-600 font-medium hover:text-indigo-600'}`}>
                  Dashboard
                </Link>
                <Link href="/create-trip" className={`transition px-3 py-2 ${pathname === '/create-trip' ? 'text-indigo-600 font-bold' : 'text-slate-600 font-medium hover:text-indigo-600'}`}>
                  Create Trip
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`transition px-3 py-2 ${pathname === '/login' ? 'text-indigo-600 font-bold' : 'text-slate-600 font-medium hover:text-indigo-600'}`}>
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={`transition px-5 py-2 font-medium rounded-full ${pathname === '/register' ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg' : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700 hover:shadow-lg'}`}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-indigo-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className={`block px-3 py-2 rounded-md ${pathname === '/dashboard' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600 font-medium hover:text-indigo-600 hover:bg-slate-50'}`}>
                  Dashboard
                </Link>
                <Link href="/create-trip" className={`block px-3 py-2 rounded-md ${pathname === '/create-trip' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600 font-medium hover:text-indigo-600 hover:bg-slate-50'}`}>
                  Create Trip
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={`block px-3 py-2 rounded-md ${pathname === '/login' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600 font-medium hover:text-indigo-600 hover:bg-slate-50'}`}>
                  Log in
                </Link>
                <Link href="/register" className={`block px-3 py-2 rounded-md ${pathname === '/register' ? 'text-indigo-600 font-bold bg-indigo-50/50' : 'text-slate-600 font-medium hover:text-indigo-600 hover:bg-slate-50'}`}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
