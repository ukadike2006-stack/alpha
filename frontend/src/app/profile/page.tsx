import Link from 'next/link';
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';
import { businessApi, adminApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('business');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [investors, setInvestors] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }

    const loadData = async () => {
        try {
            const u = getCurrentUser();
            setUser(u);

            const [bizRes, usersRes] = await Promise.all([
                businessApi.myBusinesses(),
                adminApi.users()
            ]);

            setBusiness(bizRes.data[0]);
            setInvestors(usersRes.data.filter((usr: any) => usr.role === 'INVESTOR'));
            setMentors(usersRes.data.filter((usr: any) => usr.role === 'MENTOR'));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [router]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  if (loading) return <Spinner />;

  const isFounder = user?.role === 'FOUNDER';

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Profile Card */}
      <Card className="mb-10 !p-10 border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-alpha-gold/10 rounded-bl-full"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="w-32 h-32 bg-alpha-green text-alpha-gold rounded-full flex items-center justify-center text-4xl font-black border-4 border-white shadow-xl">
            {user?.fullName?.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-black text-alpha-dark mb-2">{user?.fullName}</h1>
            <p className="text-gray-500 font-medium mb-4 flex items-center justify-center md:justify-start gap-2">
                {user?.email} · <span className="text-alpha-green font-bold">{user?.role}</span>
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="bg-alpha-sand/30 text-alpha-earth px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Nigeria</span>
                <span className="bg-alpha-sand/30 text-alpha-earth px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Lagos</span>
                {isFounder && business && <span className="bg-alpha-gold/20 text-alpha-earth px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{business.sector}</span>}
            </div>
          </div>
          <div className="w-full md:w-64">
              <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-black text-alpha-dark uppercase tracking-widest">Profile Status</span>
                  <span className="text-xs font-black text-alpha-green uppercase tracking-widest">70%</span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                  <div className="h-full bg-alpha-green rounded-full shadow-sm" style={{ width: '70%' }}></div>
              </div>
              <button onClick={handleSave} className="w-full mt-4 text-xs font-bold uppercase tracking-tighter text-alpha-green hover:underline">Edit Detailed Info</button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
          {['business', 'investors', 'mentors', 'pitches'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-xs font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeTab === tab ? 'text-alpha-green border-b-4 border-alpha-green' : 'text-gray-400 hover:text-alpha-dark'}`}
              >
                  {tab.replace(/([A-Z])/g, ' $1')}
              </button>
          ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
          {activeTab === 'business' && (
              <div className="grid md:grid-cols-2 gap-8 animate-fade-in">
                  <Card>
                      <h3 className="text-xl font-bold mb-6 text-alpha-dark flex items-center gap-2">
                          <span className="w-2 h-6 bg-alpha-gold rounded-full"></span>
                          Business Details
                      </h3>
                      {business ? (
                          <div className="space-y-4">
                              <div><p className="text-[10px] font-black uppercase text-gray-400">Name</p><p className="font-bold">{business.businessName}</p></div>
                              <div><p className="text-[10px] font-black uppercase text-gray-400">Sector</p><p className="font-bold">{business.sector}</p></div>
                              <div><p className="text-[10px] font-black uppercase text-gray-400">Registration</p><p className="font-bold">{business.registrationNumber}</p></div>
                              <div><p className="text-[10px] font-black uppercase text-gray-400">Country</p><p className="font-bold">{business.countryOfOperation}</p></div>
                          </div>
                      ) : <p className="text-gray-400 italic">No business registered yet.</p>}
                  </Card>
                  <Card>
                      <h3 className="text-xl font-bold mb-6 text-alpha-dark flex items-center gap-2">
                          <span className="w-2 h-6 bg-alpha-gold rounded-full"></span>
                          Founder Verification
                      </h3>
                      <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <span className="text-sm font-bold text-green-700">Email Verified</span>
                              <span className="text-green-600">✓</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                              <span className="text-sm font-bold text-green-700">ID Document</span>
                              <span className="text-green-600">✓</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-alpha-sand/20 rounded-lg opacity-50">
                              <span className="text-sm font-bold text-alpha-earth">Tax Proof</span>
                              <span className="text-alpha-earth">Pending</span>
                          </div>
                      </div>
                  </Card>
              </div>
          )}

          {activeTab === 'investors' && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                  {investors.map(inv => (
                      <Card key={inv.id} className="text-center group hover:scale-[1.02] transition-transform">
                          <div className="w-16 h-16 bg-alpha-gold text-alpha-dark rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-white shadow-md">
                              {inv.firstName[0]}{inv.lastName[0]}
                          </div>
                          <h4 className="font-bold text-alpha-dark">{inv.firstName} {inv.lastName}</h4>
                          <p className="text-xs font-bold text-alpha-green uppercase mb-6">Active Investor</p>
                          <Button variant="primary" className="w-full !text-[10px] !py-2">Send Pitch</Button>
                      </Card>
                  ))}
              </div>
          )}

          {activeTab === 'mentors' && (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {mentors.map(m => (
                    <Card key={m.id} className="text-center group hover:scale-[1.02] transition-transform">
                        <div className="w-16 h-16 bg-alpha-green text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-white shadow-md">
                            {m.firstName[0]}{m.lastName[0]}
                        </div>
                        <h4 className="font-bold text-alpha-dark">{m.firstName} {m.lastName}</h4>
                        <p className="text-xs font-bold text-alpha-gold uppercase mb-6">Expert Mentor</p>
                        <div className="flex gap-2">
                            <Button variant="secondary" className="flex-1 !text-[10px] !py-2">Follow</Button>
                            <Button variant="primary" className="flex-1 !text-[10px] !py-2">Request</Button>
                        </div>
                    </Card>
                ))}
            </div>
          )}

          {activeTab === 'pitches' && (
              <Card className="text-center py-20 animate-fade-in">
                  <div className="text-5xl mb-4 opacity-20">🚀</div>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Pitch History Empty</p>
                  <Link href="/pitch" className="mt-6 inline-block text-alpha-green font-bold hover:underline">Draft Your First Pitch →</Link>
              </Card>
          )}
      </div>

      {success && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-alpha-dark text-alpha-gold px-8 py-4 rounded-2xl shadow-2xl font-bold animate-bounce z-[200]">
            ✓ Profile Preferences Updated Locally
        </div>
      )}
    </div>
  );
}
