'use client';
import { useEffect, useState } from 'react';
import { opportunitiesApi } from '@/lib/api';
import { FundingOpportunity } from '@/types';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<FundingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    opportunitiesApi.listPublic()
      .then((r) => setOpportunities(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = opportunities.filter((o) =>
    o.title?.toLowerCase().includes(filter.toLowerCase()) ||
    o.targetSector?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen">
        {/* Banner */}
        <div className="relative h-64 bg-alpha-dark flex items-center justify-center overflow-hidden">
            <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600"
                alt="Meeting"
                className="absolute inset-0 w-full h-full object-cover opacity-40"
            />
            <div className="relative z-10 text-center px-4">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Funding Opportunities</h1>
                <p className="text-alpha-sand text-lg max-w-xl mx-auto">Fuel your growth with capital from leading investors and partners.</p>
            </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex justify-center mb-12">
                <input
                    className="w-full max-w-xl border border-gray-300 rounded-2xl px-6 py-4 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-alpha-green transition-all"
                    placeholder="Search by title, sector or country..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </div>

            {loading ? <Spinner /> : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <p className="text-gray-400 text-lg font-medium">No opportunities match your search.</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {filtered.map((opp) => (
                        <Card key={opp.id} className="flex flex-col group">
                            <div className="flex justify-between items-start mb-4 gap-4">
                                <h3 className="font-bold text-xl text-alpha-dark group-hover:text-alpha-green transition-colors leading-tight">{opp.title}</h3>
                                <Badge label={opp.fundingType} />
                            </div>
                            <p className="text-gray-500 text-sm mb-6 line-clamp-3 leading-relaxed">{opp.description}</p>

                            <div className="mt-auto pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
                                <div className="text-xs">
                                    <p className="text-gray-400 uppercase font-bold tracking-tighter mb-1">Funding Range</p>
                                    <p className="text-alpha-dark font-bold">{opp.currency} {Number(opp.minAmount).toLocaleString()} - {Number(opp.maxAmount).toLocaleString()}</p>
                                </div>
                                <div className="text-xs">
                                    <p className="text-gray-400 uppercase font-bold tracking-tighter mb-1">Target</p>
                                    <p className="text-alpha-dark font-bold truncate">{opp.targetCountry} · {opp.targetSector}</p>
                                </div>
                                {opp.applicationDeadline && (
                                    <div className="text-xs col-span-2 mt-2 flex items-center gap-2 text-red-600 font-bold">
                                        <span>🕒 Deadline: {new Date(opp.applicationDeadline).toLocaleDateString()}</span>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}
