import { Suspense, useEffect, useRef, useState, lazy } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
const CinematicGlobe = lazy(() => import('./CinematicGlobe'));

export default function HeroParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const textY       = useTransform(scrollYProgress, [0, 1], ['0%', '60%']);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const globeScale  = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const globeOpacity= useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div ref={ref} className="relative w-full min-h-screen overflow-hidden flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at 60% 40%, #071428 0%, #050a14 60%, #020810 100%)' }}
    >
      {/* ── Subtle noise grain overlay ── */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundSize: '200px 200px' }}
      />

      {/* ── Globe — fills right half on desktop, full bg on mobile ── */}
      <motion.div
        style={{ scale: globeScale, opacity: globeOpacity }}
        className="absolute inset-0 z-0"
      >
        <Suspense fallback={null}>
          <CinematicGlobe />
        </Suspense>
      </motion.div>

      {/* ── Left-side cinematic text ── */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col items-start justify-center min-h-screen pt-24 pb-32"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <span className="block w-10 h-px" style={{ background: '#c9a84c' }} />
          <span className="text-xs font-semibold tracking-[0.3em] uppercase"
            style={{ color: '#c9a84c', fontFamily: 'Inter, sans-serif' }}>
            Premium Travel Experience
          </span>
        </motion.div>

        {/* Logo image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mb-8"
        >
          <img
            src="/images/logo.png"
            alt="Paryatan Holidays — Miles to Go"
            className="w-auto rounded-full"
            style={{
              height: 'clamp(130px, 18vw, 200px)',
              filter: 'drop-shadow(0 0 40px rgba(247,148,29,0.35)) drop-shadow(0 8px 30px rgba(0,0,0,0.6))',
            }}
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-xl md:text-2xl font-light mb-10 max-w-lg"
          style={{ color: '#94a3b8', fontFamily: 'Inter, sans-serif', letterSpacing: '0.05em' }}
        >
          Crafting journeys that <br className="hidden md:block" />
          transcend the ordinary.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7 }}
          className="flex items-center gap-8 mb-12"
        >
          {[
            { value: '12+', label: 'Destinations' },
            { value: '5K+', label: 'Happy Travelers' },
            { value: '15+', label: 'Years Experience' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl font-bold" style={{ color: '#c9a84c', fontFamily: 'Cinzel, serif' }}>{value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#64748b' }}>{label}</p>
            </div>
          ))}
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.85 }}
          className="flex flex-wrap gap-4"
        >
          <a
            href="#tours"
            className="px-8 py-4 font-semibold rounded-full text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'linear-gradient(135deg, #c9a84c, #a07830)',
              color: '#050a14',
              boxShadow: '0 0 30px rgba(201,168,76,0.35), 0 4px 20px rgba(0,0,0,0.4)',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 50px rgba(201,168,76,0.6), 0 4px 20px rgba(0,0,0,0.4)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 30px rgba(201,168,76,0.35), 0 4px 20px rgba(0,0,0,0.4)'}
          >
            Explore Packages
          </a>
          <a
            href="#about"
            className="px-8 py-4 font-semibold rounded-full text-sm tracking-widest uppercase transition-all duration-300"
            style={{
              background: 'transparent',
              color: '#c9a84c',
              border: '1px solid rgba(201,168,76,0.4)',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.08)'; e.currentTarget.style.borderColor = '#c9a84c'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'; }}
          >
            Our Story
          </a>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-xs tracking-[0.25em] uppercase" style={{ color: '#c9a84c66' }}>Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-px h-10"
          style={{ background: 'linear-gradient(to bottom, #c9a84c88, transparent)' }}
        />
      </motion.div>

      {/* ── Bottom fade into next section ── */}
      <div className="absolute bottom-0 left-0 right-0 h-48 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #050a14 0%, transparent 100%)' }}
      />
    </div>
  );
}
