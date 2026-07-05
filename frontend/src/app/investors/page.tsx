'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';
import { adminApi, businessApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function InvestorsPage() {
  const router = useRouter();
  const [investors, setInvestors] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [pitchData, setPitchData] = useState({ businessId: '', message: '', amount: '', videoUrl: '' });
  const [pitching, setPitching] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }

    const loadData = async () => {
        try {
            const [usersRes, bizRes] = await Promise.all([
                adminApi.users(),
                businessApi.myBusinesses()
            ]);
            setInvestors(usersRes.data.filter((u: any) => u.role === 'INVESTOR'));
            setBusinesses(bizRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [router]);

  const handleSendPitch = async (e: React.FormEvent) => {
    e.preventDefault();
    setPitching(true);
    // Format the pitch message
    const biz = businesses.find(b => b.id == pitchData.businessId);
    const content = `PITCH: ${biz?.businessName} | Amount: $${pitchData.amount} | Video: ${pitchData.videoUrl} | Message: ${pitchData.message}`;

    try {
        // In a real app: await messagesApi.send(selectedInvestor.id, content);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setSelectedInvestor(null);
            setPitchData({ businessId: '', message: '', amount: '', videoUrl: '' });
        }, 2500);
    } catch (e) {
        console.error(e);
    } finally {
        setPitching(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-alpha-dark">Discover Investors</h1>
          <p className="text-gray-500 font-medium">Connect with partners ready to fuel your vision.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {investors.map(inv => (
          <Card key={inv.id} className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-alpha-gold text-alpha-dark rounded-full flex items-center justify-center font-black text-xl border-2 border-white shadow-sm">
                    {inv.firstName[0]}{inv.lastName[0]}
                </div>
                <div>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        {inv.firstName} {inv.lastName}
                        {inv.active && <span className="text-blue-500 text-xs" title="Verified">✅</span>}
                    </h3>
                    <p className="text-xs font-bold text-alpha-green uppercase tracking-widest">Investor</p>
                </div>
            </div>

            <div className="space-y-3 mb-8 flex-1">
                <div className="text-sm">
                    <p className="text-gray-400 font-bold uppercase text-[10px]">Focus Sector</p>
                    <p className="font-medium text-alpha-dark">AgriTech, FinTech, SaaS</p>
                </div>
                <div className="text-sm">
                    <p className="text-gray-400 font-bold uppercase text-[10px]">Investment Range</p>
                    <p className="font-medium text-alpha-dark">$10k – $100k</p>
                </div>
            </div>

            <div className="flex gap-2">
                <Button onClick={() => setSelectedInvestor(inv)} className="flex-1 text-xs">Send Pitch</Button>
                <Link href="/opportunities" className="btn-secondary flex-1 text-center text-xs py-2.5">Opportunities</Link>
            </div>
          </Card>
        ))}
      </div>

      {/* Pitch Modal */}
      {selectedInvestor && (
        <div className="fixed inset-0 bg-alpha-dark/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg relative overflow-hidden">
                {success ? (
                    <div className="py-12 text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                        <h2 className="text-2xl font-bold text-alpha-dark mb-2">Pitch Sent!</h2>
                        <p className="text-gray-500">Your pitch has been successfully sent to {selectedInvestor.firstName}.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-alpha-dark">Pitch to {selectedInvestor.firstName}</h2>
                            <button onClick={() => setSelectedInvestor(null)} className="text-gray-400 hover:text-alpha-dark">✕</button>
                        </div>
                        <form onSubmit={handleSendPitch} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Select Business</label>
                                <select
                                    className="input-field" required
                                    value={pitchData.businessId} onChange={e => setPitchData({...pitchData, businessId: e.target.value})}
                                >
                                    <option value="">Choose a business...</option>
                                    {businesses.map(b => <option key={b.id} value={b.id}>{b.businessName}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Requested Amount (USD)</label>
                                <input
                                    type="number" className="input-field" placeholder="e.g. 50000" required
                                    value={pitchData.amount} onChange={e => setPitchData({...pitchData, amount: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Pitch Video URL</label>
                                <input
                                    type="url" className="input-field" placeholder="YouTube or Vimeo link"
                                    value={pitchData.videoUrl} onChange={e => setPitchData({...pitchData, videoUrl: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Message</label>
                                <textarea
                                    className="input-field min-h-[100px]" placeholder="Tell the investor why they should back you..." required
                                    value={pitchData.message} onChange={e => setPitchData({...pitchData, message: e.target.value})}
                                />
                            </div>
                            <Button type="submit" loading={pitching} className="w-full">Send Pitch Document</Button>
                        </form>
                    </>
                )}
            </Card>
        </div>
      )}
    </div>
  );
}
