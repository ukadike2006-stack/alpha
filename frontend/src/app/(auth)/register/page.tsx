'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/lib/api';
import Button from '@/components/ui/Button';

const ROLES = ['FOUNDER', 'INVESTOR', 'MENTOR'];

const AFRICAN_COUNTRIES = [
  'Nigeria','Ghana','Kenya','South Africa','Egypt','Ethiopia','Tanzania',
  'Uganda','Rwanda','Senegal','Côte d\'Ivoire','Cameroon','Angola',
  'Mozambique','Zimbabwe','Zambia','Botswana','Namibia','Madagascar',
  'Tunisia','Morocco','Algeria','Libya','Sudan','South Sudan',
  'Somalia','Eritrea','Djibouti','Comoros','Seychelles','Mauritius',
  'Malawi','Lesotho','Eswatini','Congo','Democratic Republic of the Congo',
  'Gabon','Central African Republic','Chad','Niger','Mali','Burkina Faso',
  'Guinea','Guinea-Bissau','Sierra Leone','Liberia','Togo','Benin',
  'Gambia','Cabo Verde','São Tomé and Príncipe','Equatorial Guinea',
  'Burundi','Mauritania','Libya',
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    role: 'FOUNDER', nationality: '', countryOfResidence: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    setLoading(true);
    try {
      const res = await authApi.register(form);
      setSuccess(res.data.message + ' You can now log in.');
      setTimeout(() => router.push('/login'), 2500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const isFounder = form.role === 'FOUNDER';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-alpha-dark">
            Join <span className="text-alpha-green">ALPHA</span>
          </h1>
          <p className="text-gray-500 mt-2">Create your account to get started</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error   && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}
            {success && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg text-sm">{success}</div>}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input className="input-field" required value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input className="input-field" required value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" className="input-field" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input type="password" className="input-field" required minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Minimum 8 characters" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">I am joining as a…</label>
              <select className="input-field" value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}>
                {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {isFounder && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Nationality</label>
                  <select className="input-field" required value={form.nationality}
                    onChange={(e) => setForm({ ...form, nationality: e.target.value })}>
                    <option value="">Select your nationality</option>
                    {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country of Residence</label>
                  <select className="input-field" required value={form.countryOfResidence}
                    onChange={(e) => setForm({ ...form, countryOfResidence: e.target.value })}>
                    <option value="">Select country</option>
                    {AFRICAN_COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </>
            )}

            <Button type="submit" loading={loading} className="w-full justify-center">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-alpha-green font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
