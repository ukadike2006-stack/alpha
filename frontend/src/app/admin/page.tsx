'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';
import { adminApi, applicationsApi, opportunitiesApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [opps, setOpps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const u = getCurrentUser();
    if (u?.role !== 'ADMIN') { router.push('/login'); return; }
    setUser(u);

    const loadData = async () => {
      try {
        const [statsRes, usersRes, oppsRes] = await Promise.all([
          adminApi.dashboard(),
          adminApi.users(),
          opportunitiesApi.listPublic()
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setOpps(oppsRes.data);
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
          <h1 className="text-4xl font-black text-alpha-dark">Admin Panel</h1>
          <div className="flex gap-4">
              <Badge label="ADMIN" />
          </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats && Object.entries(stats).map(([key, val]) => (
          <Card key={key} className="text-center group">
            <p className="text-4xl font-black text-alpha-green group-hover:scale-110 transition-transform">{String(val)}</p>
            <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
          </Card>
        ))}
      </div>

      <div className="space-y-12">
          {/* Users Table */}
          <section>
              <h2 className="text-2xl font-bold text-alpha-dark mb-6">Verify & Manage Users</h2>
              <Card className="!p-0 overflow-hidden">
                  <table className="w-full text-left">
                      <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-black tracking-widest">
                          <tr>
                              <th className="px-6 py-4">User</th>
                              <th className="px-6 py-4">Role</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {users.map(u => (
                              <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                  <td className="px-6 py-4">
                                      <p className="font-bold text-alpha-dark">{u.firstName} {u.lastName}</p>
                                      <p className="text-xs text-gray-400">{u.email}</p>
                                  </td>
                                  <td className="px-6 py-4">
                                      <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-alpha-sand/30 text-alpha-earth">{u.role}</span>
                                  </td>
                                  <td className="px-6 py-4">
                                      {!u.active ? (
                                          <span className="bg-orange-100 text-orange-700 text-[10px] font-black uppercase px-2 py-1 rounded">Pending</span>
                                      ) : (
                                          <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-1 rounded">Verified</span>
                                      )}
                                  </td>
                                  <td className="px-6 py-4 flex gap-2">
                                      {!u.active && (
                                          <Button variant="primary" className="!text-[10px] !py-1 px-3">Verify & Activate</Button>
                                      )}
                                      <Button variant="danger" className="!text-[10px] !py-1 px-3">Deactivate</Button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </Card>
          </section>

          {/* Opportunities */}
          <section>
              <h2 className="text-2xl font-bold text-alpha-dark mb-6">Opportunities</h2>
              <div className="grid md:grid-cols-2 gap-4">
                  {opps.map(o => (
                      <Card key={o.id} className="flex justify-between items-center">
                          <div>
                              <h4 className="font-bold">{o.title}</h4>
                              <p className="text-xs text-gray-400">{o.fundingType} · {o.targetCountry}</p>
                          </div>
                          <div className="flex items-center gap-4">
                              <span className={`w-2 h-2 rounded-full ${o.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                              <Button variant="secondary" className="!text-[10px] !py-1 px-3">Close</Button>
                          </div>
                      </Card>
                  ))}
              </div>
          </section>
      </div>
    </div>
  );
}
