'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn, clearAuth } from '@/lib/auth';
import { adminApi, applicationsApi, businessApi } from '@/lib/api';
import { User, ApplicationSummary } from '@/types';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
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
                const [appRes, bizRes] = await Promise.all([
                    applicationsApi.myApplications(),
                    businessApi.myBusinesses()
                ]);
                setApplications(appRes.data);
                setBusinesses(bizRes.data);
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-alpha-green text-alpha-gold rounded-full flex items-center justify-center text-2xl font-black border-4 border-white shadow-lg">
                {user.fullName.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
                <h1 className="text-4xl font-extrabold text-alpha-dark">Welcome back, {user.fullName.split(' ')[0]}!</h1>
                <p className="text-gray-500 font-medium">Account Type: <span className="text-alpha-green font-bold">{user.role}</span></p>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <button onClick={logout} className="text-sm font-bold text-red-500 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg transition-colors">Logout</button>
        </div>
      </div>

      {/* Admin Section */}
      {user.role === 'ADMIN' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(stats).map(([key, val]) => (
            <Card key={key} className="text-center group">
              <p className="text-4xl font-black text-alpha-green group-hover:scale-110 transition-transform">{String(val)}</p>
              <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
            </Card>
          ))}
          <div className="col-span-full mt-6">
              <Link href="/admin" className="btn-primary inline-block">Go to Admin Panel</Link>
          </div>
        </div>
      )}

      {/* Founder Section */}
      {user.role === 'FOUNDER' && (
        <div className="space-y-10">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: 'Applications', value: applications.length },
                { label: 'Verified', value: applications.filter(a => a.fullyEligible).length },
                { label: 'Funded', value: applications.filter(a => a.status === 'FUNDED').length },
                { label: 'Businesses', value: businesses.length },
            ].map(s => (
                <div key={s.label} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                    <p className="text-2xl font-black text-alpha-green">{s.value}</p>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-tighter">{s.label}</p>
                </div>
            ))}
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link href="/pitch" className="card group hover:bg-alpha-green transition-colors">
                  <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">🚀</p>
                  <h3 className="font-bold text-xl group-hover:text-white transition-colors">Create a Pitch</h3>
                  <p className="text-sm text-gray-400 group-hover:text-alpha-sand transition-colors">Craft your business story for investors.</p>
              </Link>
              <Link href="/investors" className="card group hover:bg-alpha-gold transition-colors">
                  <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">💼</p>
                  <h3 className="font-bold text-xl group-hover:text-alpha-dark transition-colors">Browse Investors</h3>
                  <p className="text-sm text-gray-400 group-hover:text-alpha-dark/70 transition-colors">Connect with people ready to fund.</p>
              </Link>
              <Link href="/mentors" className="card group hover:bg-alpha-earth/10 transition-colors">
                  <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎓</p>
                  <h3 className="font-bold text-xl text-alpha-dark">Browse Mentors</h3>
                  <p className="text-sm text-gray-400">Get guidance from experienced leaders.</p>
              </Link>
              <Link href="/showcase" className="card group hover:bg-alpha-sunset/10 transition-colors">
                  <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏪</p>
                  <h3 className="font-bold text-xl text-alpha-dark">My Showcase</h3>
                  <p className="text-sm text-gray-400">List your products for the ecosystem.</p>
              </Link>
              <Link href="/businesses/new" className="card group hover:bg-alpha-green/10 transition-colors border-dashed border-2">
                  <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">➕</p>
                  <h3 className="font-bold text-xl text-alpha-dark">Register Business</h3>
                  <p className="text-sm text-gray-400">Add a new venture to your profile.</p>
              </Link>
              <Link href="/applications" className="card group hover:bg-alpha-green/10 transition-colors">
                  <p className="text-3xl mb-2 group-hover:scale-110 transition-transform">📋</p>
                  <h3 className="font-bold text-xl text-alpha-dark">My Applications</h3>
                  <p className="text-sm text-gray-400">Track your funding submissions.</p>
              </Link>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-alpha-dark mb-6">Recent Activity</h2>
            {applications.length === 0 ? (
              <Card className="text-center py-12">
                <p className="text-gray-400 font-medium">No activity to show yet.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {applications.slice(0, 3).map((app) => (
                  <Card key={app.id} className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-alpha-sand/30 text-alpha-earth rounded-lg flex items-center justify-center font-bold text-xs">
                            APP
                        </div>
                        <div>
                            <p className="font-bold text-alpha-dark">{app.businessName}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{app.fundingType?.replace(/_/g, ' ')}</p>
                        </div>
                    </div>
                    <Badge label={app.status} />
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Investor / Mentor placeholder dashboard */}
      {(user.role === 'INVESTOR' || user.role === 'MENTOR') && (
        <div className="grid md:grid-cols-2 gap-8">
            <Card className="flex flex-col">
              <h2 className="text-2xl font-bold text-alpha-green mb-4">Ecosystem Access</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                As an {user.role.toLowerCase()}, you can browse businesses in the showcase or mentor founders through the mentorship hub.
              </p>
              <div className="mt-auto flex gap-3">
                <Link href="/showcase" className="btn-primary flex-1 text-center">Marketplace</Link>
                <Link href="/opportunities" className="btn-secondary flex-1 text-center">Manage Posts</Link>
              </div>
            </Card>
            <Card className="bg-alpha-dark text-white border-none">
                <h3 className="text-xl font-bold text-alpha-gold mb-2">Platform Network</h3>
                <p className="text-sm text-gray-400 mb-6">Discover high-potential founders from across 54 African nations.</p>
                <Link href="/showcase" className="text-alpha-gold font-bold hover:underline">View Showcase →</Link>
            </Card>
        </div>
      )}
    </div>
  );
}
