'use client';
import { useEffect, useState } from 'react';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Mock data as fallback
const MOCK_BUSINESSES = [
  { id: 1, businessName: "AgriLink Nigeria Ltd", sector: "AgriTech", country: "Nigeria", description: "Connecting smallholder farmers to local and international markets via digital platform.", founded: "2022" },
  { id: 2, businessName: "SolarFlow Kenya", sector: "Clean Energy", country: "Kenya", description: "Providing affordable pay-as-you-go solar irrigation systems for rural farmers.", founded: "2021" },
  { id: 3, businessName: "Zindi Health", sector: "HealthTech", country: "South Africa", description: "AI-powered diagnostic tool for community health workers in underserved areas.", founded: "2023" },
];

export default function ShowcasePage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');

  useEffect(() => {
    // In a real app, call fetch('/api/businesses')
    setTimeout(() => {
      setBusinesses(MOCK_BUSINESSES);
      setLoading(false);
    }, 1000);
  }, []);

  const filtered = businesses.filter(b =>
    (b.businessName.toLowerCase().includes(filter.toLowerCase()) ||
     b.description.toLowerCase().includes(filter.toLowerCase())) &&
    (sectorFilter === '' || b.sector === sectorFilter)
  );

  const sectors = Array.from(new Set(businesses.map(b => b.sector)));

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-64 bg-alpha-dark flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600"
          alt="Market"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Startup Showcase</h1>
          <p className="text-alpha-sand text-lg max-w-xl mx-auto">Discover and connect with Africa's most promising early-stage ventures.</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <input
            type="text" className="input-field flex-1"
            placeholder="Search businesses..."
            value={filter} onChange={(e) => setFilter(e.target.value)}
          />
          <select
            className="input-field md:w-48"
            value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="">All Sectors</option>
            {sectors.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {loading ? <Spinner /> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(biz => (
              <Card key={biz.id} className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-alpha-dark leading-tight">{biz.businessName}</h3>
                  <Badge label={biz.sector} />
                </div>
                <p className="text-sm text-gray-500 mb-6 flex-1">{biz.description}</p>

                <div className="text-xs font-medium text-alpha-green mb-6 flex items-center gap-3">
                  <span>📍 {biz.country}</span>
                  <span>📅 Founded {biz.founded}</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" className="flex-1 text-sm py-2">Connect</Button>
                  <Button variant="secondary" className="flex-1 text-sm py-2">View Pitch</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No businesses found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
