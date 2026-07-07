import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const GOLD = '#c9a84c';
const BG   = '#050a14';

export default function Tours({ tours }) {
  const [activeTab, setActiveTab] = useState('All');
  const categories = ['All','North India','South India','East India','West India','Adventures','Wildlife','International'];
  const filtered   = activeTab === 'All' ? tours : tours.filter(t => t.category === activeTab);

  return (
    <section id="tours" className="py-28 relative z-30"
      style={{ background: 'linear-gradient(180deg, #050a14 0%, #060d1a 100%)' }}>

      {/* section divider top */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>
            Handcrafted Journeys
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Cinzel, serif', color: '#f1f5f9' }}>
            Discover Our Tours
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: '#64748b' }}>
            From the peaks of the Himalayas to the backwaters of Kerala — find your perfect escape.
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
              style={
                activeTab === cat
                  ? { background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#050a14', boxShadow: '0 0 18px rgba(201,168,76,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#64748b', border: '1px solid rgba(255,255,255,0.07)' }
              }
              onMouseEnter={e => { if (activeTab !== cat) e.currentTarget.style.color = '#c9a84c'; }}
              onMouseLeave={e => { if (activeTab !== cat) e.currentTarget.style.color = '#64748b'; }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map(tour => (
              <motion.div
                key={tour.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -8 }}
                className="group relative rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="aspect-[4/5] overflow-hidden relative">
                  <motion.img
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.5 }}
                    src={tour.image_url}
                    alt={tour.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, #050a14 0%, rgba(5,10,20,0.45) 50%, transparent 100%)' }} />

                  {/* category badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(201,168,76,0.15)', color: GOLD, border: '1px solid rgba(201,168,76,0.3)', backdropFilter: 'blur(8px)' }}>
                    {tour.category}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-1.5" style={{ color: '#f1f5f9', fontFamily: 'Cinzel, serif' }}>{tour.title}</h3>
                    <div className="flex items-center gap-1.5 text-sm mb-4" style={{ color: '#94a3b8' }}>
                      <Clock className="w-3.5 h-3.5" style={{ color: GOLD }} />
                      {tour.duration}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                      <Link
                        to={`/tour/${tour.id}`}
                        className="block w-full py-3 text-center rounded-xl text-sm font-semibold tracking-wider uppercase transition-all duration-300"
                        style={{
                          background: 'linear-gradient(135deg,#c9a84c,#a07830)',
                          color: '#050a14',
                          boxShadow: '0 0 20px rgba(201,168,76,0.3)',
                        }}
                      >
                        View Itinerary
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,76,0.3), transparent)' }} />
    </section>
  );
}
