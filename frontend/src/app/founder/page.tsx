'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';
import { applicationsApi, businessApi, opportunitiesApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Link from 'next/link';

export default function FounderPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [apps, setApps] = useState<any[]>([]);
  const [biz, setBiz] = useState<any[]>([]);
  const [opps, setOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const u = getCurrentUser();
    if (u?.role !== 'FOUNDER') { router.push('/login'); return; }
    setUser(u);

    const loadData = async () => {
      try {
        const [appsRes, bizRes, oppsRes] = await Promise.all([
          applicationsApi.myApplications(),
          businessApi.myBusinesses(),
          opportunitiesApi.listPublic()
        ]);
        setApps(appsRes.data);
        setBiz(bizRes.data);
        setOpps(oppsRes.data.slice(0, 3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [router]);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-alpha-green text-alpha-gold rounded-full flex items-center justify-center text-3xl font-black shadow-inner">
                  {user.fullName.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <div>
                  <h1 className="text-3xl font-black text-alpha-dark">Africa&apos;s Next Big Thing?</h1>
                  <p className="text-gray-500 font-medium">Keep building, <span className="text-alpha-green">{user.fullName}</span>.</p>
              </div>
          </div>
          <div className="w-full md:w-64">
              <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                  <span>Profile Strength</span>
                  <span className="text-alpha-green">85%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-alpha-green w-[85%]"></div>
              </div>
          </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
              {/* Quick Actions */}
              <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Quick Launchpad</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[
                          { label: 'Create Pitch', icon: '🚀', href: '/pitch', color: 'bg-alpha-green' },
                          { label: 'Find Investors', icon: '💼', href: '/investors', color: 'bg-alpha-gold' },
                          { label: 'Mentorship', icon: '🎓', href: '/mentors', color: 'bg-alpha-earth' },
                          { label: 'Showcase', icon: '🏪', href: '/showcase', color: 'bg-alpha-sunset' },
                          { label: 'New Business', icon: '➕', href: '/businesses/new', color: 'bg-alpha-dark' },
                          { label: 'Applications', icon: '📋', href: '/applications', color: 'bg-alpha-green' },
                      ].map(a => (
                          <Link key={a.label} href={a.href} className="group p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all text-center">
                              <span className="text-3xl block mb-3 group-hover:scale-110 transition-transform">{a.icon}</span>
                              <span className="text-xs font-black uppercase text-alpha-dark tracking-tighter">{a.label}</span>
                          </Link>
                      ))}
                  </div>
              </section>

              {/* Applications */}
              <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-alpha-dark">My Applications</h2>
                    <Link href="/applications" className="text-xs font-bold text-alpha-green hover:underline">View All</Link>
                  </div>
                  <div className="space-y-3">
                      {apps.length === 0 ? (
                          <Card className="text-center py-10 text-gray-400">No applications started yet.</Card>
                      ) : (
                          apps.map(a => (
                              <Card key={a.id} className="flex justify-between items-center py-4">
                                  <div>
                                      <p className="font-bold text-alpha-dark">{a.businessName}</p>
                                      <p className="text-[10px] text-gray-400 font-bold uppercase">{a.fundingType?.replace(/_/g, ' ')}</p>
                                  </div>
                                  <Badge label={a.status} />
                              </Card>
                          ))
                      )}
                  </div>
              </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
              <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Recommended</h2>
                  <div className="space-y-4">
                      {opps.map(o => (
                          <Card key={o.id} className="group hover:!border-alpha-green">
                              <h4 className="font-bold text-sm mb-2 group-hover:text-alpha-green transition-colors">{o.title}</h4>
                              <p className="text-[10px] text-gray-400 mb-4">{o.targetCountry} · {o.fundingType}</p>
                              <Button className="w-full !text-[10px] !py-1.5">Apply Now</Button>
                          </Card>
                      ))}
                  </div>
              </section>

              <section>
                  <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6">My Registered Businesses</h2>
                  <div className="space-y-3">
                      {biz.map(b => (
                          <div key={b.id} className="flex items-center gap-3 p-4 bg-alpha-sand/10 rounded-xl border border-alpha-sand/20">
                              <div className="w-10 h-10 bg-alpha-gold text-alpha-dark rounded-lg flex items-center justify-center font-black text-xs">
                                  {b.sector[0]}
                              </div>
                              <div>
                                  <p className="font-bold text-sm">{b.businessName}</p>
                                  <p className="text-[10px] text-alpha-earth font-bold uppercase">{b.sector}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>
          </div>
      </div>
    </div>
  );
}
