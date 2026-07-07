import { MapPin, Phone, Mail, Globe } from 'lucide-react';

const GOLD = '#c9a84c';

export default function Footer() {
  return (
    <footer id="contact" className="pt-20 pb-8 relative z-30"
      style={{ background: '#030810', borderTop: '1px solid rgba(201,168,76,0.15)' }}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <a href="/" className="inline-block mb-6">
              <img
                src="/images/logo.png"
                alt="Paryatan Holidays"
                className="w-20 h-20 rounded-full object-cover"
                style={{ filter: 'drop-shadow(0 0 12px rgba(247,148,29,0.25))' }}
              />
            </a>
            <p className="text-sm mb-8 max-w-md leading-relaxed" style={{ color: '#475569' }}>
              Crafting unforgettable journeys for the modern explorer. Experience the planet's
              most breathtaking landscapes and the richness of real Indian culture.
            </p>
            <div className="space-y-3">
              {[
                { Icon: MapPin,  text: 'Suresh Arcade, Vidyanagar, Infront of D\'Mart, Hoshangabad Road, Bhopal (M.P.)' },
                { Icon: Phone,  text: '+91-8982382828 | 95894 08202' },
                { Icon: Mail,   text: 'sales@paryatan.co.in' },
                { Icon: Globe,  text: 'www.paryatan.co.in' },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-3">
                  <Icon className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                  <span className="text-sm" style={{ color: '#475569' }}>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold mb-6 text-sm tracking-widest uppercase" style={{ color: '#f1f5f9', fontFamily: 'Cinzel, serif' }}>
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              {[
                ['/#tours',    'Domestic Tours'],
                ['/#tours',    'International Tours'],
                ['/#services', 'Our Services'],
                ['/#about',    'About Us'],
              ].map(([href, label]) => (
                <li key={label}>
                  <a href={href} className="transition-colors duration-200" style={{ color: '#475569' }}
                    onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.color = '#475569')}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Specializations */}
          <div>
            <h4 className="font-bold mb-6 text-sm tracking-widest uppercase" style={{ color: '#f1f5f9', fontFamily: 'Cinzel, serif' }}>
              Specializations
            </h4>
            <ul className="space-y-3 text-sm" style={{ color: '#475569' }}>
              {['Corporate & M.I.C.E Travel','Honeymoon Packages','Educational Tours','Women Group Tours'].map(s => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs" style={{ color: '#334155' }}>
            © {new Date().getFullYear()} Paryatan Holidays. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs" style={{ color: '#334155' }}>
            {['Privacy Policy','Terms & Conditions'].map(t => (
              <a key={t} href="#" className="transition-colors"
                onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                onMouseLeave={e => (e.currentTarget.style.color = '#334155')}>{t}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
