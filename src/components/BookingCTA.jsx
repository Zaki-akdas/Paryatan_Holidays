import { motion } from 'framer-motion';

const GOLD = '#c9a84c';

export default function BookingCTA() {
  return (
    <section className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#050a14 0%,#060d1a 50%,#050a14 100%)' }}>

      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src="/images/cta-bg.jpg" alt="landscape"
          className="w-full h-full object-cover opacity-10" />
      </div>

      {/* Gold radial glow */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(201,168,76,0.07) 0%, transparent 65%)' }} />

      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right,transparent,rgba(201,168,76,0.3),transparent)' }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: GOLD }}>
            Begin Your Journey
          </p>
          <h2 className="font-bold mb-6 leading-tight"
            style={{ fontFamily: 'Cinzel, serif', color: '#f1f5f9', fontSize: 'clamp(2.4rem,6vw,5rem)' }}>
            Ready for your next <br />
            <span style={{
              background: 'linear-gradient(135deg,#f0c060,#c9a84c,#a07830)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Adventure?
            </span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: '#64748b' }}>
            Join thousands of travellers who have discovered the world's most spectacular destinations with us.
          </p>

          <form
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            onSubmit={e => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 rounded-full text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,168,76,0.25)',
                color: '#f1f5f9',
              }}
              onFocus={e => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.6)')}
              onBlur={e => (e.currentTarget.style.border = '1px solid rgba(201,168,76,0.25)')}
            />
            <button
              type="submit"
              className="px-8 py-4 font-bold rounded-full text-sm uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
              style={{
                background: 'linear-gradient(135deg,#c9a84c,#a07830)',
                color: '#050a14',
                boxShadow: '0 0 25px rgba(201,168,76,0.3)',
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 40px rgba(201,168,76,0.55)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 25px rgba(201,168,76,0.3)')}
            >
              Get Early Access
            </button>
          </form>
          <p className="text-xs mt-4" style={{ color: '#475569' }}>
            Exclusive deals and travel inspiration delivered to your inbox.
          </p>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right,transparent,rgba(201,168,76,0.3),transparent)' }} />
    </section>
  );
}
