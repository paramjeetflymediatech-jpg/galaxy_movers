'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Lock, Mail, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  // Check if already logged in, redirect if so
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          router.push('/admin/dashboard');
        }
      } catch (e) {
        // Not logged in, stay here
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed. Please verify credentials.');
      }

      router.push('/admin/dashboard');
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-950/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        
        {/* Header/Logo section */}
        <div className="text-center space-y-4">
          <div className="bg-red-600 text-white p-3 rounded-2xl w-fit mx-auto shadow-xl shadow-red-600/10">
            <Truck className="h-8 w-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Galaxy Movers Canada
            </h2>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
              Administrative Portal
            </p>
          </div>
        </div>

        {/* Card wrapper */}
        <div className="bg-gray-800/40 border border-gray-800 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleLogin} className="space-y-6">
            
            {errorMsg && (
              <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded-xl text-sm font-semibold flex items-start">
                <AlertCircle className="h-5 w-5 mr-2.5 text-red-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Email input */}
            <div className="flex flex-col space-y-2">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="absolute left-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@galaxymovers.ca"
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-red-600 text-white text-sm py-3 pl-11 pr-4 rounded-xl focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Password input */}
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Password
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4.5 w-4.5 text-gray-500" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-gray-900/50 border border-gray-800 focus:border-red-600 text-white text-sm py-3 pl-11 pr-4 rounded-xl focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-red-600/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center cursor-pointer text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log In Securely</span>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center">
          <a
            href="/"
            className="text-xs text-gray-500 hover:text-red-500 font-bold uppercase tracking-wider transition-colors"
          >
            &larr; Return to main site
          </a>
        </div>

      </div>
    </div>
  );
}
