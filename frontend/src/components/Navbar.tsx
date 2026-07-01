'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCurrentUser, clearAuth, isLoggedIn } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const user = getCurrentUser();
    if (user) setUserName(user.fullName.split(' ')[0]);
  }, []);

  const logout = () => {
    clearAuth();
    router.push('/login');
  };

  return (
    <nav className="bg-alpha-dark text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-alpha-gold font-extrabold text-2xl tracking-tight">ALPHA</span>
        <span className="text-xs text-gray-400 hidden sm:block">Entrepreneurship Platform</span>
      </Link>

      <div className="flex items-center gap-4 text-sm font-medium">
        <Link href="/opportunities" className="hover:text-alpha-gold transition-colors">
          Opportunities
        </Link>
        {loggedIn ? (
          <>
            <Link href="/dashboard" className="hover:text-alpha-gold transition-colors">
              Dashboard
            </Link>
            <Link href="/applications" className="hover:text-alpha-gold transition-colors">
              My Applications
            </Link>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-alpha-gold transition-colors">Login</Link>
            <Link href="/register" className="btn-secondary text-sm px-4 py-1.5">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
