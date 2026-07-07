import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Calendar, Users, CheckCircle2,
  XCircle, Info, CreditCard, ChevronLeft, Star,
  Image as ImageIcon, DollarSign, ChevronRight, RefreshCw
} from 'lucide-react';

const G = '#c9a84c';
const BG = '#050a14';
const CARD = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
const CARD2 = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.15)' };

const DEST_GALLERY = {
  dubai: ['https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=1920', 'https://source.unsplash.com/1920x1080/?dubai,burj-khalifa,luxury'],
  bali: ['https://images.unsplash.com/photo-1537996194414-6a12c715c8ad?w=1920', 'https://source.unsplash.com/1920x1080/?bali,temple'],
  paris: ['https://images.unsplash.com/photo-1511739001486-6bfe10fc785f?w=1920', 'https://source.unsplash.com/1920x1080/?paris,eiffel'],
  london: ['https://images.unsplash.com/photo-1513635266213-4c4c4e8d4d78?w=1920', 'https://source.unsplash.com/1920x1080/?london'],
  tokyo: ['https://images.unsplash.com/photo-1542051841857-53837f2f1aeb?w=1920', 'https://source.unsplash.com/1920x1080/?tokyo'],
  default: ['https://images.unsplash.com/photo-1469854523485-47f8e6f1f2b4?w=1920', 'https://source.unsplash.com/1920x1080/?travel']
};

export default function GeneratedItinerary() {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [packageTier, setPackageTier] = useState('standard');
  const [activePhoto, setActivePhoto] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('videoGenerated');
      if (stored) setItinerary(JSON.parse(stored));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }, []);

  const submitBooking = async () => {
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: itinerary.matched?.id || null,
          tourTitle: title,
          adults,
          children,
          packageTier,
          total,
          ...customerInfo,
          videoSource: itinerary.videoUrl || null
        })
      });
      const data = await res.json();
      if (data.success) {
        setBookingSuccess(true);
        setTimeout(() => setShowBookingForm(false), 3000);
      }
    } catch (e) {
      console.error('Booking error:', e);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: G, borderTopColor: 'transparent' }} />
    </div>
  );

  if (!itinerary) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: BG }}>
      <h2 className="text-3xl font-bold mb-4" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>Itinerary Not Found</h2>
      <Link to="/" className="flex items-center" style={{ color: G }}><ChevronLeft className="w-5 h-5 mr-1" /> Back to Home</Link>
    </div>
  );

  const title = itinerary.matched?.title || itinerary.generatedItinerary?.title || 'Custom Destination';
  const destKey = title.toLowerCase().includes('dubai') ? 'dubai' : 
                  title.toLowerCase().includes('bali') ? 'bali' :
                  title.toLowerCase().includes('paris') ? 'paris' :
                  title.toLowerCase().includes('london') ? 'london' :
                  title.toLowerCase().includes('tokyo') ? 'tokyo' : 'default';

  const gallery = DEST_GALLERY[destKey];
  const duration = itinerary.matched?.duration || itinerary.generatedItinerary?.duration || '5N/6D';
  const numDays = parseInt(duration.match(/(\d+)D/)?.[1] || 5);

  const highlights = itinerary.matched?.highlights || itinerary.generatedItinerary?.highlights || ['Local Sightseeing', 'Cultural Experience', 'Cuisine Tour'];
  const schedule = Array.from({ length: numDays }).map((_, i) => {
    if (i === 0) return { day: i+1, title: `Arrival & Welcome to ${title}`, desc: `Arrive at ${title}. Transfer to premium hotel. Evening at leisure.`, image: gallery[0] };
    if (i === numDays-1) return { day: i+1, title: 'Departure', desc: 'After breakfast, check out for onward journey.', image: gallery[gallery.length-1] };
    const hl = highlights[i % highlights.length];
    return { day: i+1, title: `Day ${i+1}: ${hl}`, desc: `Explore ${hl.toLowerCase()} with expert guide.`, image: gallery[i % gallery.length] };
  });

  const basePrice = itinerary.matched?.basePrice || itinerary.generatedItinerary?.basePrice || { standard: 15000, premium: 22000 };
  const baseAdult = basePrice[packageTier] || 15000;
  const baseChild = Math.round(baseAdult * 0.6);
  const totAdults = adults * baseAdult;
  const totChildren = children * baseChild;
  const discount = (totAdults + totChildren) > 50000 ? Math.round((totAdults + totChildren) * 0.05) : 0;
  const total = totAdults + totChildren - discount;
  const fmt = p => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(p);

  return (
    <div className="min-h-screen pb-24" style={{ background: BG, color: '#e2e8f0' }}>
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <div className="absolute inset-0">
          <img src={itinerary.matched?.image_url || gallery[0]} alt={title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050a14 0%, rgba(5,10,20,0.65) 50%, transparent 100%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Link to="/#tours" className="inline-flex items-center gap-1 px-4 py-2 rounded-full mb-6 w-fit text-sm font-medium transition-all"
            style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)', color: G }}>
            <ChevronLeft className="w-4 h-4" /> Back to Tours
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#050a14' }}>AI Generated</span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: G }} /> {duration}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0' }}>
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 4.8 / 5
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80' }}>
              <CheckCircle2 className="w-3.5 h-3.5" /> {itinerary.detected || 'Custom'}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-2 drop-shadow-xl" style={{ fontFamily: 'Cinzel,serif', color: '#f1f5f9' }}>{title}</h1>
          <p className="text-lg font-mono" style={{ color: '#94a3b8' }}>Source: {itinerary.videoTitle || 'YouTube video'}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }} className="rounded-2xl p-8" style={CARD}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                <Info className="w-6 h-6" style={{ color: G }} /> AI Generated Itinerary
              </h2>
              <p className="leading-relaxed text-lg" style={{ color: '#94a3b8' }}>
                This customized itinerary was auto-generated from video analysis. Experience {numDays} days exploring {title} with all highlights.
              </p>
            </motion.div>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }} className="rounded-2xl p-8" style={CARD}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                <ImageIcon className="w-6 h-6" style={{ color: G }} /> Photo Gallery
              </h2>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 group" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <AnimatePresence mode="wait">
                  <motion.img key={activePhoto} src={gallery[activePhoto]} alt={`Photo ${activePhoto+1}`}
                    initial={{ opacity:0, scale:1.04 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.97 }}
                    transition={{ duration:0.4 }} className="w-full h-full object-cover" />
                </AnimatePresence>
                <button onClick={() => setActivePhoto((activePhoto-1+gallery.length)%gallery.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <ChevronLeft className="w-5 h-5" style={{ color: '#e2e8f0' }} />
                </button>
                <button onClick={() => setActivePhoto((activePhoto+1)%gallery.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <ChevronRight className="w-5 h-5" style={{ color: '#e2e8f0' }} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {gallery.map((_, i) => (
                    <button key={i} onClick={() => setActivePhoto(i)} className={`h-2 rounded-full transition-all ${i === activePhoto ? 'w-5' : 'w-2'}`}
                      style={{ background: i === activePhoto ? G : 'rgba(255,255,255,0.4)' }} />
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.09 }} className="rounded-2xl p-8" style={CARD}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                <Star className="w-6 h-6" style={{ color: G }} /> Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((hl, i) => (
                  <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1+i*0.05 }}
                    className="flex items-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-2 h-2 rounded-full mr-3" style={{ background: G }} />
                    <span className="font-medium" style={{ color: '#e2e8f0' }}>{hl}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.14 }} className="rounded-2xl p-8" style={CARD}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                <Calendar className="w-6 h-6" style={{ color: G }} /> Daily Itinerary
              </h2>
              <div className="space-y-12">
                {schedule.map((day, i) => (
                  <motion.div key={i} initial={{ opacity:0, x:i%2===0?-30:30 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.15+i*0.05 }}
                    className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold shrink-0 md:order-1" style={{ background: G, color: BG }}>D{day.day}</div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)]">
                      <div className="flex flex-col md:flex-row gap-4 rounded-2xl overflow-hidden" style={CARD}>
                        <div className="md:w-1/2 aspect-video overflow-hidden hidden md:block"><img src={day.image} alt={day.title} className="w-full h-full object-cover" /></div>
                        <div className="p-6 md:w-1/2">
                          <h3 className="font-bold text-xl mb-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>{day.title}</h3>
                          <p className="text-sm" style={{ color: '#94a3b8' }}>{day.desc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.16 }} className="sticky top-32 rounded-2xl p-8" style={CARD2}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>Booking Summary</h3>
              <div className="flex p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {['standard','premium'].map(tier => (
                  <button key={tier} onClick={() => setPackageTier(tier)} className="flex-1 py-2 text-sm font-semibold rounded-lg capitalize transition-all"
                    style={ packageTier===tier ? { background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#050a14' } : { color: '#64748b' } }>
                    {tier === 'standard' ? 'Standard (3AC)' : 'Premium (Flight)'}
                  </button>
                ))}
              </div>
              <div className="space-y-4 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {[{ label:'Adults', sub:'12+ years', val:adults, setVal:setAdults, min:1 }, { label:'Children', sub:'2-11 years', val:children, setVal:setChildren, min:0 }].map(({ label, sub, val, setVal, min }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium flex items-center gap-2" style={{ color: '#f1f5f9' }}><Users className="w-4 h-4" style={{ color: G }} /> {label}</p>
                      <p className="text-xs" style={{ color: '#475569' }}>{sub}</p>
                    </div>
                    <div className="flex items-center gap-3 p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <button onClick={() => setVal(Math.max(min, val-1))} className="w-8 h-8 rounded-full" style={{ color: '#e2e8f0' }}>-</button>
                      <span className="w-4 text-center" style={{ color: '#e2e8f0' }}>{val}</span>
                      <button onClick={() => setVal(val+1)} className="w-8 h-8 rounded-full" style={{ color: '#e2e8f0' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between" style={{ color: '#94a3b8' }}>
                  <span><DollarSign className="w-4 h-4 inline" style={{ color: G }} /> Adult / person</span>
                  <span className="font-medium">{fmt(baseAdult)}</span>
                </div>
                <div className="flex justify-between" style={{ color: '#94a3b8' }}><span>{adults}× Adults</span><span className="font-medium">{fmt(totAdults)}</span></div>
                {children > 0 && (<div className="flex justify-between" style={{ color: '#94a3b8' }}><span>{children}× Children</span><span className="font-medium">{fmt(totChildren)}</span></div>)}
                {discount > 0 && (<div className="flex justify-between font-medium pt-2" style={{ color: '#4ade80', borderTop: '1px solid rgba(255,255,255,0.06)' }}><span>Early Bird (5%)</span><span>-{fmt(discount)}</span></div>)}
              </div>
              <div className="rounded-xl p-3 mb-6 text-center" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <p className="text-xs flex items-center justify-center gap-1" style={{ color: G }}><CheckCircle2 className="w-3 h-3" /> No hidden costs — taxes included.</p>
              </div>
              <div className="pt-6 mb-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm mb-1" style={{ color: '#64748b' }}>Total Cost</p>
                <p className="text-3xl font-bold" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>{fmt(total)}</p>
              </div>
              
              <AnimatePresence>
                {showBookingForm && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }} className="mb-4 overflow-hidden">
                    {bookingSuccess ? (
                      <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
                        <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: '#4ade80' }} />
                        <p className="font-medium" style={{ color: '#4ade80' }}>Booking request sent successfully!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <input type="text" placeholder="Your Name" value={customerInfo.name} onChange={e => setCustomerInfo({...customerInfo, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }} />
                        <input type="tel" placeholder="Phone Number" value={customerInfo.phone} onChange={e => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }} />
                        <input type="email" placeholder="Email (optional)" value={customerInfo.email} onChange={e => setCustomerInfo({...customerInfo, email: e.target.value})}
                          className="w-full px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0' }} />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {showBookingForm && !bookingSuccess && (
                <button onClick={submitBooking} className="w-full py-3 rounded-xl font-medium text-sm mb-2"
                  style={{ background: 'rgba(34,197,94,0.2)', color: '#4ade80' }}>
                  Confirm Booking
                </button>
              )}
              {!showBookingForm && (
                <button onClick={() => setShowBookingForm(true)} className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#050a14', boxShadow: '0 0 30px rgba(201,168,76,0.3)' }}>
                  <CreditCard className="w-5 h-5" /> Request Booking
                </button>
              )}
              <p className="text-center text-xs mt-4" style={{ color: '#475569' }}>No credit card required yet.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}