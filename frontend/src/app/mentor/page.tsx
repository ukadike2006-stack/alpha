'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, isLoggedIn } from '@/lib/auth';
import { messagesApi } from '@/lib/api';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

export default function MentorPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { router.push('/login'); return; }
    const u = getCurrentUser();
    if (u?.role !== 'MENTOR') { router.push('/login'); return; }
    setUser(u);

    const loadData = async () => {
      try {
        const msgRes = await messagesApi.inbox();
        setMessages(msgRes.data);
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
      <div className="mb-10">
          <h1 className="text-4xl font-black text-alpha-dark">Mentor Dashboard</h1>
          <p className="text-gray-500">Guiding the next generation of African founders.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
              <section>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-alpha-dark">Inbound Requests</h2>
                    <span className="bg-alpha-gold text-alpha-dark px-2 py-0.5 rounded text-[10px] font-black">{messages.length} NEW</span>
                  </div>
                  <div className="space-y-4">
                      {messages.length === 0 ? (
                          <Card className="text-center py-10 text-gray-400">No requests yet.</Card>
                      ) : (
                          messages.map(m => (
                              <Card key={m.id} className={m.content.startsWith('MENTORSHIP_REQUEST') ? 'border-l-4 border-alpha-gold' : ''}>
                                  <div className="flex justify-between items-start mb-2">
                                      <p className="font-bold">{m.sender.fullName}</p>
                                      <p className="text-[10px] text-gray-400">{new Date(m.sentAt).toLocaleDateString()}</p>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-4">{m.content}</p>
                                  <Button variant="secondary" className="!text-[10px] !py-1">Reply Message</Button>
                              </Card>
                          ))
                      )}
                  </div>
              </section>

              <section>
                  <h2 className="text-xl font-bold mb-6 text-alpha-dark">My Courses</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                      {[
                          { title: "Business Fundamentals", price: "Free" },
                          { title: "Pitching Mastery", price: "$49" }
                      ].map(c => (
                          <Card key={c.title} className="flex justify-between items-center">
                              <div>
                                  <p className="font-bold">{c.title}</p>
                                  <p className="text-[10px] text-alpha-green font-bold uppercase">{c.price}</p>
                              </div>
                              <Button variant="secondary" className="!text-[10px] !py-1">Edit</Button>
                          </Card>
                      ))}
                  </div>
              </section>
          </div>

          <div>
              <Card className="bg-alpha-green text-white border-none">
                  <h3 className="text-xl font-bold text-alpha-gold mb-4">Profile Summary</h3>
                  <div className="space-y-4 text-sm">
                      <p><span className="text-alpha-sand font-bold">Expertise:</span> Strategy, Scale</p>
                      <p><span className="text-alpha-sand font-bold">Experience:</span> 12+ Years</p>
                      <Button variant="secondary" className="w-full mt-4">Edit Public Profile</Button>
                  </div>
              </Card>
          </div>
      </div>
    </div>
  );
}
