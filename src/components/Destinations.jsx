import { motion } from 'framer-motion';
import { MapPin, Star } from 'lucide-react';

export default function Destinations({ destinations }) {
  return (
    <section id="destinations" className="py-24 bg-slate-50 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Featured Destinations</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Explore our handpicked selection of extraordinary locations waiting to be discovered.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest, index) => (
            <motion.div
              key={dest.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative rounded-3xl overflow-hidden bg-white border border-slate-200 hover:border-teal-500/50 transition-colors"
            >
              <div className="aspect-[4/5] overflow-hidden relative">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="w-full h-full"
                >
                  <img 
                    src={dest.image_url} 
                    alt={dest.title} 
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">{dest.title}</h3>
                      <div className="flex items-center text-blue-600 text-sm font-medium">
                        <MapPin className="w-4 h-4 mr-1" />
                        {dest.location}
                      </div>
                    </div>
                    <div className="flex items-center bg-slate-50/80 backdrop-blur-sm px-2 py-1 rounded-lg text-blue-500">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span className="font-bold">{dest.rating}</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-sm mt-3 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {dest.description}
                  </p>
                  
                  <div className="mt-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150">
                    <span className="text-slate-900 font-bold text-lg">${dest.price} <span className="text-slate-600 text-sm font-normal">/ person</span></span>
                    <button className="text-blue-600 hover:text-teal-300 font-semibold text-sm flex items-center">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
