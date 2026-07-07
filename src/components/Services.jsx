import { motion } from 'framer-motion';
import { FileText, Plane, Building, Shield, Map, Briefcase } from 'lucide-react';

const icons = { FileText, Plane, Building, Shield, Map, Briefcase };
const GOLD  = '#c9a84c';

export default function Services({ services }) {
  return (
    <section id="services" className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #060d1a 0%, #050a14 100%)' }}>

      {/* Background glow blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[45%] h-[45%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
            What We Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Cinzel, serif', color: '#f1f5f9' }}>
            Our Services
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#64748b' }}>
            Comprehensive travel solutions designed to make your journey seamless and unforgettable.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = icons[service.icon] || Map;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6 }}
                className="p-8 rounded-2xl group transition-all duration-300 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.border = '1px solid rgba(201,168,76,0.25)';
                  e.currentTarget.style.background = 'rgba(201,168,76,0.04)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-300"
                  style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <Icon className="w-7 h-7" style={{ color: GOLD }} />
                </div>
                <h3 className="text-xl font-bold mb-3"
                  style={{ color: '#f1f5f9', fontFamily: 'Cinzel, serif' }}>
                  {service.title}
                </h3>
                <p className="leading-relaxed text-sm" style={{ color: '#64748b' }}>
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
