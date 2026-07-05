'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn, clearAuth } from '@/lib/auth';
import { adminApi, applicationsApi } from '@/lib/api';
import { User, ApplicationSummary } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const u = getCurrentUser();
    setUser(u);
    if (u?.role === 'ADMIN') {
      adminApi.dashboard().then((r) => setStats(r.data)).catch(console.error);
    } else if (u?.role === 'FOUNDER') {
      applicationsApi.myApplications().then((r) => setApplications(r.data)).catch(console.error);
    }
  }, [router]);

  const logout = () => { clearAuth(); router.push('/login'); };

  if (!user) return <div className="p-12 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.fullName}</h1>
        <button onClick={logout} className="text-red-500 hover:underline">Logout</button>
      </div>
      {user.role === 'ADMIN' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, val]) => (
            <div key={key} className="bg-white rounded-xl p-6 shadow text-center">
              <p className="text-3xl font-bold text-green-700">{String(val)}</p>
              <p className="text-sm text-gray-500 mt-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
            </div>
          ))}
        </div>
      )}
      {user.role === 'FOUNDER' && (
        <div>
          <h2 className="text-xl font-bold mb-4">My Applications</h2>
          {applications.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400">
              No applications yet. <a href="/opportunities" className="text-green-700 font-semibold">Browse opportunities</a>
            </div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl p-4 mb-3 flex justify-between items-center shadow">
                <div>
                  <p className="font-semibold">{app.businessName}</p>
                  <p className="text-sm text-gray-400">{app.fundingType?.replace(/_/g, ' ')}</p>
                </div>
                <span className="text-xs bg-gray-100 px-3 py-1 rounded-full">{app.status?.replace(/_/g, ' ')}</span>
              </div>
            ))
          )}
        </div>
      )}
      {(user.role === 'INVESTOR' || user.role === 'MENTOR') && (
        <div className="bg-white rounded-xl p-8">
          <p className="text-gray-500 mb-4">Welcome to ALPHA. Browse opportunities or connect with founders.</p>
          <a href="/opportunities" className="bg-green-700 text-white px-6 py-2.5 rounded-lg font-semibold inline-block">Browse Opportunities</a>
        </div>
      )}
    </div>
  );
}
