import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

const G = '#c9a84c';

export default function Testimonials({ testimonials }) {
  return (
    <section className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#060d1a 0%,#050a14 100%)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.05) 0%, transparent 60%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right,transparent,rgba(201,168,76,0.3),transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color:G }}>
            What Travellers Say
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily:'Cinzel,serif', color:'#f1f5f9' }}>
            Traveller Stories
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color:'#64748b' }}>
            Don't just take our word for it — hear from those who've journeyed with us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div key={t.id}
              initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
              viewport={{ once:true }} transition={{ duration:0.5, delay:i*0.12 }}
              whileHover={{ y:-6 }}
              className="relative rounded-2xl p-8 transition-all duration-300 group"
              style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)' }}
              onMouseEnter={e => { e.currentTarget.style.border='1px solid rgba(201,168,76,0.25)'; e.currentTarget.style.background='rgba(201,168,76,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.border='1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.background='rgba(255,255,255,0.03)'; }}>

              {/* Quote icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 rotate-180 opacity-20" style={{ color:G }} />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length:5 }).map((_,si) => (
                  <Star key={si} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Quote text */}
              <p className="italic leading-relaxed mb-6 relative z-10" style={{ color:'#94a3b8' }}>
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <img src={t.avatar_url} alt={t.name}
                  className="w-12 h-12 rounded-full object-cover"
                  style={{ border:`2px solid rgba(201,168,76,0.4)` }} />
                <div>
                  <p className="font-bold text-sm" style={{ color:'#f1f5f9' }}>{t.name}</p>
                  <p className="text-xs" style={{ color:'#475569' }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
