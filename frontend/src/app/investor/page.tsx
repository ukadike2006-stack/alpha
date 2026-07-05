'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';
import { opportunitiesApi, messagesApi, adminApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function InvestorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [opps, setOpps] = useState<any[]>([]);
  const [pitches, setPitches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowModal] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const u = getCurrentUser();
    if (u?.role !== 'INVESTOR') { router.push('/login'); return; }
    setUser(u);

    const loadData = async () => {
      try {
        const [oppsRes, msgRes] = await Promise.all([
          opportunitiesApi.listPublic(),
          messagesApi.inbox()
        ]);
        // Filter my opps
        setOpps(oppsRes.data.filter((o: any) => o.postedBy.id === u.id));
        // Filter pitches
        setPitches(msgRes.data.filter((m: any) => m.content.startsWith('PITCH:')));
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
      <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black text-alpha-dark">Investor Dashboard</h1>
            <p className="text-gray-500">Managing funding and discovering founders.</p>
          </div>
          <Button onClick={() => setShowModal(true)}>Post New Opportunity</Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          {/* Column 1: Stats & Opportunities */}
          <div className="lg:col-span-2 space-y-8">
              <section>
                  <h2 className="text-xl font-bold mb-6 text-alpha-dark">My Posted Opportunities</h2>
                  <div className="grid gap-4">
                      {opps.length === 0 ? (
                          <Card className="text-center py-10 text-gray-400">No opportunities posted yet.</Card>
                      ) : (
                          opps.map(o => (
                              <Card key={o.id} className="flex justify-between items-center">
                                  <div>
                                      <p className="font-bold">{o.title}</p>
                                      <p className="text-xs text-gray-400">{o.fundingType} · {o.targetCountry}</p>
                                  </div>
                                  <Badge label={o.active ? 'ACTIVE' : 'CLOSED'} />
                              </Card>
                          ))
                      )}
                  </div>
              </section>

              <section>
                  <h2 className="text-xl font-bold mb-6 text-alpha-dark">Pitches Received</h2>
                  <div className="grid gap-6">
                      {pitches.length === 0 ? (
                          <Card className="text-center py-10 text-gray-400">No pitches received yet.</Card>
                      ) : (
                          pitches.map(p => (
                              <Card key={p.id} className="border-l-4 border-alpha-gold">
                                  <div className="flex justify-between items-start mb-4">
                                      <div>
                                          <p className="font-black text-alpha-dark">{p.sender.fullName}</p>
                                          <p className="text-xs text-gray-400">{new Date(p.sentAt).toLocaleDateString()}</p>
                                      </div>
                                      <Button variant="secondary" className="!text-[10px] !py-1">Reply</Button>
                                  </div>
                                  <p className="text-sm text-gray-600 bg-alpha-light/30 p-3 rounded-lg italic">&quot;{p.content}&quot;</p>
                                  <div className="mt-4 flex gap-2">
                                      <button className="text-[10px] font-bold text-alpha-green hover:underline">Mark for Review</button>
                                  </div>
                              </Card>
                          ))
                      )}
                  </div>
              </section>
          </div>

          {/* Column 2: Profile & Network */}
          <div className="space-y-8">
              <Card className="bg-alpha-dark text-white border-none">
                  <h3 className="text-xl font-bold text-alpha-gold mb-4">Ecosystem Stats</h3>
                  <div className="space-y-4">
                      <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-sm text-gray-400">Active Posts</span>
                          <span className="font-bold">{opps.filter(o => o.active).length}</span>
                      </div>
                      <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-sm text-gray-400">Total Pitches</span>
                          <span className="font-bold">{pitches.length}</span>
                      </div>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
}
