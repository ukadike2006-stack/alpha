'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { applicationsApi } from '@/lib/api';
import { ApplicationSummary } from '@/types';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    applicationsApi.myApplications().then((r) => setApplications(r.data)).catch(console.error).finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">My Applications</h1>
      <p className="text-gray-500 mb-8">Track the status of all your funding applications</p>
      {loading ? <p className="text-gray-400">Loading...</p> : applications.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-400">
          No applications yet. <a href="/opportunities" className="text-green-700 font-semibold">Browse opportunities</a>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white rounded-xl p-4 flex justify-between items-center shadow">
              <div>
                <p className="font-semibold">{app.businessName}</p>
                <p className="text-sm text-gray-400">{app.fundingType?.replace(/_/g, ' ')} · {new Date(app.submittedAt).toLocaleDateString()}</p>
                {app.rejectionReason && <p className="text-xs text-red-400 mt-1">{app.rejectionReason}</p>}
              </div>
              <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full font-semibold">{app.status?.replace(/_/g, ' ')}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
