import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Compass, Camera, Mountain, Coffee } from 'lucide-react';

const icons = {
  Compass: Compass,
  Camera: Camera,
  Mountain: Mountain,
  Coffee: Coffee
};

export default function Experiences({ experiences }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  return (
    <section ref={containerRef} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-teal-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-900/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Curated Experiences for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-blue-500">Bold</span>
            </h2>
            <p className="text-slate-600 text-lg mb-10">
              We go beyond standard tours. Immerse yourself in local cultures, conquer untamed landscapes, and create memories that defy expectations.
            </p>

            <div className="space-y-8">
              {experiences.map((exp, index) => {
                const Icon = icons[exp.icon] || Compass;
                return (
                  <motion.div 
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-start"
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-300 flex items-center justify-center text-blue-600">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="ml-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{exp.title}</h3>
                      <p className="text-slate-600">{exp.description}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Floating Images Parallax */}
          <div className="relative h-[600px] hidden lg:block">
            <motion.div 
              style={{ y: y1 }}
              className="absolute top-10 right-10 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl shadow-teal-900/20 border border-slate-200"
            >
              <img src="/images/exp-1.jpg" alt="Experience 1" className="w-full h-full object-cover" />
            </motion.div>
            
            <motion.div 
              style={{ y: y2 }}
              className="absolute bottom-10 left-10 w-72 h-96 rounded-3xl overflow-hidden shadow-2xl shadow-orange-900/20 border border-slate-200 z-10"
            >
              <img src="/images/exp-2.jpg" alt="Experience 2" className="w-full h-full object-cover" />
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
