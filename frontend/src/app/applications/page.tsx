'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { applicationsApi } from '@/lib/api';
import { ApplicationSummary } from '@/types';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    applicationsApi.myApplications()
      .then((r) => setApplications(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-alpha-dark mb-2">My Applications</h1>
        <p className="text-gray-500 font-medium text-lg">Track your journey from registration to funding.</p>
      </div>

      {loading ? <Spinner /> : applications.length === 0 ? (
        <Card className="text-center py-20">
          <div className="w-20 h-20 bg-alpha-light text-alpha-green rounded-full flex items-center justify-center text-3xl mx-auto mb-6">📝</div>
          <p className="text-gray-500 text-lg mb-8 font-medium">You haven&apos;t started any applications yet.</p>
          <a href="/opportunities" className="btn-primary">Browse Opportunities</a>
        </Card>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => (
            <Card key={app.id} className="relative overflow-hidden group">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-2xl text-alpha-dark group-hover:text-alpha-green transition-colors">{app.businessName}</h3>
                    {app.fullyEligible && (
                        <span className="bg-green-100 text-green-700 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-green-200">Verified</span>
                    )}
                  </div>
                  <p className="text-gray-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                    {app.fundingType?.replace(/_/g, ' ')}
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                    Submitted {new Date(app.submittedAt).toLocaleDateString()}
                  </p>

                  {app.rejectionReason && (
                    <div className="mt-4 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
                        <p className="text-xs text-red-700 font-bold uppercase mb-1">Feedback</p>
                        <p className="text-sm text-red-600 italic">&quot;{app.rejectionReason}&quot;</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 w-full md:w-auto">
                  <Badge label={app.status} />
                  <button className="text-xs font-bold text-alpha-green hover:underline">View Details →</button>
                </div>
              </div>

              {/* Progress bar visual indicator */}
              <div className="absolute bottom-0 left-0 h-1 bg-alpha-gold/10 w-full">
                <div className="h-full bg-alpha-gold" style={{
                    width: app.status === 'FUNDED' ? '100%' :
                           app.status === 'SHORTLISTED' ? '75%' :
                           app.status === 'ELIGIBILITY_PASSED' ? '50%' : '25%'
                }}></div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
