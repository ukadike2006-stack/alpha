import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=1600"
            className="w-full h-full object-cover"
            alt="African Entrepreneurs"
          />
          <div className="absolute inset-0 hero-gradient opacity-90"></div>
          <div className="absolute inset-0 adinkra-pattern"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Empowering Africa&apos;s Next <span className="text-alpha-gold">Generation</span>
          </h1>
          <p className="text-xl md:text-2xl text-alpha-sand mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
            Connecting high-potential African founders with the funding, mentorship, and networks they need to scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="btn-secondary text-lg px-10 py-4">
              Get Started
            </Link>
            <Link href="/opportunities" className="btn-primary border-2 border-white/20 bg-transparent hover:bg-white/10 text-lg px-10 py-4">
              Browse Funding
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white border-y border-alpha-gold/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
            {[
              { label: 'African Nations', value: '54' },
              { label: 'Funding Types', value: '6' },
              { label: 'Auto Checks', value: '10' },
              { label: 'Platform Users', value: '5k+' },
            ].map((s) => (
              <div key={s.label} className="group">
                <p className="text-5xl font-black text-alpha-green mb-2 group-hover:scale-110 transition-transform">{s.value}</p>
                <div className="h-1 w-12 bg-alpha-gold mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* African Proverb Section */}
      <section className="py-24 bg-alpha-light text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 opacity-10 rotate-12">
            <img src="/alpha-logo.svg" alt="" />
        </div>
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <span className="text-6xl text-alpha-gold font-serif opacity-50 block mb-4">“</span>
          <h2 className="text-3xl md:text-4xl font-bold text-alpha-dark italic leading-snug">
            If you want to go fast, go alone. <br />If you want to go far, go together.
          </h2>
          <p className="mt-6 text-alpha-green font-bold tracking-widest uppercase">— African Proverb</p>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extrabold text-alpha-dark mb-16">How ALPHA Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Register', desc: 'Create your founder or investor profile in minutes.' },
              { step: '02', title: 'Verify', desc: 'Complete our secure 10-point automated compliance check.' },
              { step: '03', title: 'Match', desc: 'Our smart algorithm pairs you with the perfect partners.' },
              { step: '04', title: 'Fund', desc: 'Secure capital and mentorship to scale your business.' },
            ].map((item) => (
              <div key={item.step} className="relative p-8 card group">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-alpha-gold text-alpha-dark rounded-full flex items-center justify-center font-black text-xl border-4 border-white">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold mb-3 mt-4 text-alpha-green">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-alpha-dark text-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16">Founder Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Kofi Mensah', biz: 'AgriTech Ghana', init: 'KM' },
              { name: 'Amara Okafor', biz: 'FinStream Lagos', init: 'AO' },
              { name: 'Zuri Mbeki', biz: 'EcoPower Nairobi', init: 'ZM' },
            ].map((t) => (
              <div key={t.name} className="bg-white/5 p-8 rounded-2xl border border-white/10 hover:border-alpha-gold transition-colors">
                <div className="w-12 h-12 bg-alpha-gold text-alpha-dark rounded-full flex items-center justify-center font-bold mb-4">
                  {t.init}
                </div>
                <p className="text-gray-300 italic mb-6">&quot;ALPHA transformed our fundraising process. The automated eligibility gave us instant credibility with investors.&quot;</p>
                <p className="font-bold text-alpha-gold">{t.name}</p>
                <p className="text-xs text-gray-500 uppercase font-bold">{t.biz}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
