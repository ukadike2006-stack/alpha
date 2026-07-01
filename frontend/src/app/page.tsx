import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-alpha-dark text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">
          <span className="text-alpha-gold">ALPHA</span> Platform
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          A digital entrepreneurship ecosystem connecting African early-stage founders
          with funding, mentors, and investors.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/register" className="btn-secondary">
            Get Started — It&apos;s Free
          </Link>
          <Link href="/opportunities" className="btn-primary">
            Browse Opportunities
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: 'African Countries', value: '54' },
            { label: 'Funding Types', value: '6' },
            { label: 'Auto Eligibility Checks', value: '10' },
            { label: 'Match Score Factors', value: '4' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-4xl font-extrabold text-alpha-green">{s.value}</p>
              <p className="text-gray-500 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-alpha-light">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-alpha-dark">
            Built for African Founders
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '✅',
                title: 'Automated Eligibility',
                desc: '10-point TEF-aligned compliance check runs instantly on submission.',
              },
              {
                icon: '🎯',
                title: 'Smart Matching',
                desc: 'Scored algorithm matches your business to the best funding opportunities.',
              },
              {
                icon: '📊',
                title: 'Full Lifecycle Tracking',
                desc: 'Track every application from DRAFT to FUNDED in real time.',
              },
            ].map((f) => (
              <div key={f.title} className="card text-center">
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
