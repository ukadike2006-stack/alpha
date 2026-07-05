'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/lib/auth';
import { adminApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const MOCK_COURSES = [
    { id: 1, title: "Business Fundamentals for African Founders", price: "Free" },
    { id: 2, title: "Pitching to International Investors", price: "$49" },
    { id: 3, title: "Financial Planning for Scale", price: "$29" },
];

export default function MentorsPage() {
  const router = useRouter();
  const [mentors, setMentors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMentorshipModal, setShowMentorshipModal] = useState<any>(null);
  const [showCoursesModal, setShowCoursesModal] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [requesting, setRequesting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }

    const loadData = async () => {
        try {
            const usersRes = await adminApi.users();
            setMentors(usersRes.data.filter((u: any) => u.role === 'MENTOR'));
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [router]);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequesting(true);
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setSuccess(true);
        setTimeout(() => {
            setSuccess(false);
            setShowMentorshipModal(null);
            setMessage('');
        }, 2000);
    } finally {
        setRequesting(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-alpha-dark">Mentorship Hub</h1>
          <p className="text-gray-500 font-medium">Learn from leaders who have built successful ventures in Africa.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map(m => (
          <Card key={m.id} className="flex flex-col">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-alpha-green text-white rounded-full flex items-center justify-center font-black text-xl border-2 border-white shadow-sm">
                    {m.firstName[0]}{m.lastName[0]}
                </div>
                <div>
                    <h3 className="font-bold text-lg">{m.firstName} {m.lastName}</h3>
                    <p className="text-xs font-bold text-alpha-gold uppercase tracking-widest">Certified Mentor</p>
                </div>
            </div>

            <div className="space-y-3 mb-8 flex-1 text-sm">
                <p className="text-gray-600 leading-relaxed italic">&quot;Passionate about scaling tech solutions in emerging markets.&quot;</p>
                <div className="flex gap-2 flex-wrap mt-4">
                    <span className="bg-alpha-sand/30 text-alpha-earth px-2 py-1 rounded text-[10px] font-bold uppercase">Strategy</span>
                    <span className="bg-alpha-sand/30 text-alpha-earth px-2 py-1 rounded text-[10px] font-bold uppercase">Ops</span>
                    <span className="bg-alpha-sand/30 text-alpha-earth px-2 py-1 rounded text-[10px] font-bold uppercase">Fundraising</span>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    <Button onClick={() => setShowMentorshipModal(m)} className="flex-1 text-xs">Request Mentorship</Button>
                    <Button variant="secondary" onClick={() => {}} className="text-xs px-4">Follow</Button>
                </div>
                <button onClick={() => setShowCoursesModal(m)} className="text-xs font-bold text-alpha-green hover:underline py-2">View Courses</button>
            </div>
          </Card>
        ))}
      </div>

      {/* Mentorship Modal */}
      {showMentorshipModal && (
        <div className="fixed inset-0 bg-alpha-dark/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-lg">
                {success ? (
                    <div className="py-12 text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">✓</div>
                        <h2 className="text-2xl font-bold text-alpha-dark mb-2">Request Sent</h2>
                        <p className="text-gray-500">Your mentorship request has been sent to {showMentorshipModal.firstName}.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-alpha-dark">Request Mentorship</h2>
                            <button onClick={() => setShowMentorshipModal(null)} className="text-gray-400">✕</button>
                        </div>
                        <form onSubmit={handleRequest} className="space-y-4">
                            <p className="text-sm text-gray-500">Tell {showMentorshipModal.firstName} what you&apos;d like guidance on.</p>
                            <textarea
                                className="input-field min-h-[120px]" required placeholder="Briefly describe your current business challenge..."
                                value={message} onChange={e => setMessage(e.target.value)}
                            />
                            <Button type="submit" loading={requesting} className="w-full">Submit Request</Button>
                        </form>
                    </>
                )}
            </Card>
        </div>
      )}

      {/* Courses Modal */}
      {showCoursesModal && (
        <div className="fixed inset-0 bg-alpha-dark/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-alpha-dark">Courses by {showCoursesModal.firstName}</h2>
                    <button onClick={() => setShowCoursesModal(null)} className="text-gray-400">✕</button>
                </div>
                <div className="grid gap-4">
                    {MOCK_COURSES.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-alpha-light/50 transition-colors">
                            <div>
                                <h4 className="font-bold text-alpha-dark">{c.title}</h4>
                                <p className="text-xs text-alpha-green font-bold uppercase">{c.price}</p>
                            </div>
                            <Button variant="secondary" className="text-xs" onClick={() => alert("Enrollment opening soon!")}>Enroll</Button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
      )}
    </div>
  );
}
