import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'py-3'
            : 'py-5'
        }`}
        style={{
          background: scrolled
            ? 'rgba(5, 10, 20, 0.85)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(201,168,76,0.15)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Paryatan Holidays"
                className="w-auto"
                style={{
                  height: scrolled ? '52px' : '62px',
                  transition: 'height 0.3s ease',
                  filter: 'drop-shadow(0 2px 12px rgba(247,148,29,0.25))',
                  borderRadius: '50%',
                }}
              />
            </a>

            {/* Desktop Menu */}
<div className="hidden md:flex items-center gap-6">
               {[
                 { href: '/', label: 'Home' },
                 { href: '/#tours', label: 'Tours' },
                 { href: '/#services', label: 'Services' },
                 { href: '/#about', label: 'About Us' },
               ].map(({ href, label }) => (
                 <a
                   key={href}
                   href={href}
                   className="text-sm font-medium tracking-wider uppercase transition-colors duration-300 whitespace-nowrap"
                   style={{ color: '#94a3b8' }}
                   onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                   onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
                 >
                   {label}
                 </a>
               ))}
               <a
                 href="/admin"
                 className="text-sm font-medium tracking-wider uppercase transition-colors duration-300 whitespace-nowrap"
                 style={{ color: '#94a3b8' }}
                 onMouseEnter={e => (e.currentTarget.style.color = '#c9a84c')}
                 onMouseLeave={e => (e.currentTarget.style.color = '#94a3b8')}
               >
                 Admin
               </a>
               <a
                 href="/#contact"
                 className="px-5 py-2 text-sm font-semibold rounded-full uppercase tracking-wider transition-all duration-300 whitespace-nowrap"
                 style={{
                   background: 'linear-gradient(135deg, #c9a84c, #a07830)',
                   color: '#050a14',
                   boxShadow: '0 0 15px rgba(201,168,76,0.2)',
                 }}
                 onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 25px rgba(201,168,76,0.4)')}
                 onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 15px rgba(201,168,76,0.2)')}
               >
                 Contact
               </a>
             </div>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ color: '#c9a84c' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 pt-20 px-6 md:hidden"
            style={{ background: 'rgba(5, 10, 20, 0.98)', backdropFilter: 'blur(20px)' }}
          >
            {/* Logo in mobile menu */}
            <div className="flex justify-center mb-8">
              <img src="/images/logo.png" alt="Paryatan Holidays" className="w-28 h-28 rounded-full object-cover" style={{ filter: 'drop-shadow(0 0 20px rgba(247,148,29,0.3))' }} />
            </div>
<div className="flex flex-col gap-5 text-xl font-semibold">
               {[
                 { href: '/', label: 'Home' },
                 { href: '/#tours', label: 'Tours' },
                 { href: '/#services', label: 'Services' },
                 { href: '/#about', label: 'About Us' },
               ].map(({ href, label }) => (
                 <a
                   key={href}
                   href={href}
                   onClick={() => setMobileMenuOpen(false)}
                   className="py-2 tracking-wide uppercase transition-colors"
                   style={{ color: '#94a3b8', fontFamily: 'Cinzel, serif' }}
                   onTouchStart={e => (e.currentTarget.style.color = '#c9a84c')}
                   onTouchEnd={e => (e.currentTarget.style.color = '#94a3b8')}
                 >
                   {label}
                 </a>
               ))}
               <a
                 href="/admin"
                 onClick={() => setMobileMenuOpen(false)}
                 className="py-2 tracking-wide uppercase transition-colors"
                 style={{ color: '#94a3b8', fontFamily: 'Cinzel, serif' }}
                 onTouchStart={e => (e.currentTarget.style.color = '#c9a84c')}
                 onTouchEnd={e => (e.currentTarget.style.color = '#94a3b8')}
               >
                 Admin
               </a>
               <a
                 href="/#contact"
                 onClick={() => setMobileMenuOpen(false)}
                 className="mt-3 px-6 py-3 text-center rounded-full font-bold uppercase tracking-wider"
                 style={{
                   background: 'linear-gradient(135deg, #c9a84c, #a07830)',
                   color: '#050a14',
                 }}
               >
                 Contact
               </a>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
