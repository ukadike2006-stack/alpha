'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, clearAuth, isLoggedIn } from '@/lib/auth';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    setUser(getCurrentUser());
  }, [pathname]);

  const logout = () => {
    clearAuth();
    setLoggedIn(false);
    setUser(null);
    router.push('/login');
  };

  const navLinkClass = (path: string) =>
    `hover:text-alpha-gold transition-colors ${pathname === path ? 'text-alpha-gold font-bold underline underline-offset-4' : ''}`;

  const isFounder = user?.role === 'FOUNDER';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="navbar-gradient text-white px-6 py-4 flex items-center justify-between shadow-lg sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-3">
        <img src="/alpha-logo.svg" alt="ALPHA" className="w-8 h-8" />
        <span className="text-alpha-gold font-extrabold text-2xl tracking-tighter">ALPHA</span>
      </Link>

      <div className="flex items-center gap-6 text-sm font-medium">
        <Link href="/opportunities" className={navLinkClass('/opportunities')}>
          Opportunities
        </Link>
        <Link href="/showcase" className={navLinkClass('/showcase')}>
          Showcase
        </Link>

        {loggedIn && isFounder && (
          <>
            <Link href="/investors" className={navLinkClass('/investors')}>
              Investors
            </Link>
            <Link href="/mentors" className={navLinkClass('/mentors')}>
              Mentors
            </Link>
            <Link href="/pitch" className={navLinkClass('/pitch')}>
              Pitch
            </Link>
          </>
        )}

        {loggedIn ? (
          <>
            <Link href="/dashboard" className={navLinkClass('/dashboard')}>
              Dashboard
            </Link>
            {isAdmin && (
              <Link href="/admin" className={navLinkClass('/admin')}>
                Admin Panel
              </Link>
            )}

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 bg-alpha-gold text-alpha-dark rounded-full flex items-center justify-center font-bold border-2 border-white/20 hover:scale-105 transition-transform"
              >
                {user?.fullName?.split(' ').map((n: string) => n[0]).join('')}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 border border-gray-100 text-alpha-dark">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="font-bold text-sm truncate">{user?.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 hover:bg-alpha-light text-sm transition-colors"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setShowDropdown(false)}
                    className="block px-4 py-2 hover:bg-alpha-light text-sm transition-colors"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm transition-colors mt-1"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link href="/login" className="hover:text-alpha-gold transition-colors">Login</Link>
            <Link href="/register" className="btn-secondary text-sm px-5 py-2">Register</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
