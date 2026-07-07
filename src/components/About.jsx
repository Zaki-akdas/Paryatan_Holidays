import { motion } from 'framer-motion';
import { Compass, ShieldCheck } from 'lucide-react';

const GOLD = '#c9a84c';

export default function About() {
  return (
    <section id="about" className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060d1a 0%, #050a14 100%)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: GOLD }}>
              Our Story
            </p>
            <h2 className="text-4xl md:text-5xl font-bold mb-6"
              style={{ fontFamily: 'Cinzel, serif', color: '#f1f5f9' }}>
              About{' '}
              <span style={{
                background: 'linear-gradient(135deg,#f0c060,#c9a84c,#a07830)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Paryatan Holidays
              </span>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: '#64748b' }}>
              With years of practical experience guiding visitors across India and beyond, we focus on providing
              clean accommodations, excellent cuisine, and deep cultural immersion. We are deeply passionate
              about customer service and care.
            </p>

            <blockquote className="py-4 pl-6 mb-8"
              style={{ borderLeft: `3px solid ${GOLD}` }}>
              <p className="text-xl italic" style={{ color: '#94a3b8' }}>
                "We get it right or we make it right."
              </p>
            </blockquote>

            <div className="space-y-6">
              {[
                {
                  Icon: Compass,
                  title: 'Our Mission',
                  text: 'Showcase real Indian culture: cuisines, history, and people. We ensure a perfect balance between scheduled events and free time.',
                },
                {
                  Icon: ShieldCheck,
                  title: 'Trust & Security',
                  text: 'Financial stability, secure payments, and 24/7 support during emergencies.',
                },
              ].map(({ Icon, title, text }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                    <Icon className="w-6 h-6" style={{ color: GOLD }} />
                  </div>
                  <div>
                    <h4 className="font-bold mb-1" style={{ color: '#f1f5f9', fontFamily: 'Cinzel, serif' }}>{title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Images */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="relative"
          >
            {/* glow behind */}
            <div className="absolute -inset-6 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)' }} />
            <div className="grid grid-cols-2 gap-4 relative z-10">
              <img
                src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=600"
                alt="Culture"
                className="rounded-2xl object-cover h-64 w-full"
                style={{ border: '1px solid rgba(201,168,76,0.15)' }}
              />
              <img
                src="https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=600"
                alt="People"
                className="rounded-2xl object-cover h-64 w-full mt-10"
                style={{ border: '1px solid rgba(201,168,76,0.15)' }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
