'use client';

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/features/auth/authSlice';
import { AppDispatch } from '@/lib/store';

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <nav className="container mx-auto flex items-center justify-between p-4">
        <div>
          <Link href="/" className="text-2xl font-bold text-dark-space transition-colors hover:text-forest-green">
            Productify
          </Link>
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="rounded-full bg-burnt-sienna px-5 py-2 font-semibold text-off-white shadow-sm transition-transform duration-300 hover:scale-105 active:scale-95"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
}