'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push('/login');
      return;
    }
    setUser(getCurrentUser());
    setLoading(false);
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8 text-alpha-dark text-center">Your Profile</h1>

      <div className="card space-y-8">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-alpha-gold text-alpha-dark rounded-full flex items-center justify-center text-3xl font-bold">
            {user?.fullName?.split(' ').map((n: string) => n[0]).join('')}
          </div>
          <p className="text-sm text-alpha-green font-semibold">Change Photo</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text" className="input-field"
              defaultValue={user?.fullName}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email (Read Only)</label>
            <input
              type="email" className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
              value={user?.email} readOnly
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
            <input
              type="text" className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
              value={user?.role} readOnly
            />
          </div>

          {user?.role === 'FOUNDER' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                <input type="text" className="input-field" defaultValue="Nigerian" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Residence</label>
                <input type="text" className="input-field" defaultValue="Lagos, Nigeria" />
              </div>
            </>
          )}

          {user?.role === 'INVESTOR' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input type="text" className="input-field" defaultValue="Venture Capital Ltd" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Focus</label>
                <input type="text" className="input-field" defaultValue="AgriTech, FinTech" />
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col items-center pt-4">
          {success && (
            <div className="mb-4 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm font-medium animate-bounce">
              ✓ Profile updated successfully!
            </div>
          )}
          <Button onClick={handleSave} loading={saving} className="px-12">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
