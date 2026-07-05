export default function Footer() {
  return (
    <footer className="bg-alpha-dark text-gray-400 py-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <img src="/alpha-logo.svg" alt="ALPHA" className="w-6 h-6" />
              <span className="text-white font-extrabold text-xl tracking-tight">ALPHA</span>
            </div>
            <p className="text-xs max-w-xs">Empowering African early-stage founders with the tools to scale and succeed.</p>
          </div>

          <div className="flex gap-4 text-2xl">
            <span title="Nigeria">🇳🇬</span>
            <span title="Ghana">🇬🇭</span>
            <span title="Kenya">🇰🇪</span>
            <span title="South Africa">🇿🇦</span>
            <span title="Rwanda">🇷🇼</span>
            <span title="Egypt">🇪🇬</span>
          </div>

          <div className="text-center md:text-right">
            <p className="text-xs uppercase font-bold tracking-widest text-alpha-gold mb-1">Academic Project</p>
            <p className="text-xs">Nigerian British University · COS 309</p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 text-[10px] uppercase tracking-[0.2em] text-center opacity-30">
          © {new Date().getFullYear()} ALPHA Ecosystem · All Rights Reserved
        </div>
      </div>
    </footer>
  );
}
