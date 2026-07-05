'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn, clearAuth } from '@/lib/auth';
import { adminApi, applicationsApi } from '@/lib/api';
import { User, ApplicationSummary } from '@/types';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const u = getCurrentUser();
    setUser(u);

    const fetchData = async () => {
        try {
            if (u?.role === 'ADMIN') {
                const r = await adminApi.dashboard();
                setStats(r.data);
            } else if (u?.role === 'FOUNDER') {
                const r = await applicationsApi.myApplications();
                setApplications(r.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [router]);

  const logout = () => { clearAuth(); router.push('/login'); };

  if (loading) return <Spinner />;
  if (!user) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
            <h1 className="text-4xl font-extrabold text-alpha-dark">Dashboard</h1>
            <p className="text-gray-500 font-medium">Welcome back, <span className="text-alpha-green">{user.fullName}</span></p>
        </div>
        <div className="flex items-center gap-3">
            <Badge label={user.role} />
            <button onClick={logout} className="text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg transition-colors">Logout</button>
        </div>
      </div>

      {user.role === 'ADMIN' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(stats).map(([key, val]) => (
            <Card key={key} className="text-center group">
              <p className="text-4xl font-black text-alpha-green group-hover:scale-110 transition-transform">{String(val)}</p>
              <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
            </Card>
          ))}
        </div>
      )}

      {user.role === 'FOUNDER' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-alpha-dark">Recent Applications</h2>
            <a href="/opportunities" className="btn-primary text-sm">Find New Funding</a>
          </div>

          {applications.length === 0 ? (
            <Card className="text-center py-16">
              <div className="text-5xl mb-4">📂</div>
              <p className="text-gray-400 font-medium mb-6">No active applications found.</p>
              <a href="/opportunities" className="text-alpha-green font-bold hover:underline">Explore Opportunities →</a>
            </Card>
          ) : (
            <div className="grid gap-4">
              {applications.map((app) => (
                <Card key={app.id} className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="font-bold text-lg text-alpha-dark">{app.businessName}</p>
                    <p className="text-sm text-gray-400 font-medium">{app.fundingType?.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-gray-400">{new Date(app.submittedAt).toLocaleDateString()}</span>
                    <Badge label={app.status} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {(user.role === 'INVESTOR' || user.role === 'MENTOR') && (
        <Card className="max-w-2xl">
          <h2 className="text-2xl font-bold text-alpha-green mb-4">Welcome to the Ecosystem</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            As an {user.role.toLowerCase()}, you play a vital role in Africa&apos;s growth. Use the showcase to discover innovation or browse open opportunities to find founders to support.
          </p>
          <div className="flex gap-4">
            <a href="/showcase" className="btn-primary">Browse Showcase</a>
            <a href="/opportunities" className="btn-secondary">Opportunities</a>
          </div>
        </Card>
      )}
    </div>
  );
}
