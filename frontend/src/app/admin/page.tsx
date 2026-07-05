'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn, hasRole } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function AdminPage() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn() || !hasRole('ADMIN')) {
      router.push('/dashboard');
      return;
    }

    const loadData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminApi.dashboard(),
          adminApi.users()
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
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
      <h1 className="text-4xl font-extrabold text-alpha-dark mb-10">Admin Control Panel</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats && Object.entries(stats).map(([key, val]) => (
          <Card key={key} className="text-center">
            <p className="text-4xl font-black text-alpha-green">{String(val)}</p>
            <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
          </Card>
        ))}
      </div>

      {/* User Table */}
      <Card className="overflow-hidden">
        <h2 className="text-xl font-bold mb-6 px-2">System Users</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-alpha-dark">{u.firstName} {u.lastName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-black uppercase px-2 py-1 rounded bg-alpha-sand/30 text-alpha-earth">
                        {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`w-2 h-2 inline-block rounded-full mr-2 ${u.active ? 'bg-green-500' : 'bg-red-500'}`}></span>
                    <span className="text-sm font-medium">{u.active ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="danger" className="text-[10px] py-1 px-3">Deactivate</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
