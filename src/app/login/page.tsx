'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/features/auth/authSlice';
import { AppDispatch, RootState } from '@/lib/store';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { token, loading, error } = useSelector((state: RootState) => state.auth);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      dispatch(loginUser(email));
    }
  };

  useEffect(() => {
    if (token) {
      router.push('/');
    }
  }, [token, router]);

  return (
    <div className="flex min-h-screen w-full bg-dark-space text-off-white">
      {/* Left Column: Form */}
      <div className="flex w-full flex-col items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-off-white sm:text-5xl">
              Productify
            </h1>
            <p className="mt-4 text-lg text-off-white/60">
              Welcome back! Please sign in to continue.
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                   <svg className="h-5 w-5 text-off-white/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </span>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border-2 border-off-white/20 bg-off-white/10 px-12 py-3 text-off-white placeholder-off-white/40 shadow-sm transition-colors focus:border-tan focus:outline-none focus:ring-0"
                  placeholder="you@example.com"
                  required
                  disabled={loading === 'pending'}
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading === 'pending'}
              className="w-full rounded-full bg-tan px-4 py-3 text-lg font-semibold text-white shadow-lg shadow-tan/30 transition-transform duration-300 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:bg-opacity-50"
            >
              {loading === 'pending' ? 'Signing In...' : 'Sign In'}
            </button>

            {error && (
              <p className="pt-2 text-center text-sm text-burnt-sienna">
                {error}
              </p>
            )}
          </form>
        </div>
      </div>
      
      {/* Right Column: Image */}
      <div className="hidden w-1/2 bg-cover bg-center md:block" style={{backgroundImage: "url('https://images.unsplash.com/photo-1674027392857-9aed6e8ecab9?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1632')"}}>
        <div className="h-full w-full bg-dark-space/30"></div>
      </div>
    </div>
  );
}

