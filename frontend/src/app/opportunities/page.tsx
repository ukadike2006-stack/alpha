'use client';
import { useEffect, useState } from 'react';
import { opportunitiesApi } from '@/lib/api';
import { FundingOpportunity } from '@/types';

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
    <div className="max-w-5xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Funding Opportunities</h1>
      <p className="text-gray-500 mb-6">Browse all active opportunities for African founders</p>
      <input className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm mb-8 max-w-md focus:outline-none focus:ring-2 focus:ring-green-700"
        placeholder="Search by title or sector…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      {loading ? <p className="text-gray-400">Loading...</p> : filtered.length === 0 ? <p className="text-gray-400">No opportunities found.</p> : (
        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((opp) => (
            <div key={opp.id} className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-start mb-2 gap-2">
                <h3 className="font-bold text-lg leading-tight">{opp.title}</h3>
                <span className="text-xs bg-green-700 text-white px-2 py-1 rounded-full whitespace-nowrap">{opp.fundingType?.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 line-clamp-3">{opp.description}</p>
              <div className="text-xs text-gray-400 space-y-1">
                <p>💰 {opp.currency} {Number(opp.minAmount).toLocaleString()} – {Number(opp.maxAmount).toLocaleString()}</p>
                <p>🌍 {opp.targetCountry} · 🏭 {opp.targetSector}</p>
                {opp.applicationDeadline && <p>📅 Deadline: {new Date(opp.applicationDeadline).toLocaleDateString()}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
