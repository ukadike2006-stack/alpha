'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { opportunitiesApi, businessApi, adminApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function PitchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [investors, setInvestors] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);

  const [formData, setFormData] = useState({
      businessId: '', investorId: '', opportunityId: '',
      headline: '', problem: '', solution: '', model: '', traction: '',
      amount: '', usage: '', videoUrl: ''
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }

    const loadData = async () => {
        try {
            const [bizRes, usersRes, oppRes] = await Promise.all([
                businessApi.myBusinesses(),
                adminApi.users(),
                opportunitiesApi.listPublic()
            ]);
            setBusinesses(bizRes.data);
            setInvestors(usersRes.data.filter((u: any) => u.role === 'INVESTOR'));
            setOpportunities(oppRes.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [router]);

  const selectedBiz = businesses.find(b => b.id == formData.businessId);

  const handleSubmit = async (type: string) => {
      setSubmitting(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert(`Pitch ${type === 'DRAFT' ? 'saved as draft' : 'submitted successfully'}!`);
      setSubmitting(false);
      if (type !== 'DRAFT') router.push('/dashboard');
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-alpha-dark">Pitch Builder</h1>
          <p className="text-gray-500 font-medium text-lg">Craft a compelling story for your venture.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div className="space-y-8">
              <Card>
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Business</label>
                        <select className="input-field" value={formData.businessId} onChange={e => setFormData({...formData, businessId: e.target.value})}>
                            <option value="">Select Business...</option>
                            {businesses.map(b => <option key={b.id} value={b.id}>{b.businessName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Target Investor</label>
                        <select className="input-field" value={formData.investorId} onChange={e => setFormData({...formData, investorId: e.target.value})}>
                            <option value="">Select Investor...</option>
                            {investors.map(i => <option key={i.id} value={i.id}>{i.firstName} {i.lastName}</option>)}
                        </select>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Headline (Max 100 chars)</label>
                        <input className="input-field" maxLength={100} placeholder="e.g. Revolutionizing Last-Mile Logistics in Lagos"
                            value={formData.headline} onChange={e => setFormData({...formData, headline: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Problem Statement</label>
                        <textarea className="input-field min-h-[80px]" placeholder="What pain point are you solving?"
                            value={formData.problem} onChange={e => setFormData({...formData, problem: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Solution</label>
                        <textarea className="input-field min-h-[80px]" placeholder="How does your business fix the problem?"
                            value={formData.solution} onChange={e => setFormData({...formData, solution: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Traction</label>
                        <textarea className="input-field min-h-[80px]" placeholder="Customers, revenue, growth metrics..."
                            value={formData.traction} onChange={e => setFormData({...formData, traction: e.target.value})} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Funding Amount ($)</label>
                            <input type="number" className="input-field" placeholder="50000"
                                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Pitch Video URL</label>
                            <input className="input-field" placeholder="YouTube link"
                                value={formData.videoUrl} onChange={e => setFormData({...formData, videoUrl: e.target.value})} />
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Button loading={submitting} onClick={() => handleSubmit('SEND')} className="flex-1">Send to Investor</Button>
                    <Button variant="secondary" onClick={() => handleSubmit('DRAFT')} className="px-8">Save Draft</Button>
                </div>
              </Card>
          </div>

          {/* Preview */}
          <div className="sticky top-28 h-fit">
              <h2 className="text-xl font-bold text-alpha-dark mb-6 flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  Live Preview
              </h2>
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                  <div className="bg-alpha-green p-8 text-white">
                      <p className="text-alpha-gold text-xs font-black uppercase tracking-[0.2em] mb-2">{selectedBiz?.businessName || 'Your Business Name'}</p>
                      <h3 className="text-2xl font-bold leading-tight">{formData.headline || 'Your compelling headline will appear here...'}</h3>
                  </div>
                  <div className="p-8 space-y-6">
                      <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">The Problem</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{formData.problem || 'Define the problem clearly.'}</p>
                      </div>
                      <div className="section-divider opacity-20 !my-0"></div>
                      <div>
                          <p className="text-[10px] font-black uppercase text-gray-400 mb-2 tracking-widest">Our Solution</p>
                          <p className="text-gray-600 text-sm leading-relaxed">{formData.solution || 'Describe your innovation.'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-4">
                          <div className="bg-alpha-light/50 p-4 rounded-xl">
                              <p className="text-[10px] font-black uppercase text-alpha-green mb-1">Traction</p>
                              <p className="text-alpha-dark font-bold text-sm">{formData.traction || '-'}</p>
                          </div>
                          <div className="bg-alpha-light/50 p-4 rounded-xl">
                              <p className="text-[10px] font-black uppercase text-alpha-green mb-1">Asking</p>
                              <p className="text-alpha-dark font-bold text-sm">{formData.amount ? `$${Number(formData.amount).toLocaleString()}` : '-'}</p>
                          </div>
                      </div>
                      {formData.videoUrl && (
                          <div className="pt-4">
                              <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200">
                                  Video linked: {formData.videoUrl}
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
