'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';

export default function DashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const user = getCurrentUser();
    switch (user?.role) {
      case 'ADMIN':    router.push('/admin');    break;
      case 'INVESTOR': router.push('/investor'); break;
      case 'MENTOR':   router.push('/mentor');   break;
      case 'FOUNDER':  router.push('/founder');  break;
      default:         router.push('/login');
    }
  }, [router]);
  return <div className="p-12 text-center text-gray-400 font-medium">Redirecting to your dashboard...</div>;
}
