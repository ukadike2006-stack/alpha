'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';
import { businessApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

// Mock data for products
const MOCK_PRODUCTS = [
  { id: 1, name: "AgriTrack IoT Sensor", category: "Physical", price: "250", currency: "USD", description: "Soil moisture and nutrient tracking sensor for remote farms.", email: "sales@agrilink.ng" },
  { id: 2, name: "EcoPower Mini", category: "Physical", price: "120", currency: "USD", description: "Portable solar charger for rural connectivity.", email: "info@ecopower.ke" },
];

export default function ShowcasePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', category: 'Product', price: '', currency: 'USD', description: '', imageUrl: '', email: '' });

  useEffect(() => {
    setUser(getCurrentUser());

    // In a real app, call fetch('/api/businesses')
    const stored = localStorage.getItem('alpha_showcase_products');
    if (stored) setProducts(JSON.parse(stored));
    else setProducts(MOCK_PRODUCTS);

    setTimeout(() => {
      setBusinesses([
        { id: 1, businessName: "AgriLink Nigeria Ltd", sector: "AgriTech", country: "Nigeria", description: "Connecting smallholder farmers to markets via digital platform.", founded: "2022" },
        { id: 2, businessName: "SolarFlow Kenya", sector: "Clean Energy", country: "Kenya", description: "Affordable solar irrigation systems.", founded: "2021" },
        { id: 3, businessName: "Zindi Health", sector: "HealthTech", country: "South Africa", description: "AI-powered diagnostic tools.", founded: "2023" },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...products, { ...newProduct, id: Date.now() }];
    setProducts(updated);
    localStorage.setItem('alpha_showcase_products', JSON.stringify(updated));
    setShowModal(false);
    setNewProduct({ name: '', category: 'Product', price: '', currency: 'USD', description: '', imageUrl: '', email: '' });
  };

  const filteredBiz = businesses.filter(b =>
    (b.businessName.toLowerCase().includes(filter.toLowerCase()) || b.description.toLowerCase().includes(filter.toLowerCase())) &&
    (sectorFilter === '' || b.sector === sectorFilter)
  );

  const filteredProd = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) || p.description.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen pb-20">
      {/* Banner */}
      <div className="relative h-80 bg-alpha-dark flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1600"
          alt="Market"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 text-center px-6">
          <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Ecosystem Showcase</h1>
          <p className="text-alpha-sand text-xl max-w-2xl mx-auto font-medium">Empowering African innovation through visibility and connection.</p>

          {user?.role === 'FOUNDER' && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-8 bg-alpha-gold text-alpha-dark px-8 py-3 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                List Your Product
              </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-[-40px] relative z-20">
        <Card className="!p-8 mb-12 shadow-2xl border-none">
            <div className="flex flex-col md:flex-row gap-6">
                <input
                    type="text" className="input-field flex-1 !text-lg !py-4 px-8 rounded-2xl shadow-inner"
                    placeholder="Search innovation, products, or founders..."
                    value={filter} onChange={(e) => setFilter(e.target.value)}
                />
                <select
                    className="input-field md:w-64 !py-4 rounded-2xl"
                    value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}
                >
                    <option value="">All Sectors</option>
                    {Array.from(new Set(businesses.map(b => b.sector))).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
        </Card>

        {/* Business Section */}
        <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black text-alpha-dark">Featured Ventures</h2>
                <div className="h-1 flex-1 bg-alpha-gold/20 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBiz.map(biz => (
                <Card key={biz.id} className="flex flex-col h-full group hover:!border-alpha-green">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-alpha-dark leading-tight group-hover:text-alpha-green transition-colors">{biz.businessName}</h3>
                        <Badge label={biz.sector} />
                    </div>
                    <p className="text-sm text-gray-500 mb-8 flex-1 leading-relaxed">{biz.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-50">
                        <span className="text-xs font-bold text-alpha-green uppercase tracking-widest">📍 {biz.country}</span>
                        <div className="flex gap-2">
                            <button className="text-alpha-gold hover:text-alpha-dark transition-colors font-bold text-xs uppercase tracking-tighter">View Pitch</button>
                            <button className="bg-alpha-green/10 text-alpha-green px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-alpha-green hover:text-white transition-colors">Connect</button>
                        </div>
                    </div>
                </Card>
                ))}
            </div>
        </div>

        {/* Products Section */}
        <div>
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-black text-alpha-dark">Founder Marketplace</h2>
                <div className="h-1 flex-1 bg-alpha-gold/20 rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProd.map(prod => (
                <Card key={prod.id} className="!p-0 overflow-hidden flex flex-col group">
                    <div className="aspect-square bg-alpha-light flex items-center justify-center text-5xl relative overflow-hidden">
                        {prod.imageUrl ? <img src={prod.imageUrl} className="w-full h-full object-cover" /> : '📦'}
                        <div className="absolute top-3 left-3">
                            <span className="bg-alpha-dark/80 text-alpha-gold text-[10px] font-black uppercase px-2 py-1 rounded backdrop-blur-sm">
                                {prod.category}
                            </span>
                        </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col">
                        <h3 className="font-bold text-lg text-alpha-dark mb-1 group-hover:text-alpha-green transition-colors">{prod.name}</h3>
                        <p className="text-alpha-green font-black text-xl mb-3">{prod.currency} {prod.price}</p>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-6 leading-relaxed">{prod.description}</p>
                        <Button className="w-full !text-xs !py-2 mt-auto">Contact Seller</Button>
                    </div>
                </Card>
                ))}
            </div>
        </div>
      </div>

      {/* List Product Modal */}
      {showModal && (
          <div className="fixed inset-0 bg-alpha-dark/90 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              <Card className="w-full max-w-2xl relative">
                  <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-black text-alpha-dark">List Your Product</h2>
                      <button onClick={() => setShowModal(false)} className="text-gray-400 text-2xl">✕</button>
                  </div>
                  <form onSubmit={handleAddProduct} className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                          <div>
                              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Item Name</label>
                              <input className="input-field" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Category</label>
                              <select className="input-field" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                  <option>Product</option><option>Service</option><option>Digital</option><option>Physical</option>
                              </select>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                              <div>
                                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Price</label>
                                  <input type="number" className="input-field" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                              </div>
                              <div>
                                  <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Currency</label>
                                  <select className="input-field" value={newProduct.currency} onChange={e => setNewProduct({...newProduct, currency: e.target.value})}>
                                      <option>USD</option><option>NGN</option><option>KES</option><option>ZAR</option>
                                  </select>
                              </div>
                          </div>
                      </div>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Description</label>
                              <textarea className="input-field min-h-[105px]" required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                          </div>
                          <div>
                              <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Image URL</label>
                              <input className="input-field" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} />
                          </div>
                      </div>
                      <div className="col-span-full pt-4">
                        <Button type="submit" className="w-full !py-4 !text-base">Publish to Marketplace</Button>
                      </div>
                  </form>
              </Card>
          </div>
      )}
    </div>
  );
}
