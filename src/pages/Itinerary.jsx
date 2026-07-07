import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Calendar, Users, CheckCircle2,
  XCircle, Info, CreditCard, ChevronLeft, Star,
  Image as ImageIcon, DollarSign, ChevronRight
} from 'lucide-react';

const G = '#c9a84c';
const BG = '#050a14';
const CARD = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
const CARD2 = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.15)' };

const DESTINATION_DATA = {
  agra:       { gallery: ['/images/destinations/agra/1.jpg','/images/destinations/agra/2.jpg','/images/destinations/agra/3.jpg','/images/destinations/agra/4.jpg'], highlights: ['Taj Mahal Sunrise Visit','Agra Fort Exploration','Mughal Heritage Walk','Local Craft Shopping'], basePrice: { standard:14500, premium:19500 } },
  kashmir:    { gallery: ['/images/destinations/kashmir/1.jpg','/images/destinations/kashmir/2.jpg','/images/destinations/kashmir/3.jpg','/images/destinations/kashmir/4.jpg'], highlights: ['Srinagar Houseboat Stay','Gulmarg Gondola Ride','Pahalgam Valley','Shikara Ride on Dal Lake'], basePrice: { standard:18500, premium:24500 } },
  kerala:     { gallery: ['/images/destinations/kerala/1.jpg','/images/destinations/kerala/2.jpg','/images/destinations/kerala/3.jpg','/images/destinations/kerala/4.jpg'], highlights: ['Houseboat Cruise in Alleppey','Munnar Tea Plantations','Kochi Fort Kochi','Ayurvedic Spa Session'], basePrice: { standard:16500, premium:22500 } },
  dubai:      { gallery: ['/images/destinations/dubai/1.jpg','/images/destinations/dubai/2.jpg','/images/destinations/dubai/3.jpg','/images/destinations/dubai/4.jpg'], highlights: ['Burj Khalifa Observation','Desert Safari Adventure','Dubai Mall Shopping','Abra Ride in Dubai Creek'], basePrice: { standard:25000, premium:35000 } },
  bali:       { gallery: ['/images/destinations/bali/1.jpg','/images/destinations/bali/2.jpg','/images/destinations/bali/3.jpg','/images/destinations/bali/4.jpg'], highlights: ['Uluwatu Temple Sunset','Rice Terraces Trek','Water Sports at Nusa Dua','Traditional Dance Show'], basePrice: { standard:28000, premium:38000 } },
  goa:        { gallery: ['/images/destinations/goa/1.jpg','/images/destinations/goa/2.jpg','/images/destinations/goa/3.jpg','/images/destinations/goa/4.jpg'], highlights: ['Beach Hopping Tour','Portuguese Heritage Walk','Water Sports Activities','Sunset at Fort Aguada'], basePrice: { standard:12500, premium:18500 } },
  ladakh:     { gallery: ['/images/destinations/ladakh/1.jpg','/images/destinations/ladakh/2.jpg','/images/destinations/ladakh/3.jpg','/images/destinations/ladakh/4.jpg'], highlights: ['Pangong Lake Sunrise','Nubra Valley Adventure','Magnetic Hill Visit','Local Monastery Tour'], basePrice: { standard:22000, premium:28000 } },
  jaipur:     { gallery: ['/images/destinations/jaipur/1.jpg','/images/destinations/jaipur/2.jpg','/images/destinations/jaipur/3.jpg','/images/destinations/jaipur/4.jpg'], highlights: ['Amber Fort Elephant Ride','City Palace Visit','Hawa Mahal Photo Stop','Johari Bazaar Shopping'], basePrice: { standard:11500, premium:16500 } },
  darjeeling: { gallery: ['/images/destinations/darjeeling/1.jpg','/images/destinations/darjeeling/2.jpg','/images/destinations/darjeeling/3.jpg','/images/destinations/darjeeling/4.jpg'], highlights: ['Tiger Hill Sunrise','Toy Train Ride','Tea Garden Tour','Gangtok Monastery'], basePrice: { standard:15500, premium:21500 } },
  kanha:      { gallery: ['/images/destinations/kanha/1.jpg','/images/destinations/kanha/2.jpg','/images/destinations/kanha/3.jpg','/images/destinations/kanha/4.jpg'], highlights: ['Jungle Safari Rides','Tiger Spotting','Bird Watching','Nature Walks'], basePrice: { standard:13500, premium:19500 } },
  mysore:     { gallery: ['/images/destinations/mysore/1.jpg','/images/destinations/mysore/2.jpg','/images/destinations/mysore/3.jpg','/images/destinations/mysore/4.jpg'], highlights: ['Mysore Palace Illumination','Chamundi Hills Visit','Brindavan Gardens','Silk Shopping'], basePrice: { standard:11500, premium:16500 } },
  rishikesh:  { gallery: ['/images/destinations/rishikesh/1.jpg','/images/destinations/rishikesh/2.jpg','/images/destinations/rishikesh/3.jpg','/images/destinations/rishikesh/4.jpg'], highlights: ['Ganga Aarti Ceremony','White Water Rafting','Yoga & Meditation','Laxman Jhula Walk'], basePrice: { standard:10500, premium:15500 } },
  default:    { gallery: ['/images/dest-1.jpg','/images/dest-2.jpg','/images/dest-3.jpg'], highlights: ['Guided Sightseeing','Local Cuisine Experience','Cultural Activities','Leisure Time'], basePrice: { standard:12000, premium:18000 } },
};

const getDestinationKey = (title) => {
  const t = title.toLowerCase();
  if (t.includes('agra') || t.includes('taj'))                          return 'agra';
  if (t.includes('kashmir'))                                             return 'kashmir';
  if (t.includes('kerala'))                                              return 'kerala';
  if (t.includes('dubai'))                                               return 'dubai';
  if (t.includes('bali'))                                                return 'bali';
  if (t.includes('goa'))                                                 return 'goa';
  if (t.includes('ladakh'))                                              return 'ladakh';
  if (t.includes('jaipur') || t.includes('jodhpur'))                    return 'jaipur';
  if (t.includes('darjeeling') || t.includes('gangtok'))                return 'darjeeling';
  if (t.includes('kanha') || t.includes('wildlife'))                    return 'kanha';
  if (t.includes('mysore') || t.includes('coorg'))                      return 'mysore';
  if (t.includes('rishikesh') || t.includes('haridwar'))                return 'rishikesh';
  return 'default';
};

export default function Itinerary() {
  const { id } = useParams();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [packageTier, setPackageTier] = useState('standard');
  const [activePhoto, setActivePhoto] = useState(0);

  useEffect(() => {
    fetch(`/api/tour?id=${id}`)
      .then(r => r.json())
      .then(data => setTour(data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
      <div className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
        style={{ borderColor: G, borderTopColor: 'transparent' }} />
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: BG }}>
      <h2 className="text-3xl font-bold mb-4" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>Tour Not Found</h2>
      <Link to="/" className="flex items-center" style={{ color: G }}>
        <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
      </Link>
    </div>
  );

  const destData = DESTINATION_DATA[getDestinationKey(tour.title)];
  const numDays = parseInt((tour.duration.match(/(\d+)D/) || [0, 5])[1]);

  const schedule = Array.from({ length: numDays }).map((_, i) => {
    if (i === 0) return { day: i+1, title: `Arrival & Welcome to ${tour.title}`, desc: `Arrive at ${tour.title}. Meet and greet by our representative. Transfer to your premium hotel. Evening at leisure — enjoy ${destData.highlights[0]}.`, image: destData.gallery[0] };
    if (i === numDays-1) return { day: i+1, title: 'Departure', desc: 'After a hearty breakfast, check out and transfer to the airport/station for your onward journey with beautiful memories.', image: destData.gallery[destData.gallery.length-1] };
    const hl = destData.highlights[i % destData.highlights.length];
    return { day: i+1, title: `Day ${i+1}: ${hl}`, desc: `Experience ${hl.toLowerCase()} with our expert guide. Includes comfortable transfers, entrance fees, and an authentic local lunch.`, image: destData.gallery[i % destData.gallery.length] };
  });

  const baseAdult    = destData.basePrice[packageTier] || 14500;
  const baseChild    = Math.round(baseAdult * 0.6);
  const totAdults    = adults * baseAdult;
  const totChildren  = children * baseChild;
  const discount     = (totAdults + totChildren) > 50000 ? Math.round((totAdults + totChildren) * 0.05) : 0;
  const total        = totAdults + totChildren - discount;
  const fmt = p => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(p);

  const fullGallery = [tour.image_url, ...destData.gallery.filter(img => img !== tour.image_url)];

  return (
    <div className="min-h-screen pb-24" style={{ background: BG, color: '#e2e8f0' }}>

      {/* ── Hero Banner ── */}
      <div className="relative h-[60vh] min-h-[500px] w-full">
        <div className="absolute inset-0">
          <img src={tour.image_url} alt={tour.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #050a14 0%, rgba(5,10,20,0.65) 50%, rgba(5,10,20,0.2) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-12">
          <Link to="/#tours" className="inline-flex items-center gap-1 px-4 py-2 rounded-full mb-6 w-fit text-sm font-medium transition-all"
            style={{ background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)', color: G }}>
            <ChevronLeft className="w-4 h-4" /> Back to Tours
          </Link>
          <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#050a14' }}>{tour.category}</span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: G }} /> {tour.duration}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: '#e2e8f0' }}>
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" /> 4.8 / 5
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-2 drop-shadow-xl" style={{ fontFamily: 'Cinzel,serif', color: '#f1f5f9' }}>{tour.title}</h1>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left Column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Trip Overview */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
              className="rounded-2xl p-8" style={CARD}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                <Info className="w-6 h-6" style={{ color: G }} /> Trip Overview
              </h2>
              <p className="leading-relaxed text-lg" style={{ color: '#94a3b8' }}>
                Experience the magic of {tour.title} with our meticulously crafted {tour.duration} itinerary.
                Designed for travellers who seek authentic cultural immersion and breathtaking landscapes,
                this journey balances guided excursions with ample leisure time. Every detail is managed
                by Paryatan Holidays so you can focus on making memories.
              </p>
            </motion.div>

            {/* Photo Gallery */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.08 }}
              className="rounded-2xl p-8" style={CARD}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                <ImageIcon className="w-6 h-6" style={{ color: G }} /> Photo Gallery
              </h2>
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-4 group" style={{ border: '1px solid rgba(255,255,255,0.12)' }}>
                <AnimatePresence mode="wait">
                  <motion.img key={activePhoto} src={fullGallery[activePhoto]} alt={`Photo ${activePhoto+1}`}
                    initial={{ opacity:0, scale:1.04 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.97 }}
                    transition={{ duration:0.4 }} className="w-full h-full object-cover" />
                </AnimatePresence>
                <button onClick={() => setActivePhoto((activePhoto-1+fullGallery.length)%fullGallery.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <ChevronLeft className="w-5 h-5" style={{ color: '#e2e8f0' }} />
                </button>
                <button onClick={() => setActivePhoto((activePhoto+1)%fullGallery.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <ChevronRight className="w-5 h-5" style={{ color: '#e2e8f0' }} />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {fullGallery.map((_, i) => (
                    <button key={i} onClick={() => setActivePhoto(i)}
                      className={`h-2 rounded-full transition-all ${i === activePhoto ? 'w-5' : 'w-2'}`}
                      style={{ background: i === activePhoto ? G : 'rgba(255,255,255,0.4)' }} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {fullGallery.map((photo, idx) => (
                  <motion.button key={idx} whileHover={{ scale:1.04 }} onClick={() => setActivePhoto(idx)}
                    className="aspect-square rounded-xl overflow-hidden border-2 transition-all"
                    style={{ borderColor: idx === activePhoto ? G : 'rgba(255,255,255,0.12)' }}>
                    <img src={photo} alt={`Thumb ${idx+1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Destination Highlights */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.09 }}
              className="rounded-2xl p-8" style={CARD}>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                <Star className="w-6 h-6" style={{ color: G }} /> Destination Highlights
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destData.highlights.map((hl, i) => (
                  <motion.div key={i} initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.1+i*0.05 }} className="flex items-center p-4 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div className="w-2 h-2 rounded-full mr-3 shrink-0" style={{ background: G }} />
                    <span className="font-medium" style={{ color: '#e2e8f0' }}>{hl}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Daily Itinerary */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.14 }}
              className="rounded-2xl p-8" style={CARD}>
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                <Calendar className="w-6 h-6" style={{ color: G }} /> Daily Itinerary
              </h2>
              <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 md:before:mx-auto before:h-full before:w-0.5 before:bg-gradient-to-b"
                style={{ '--tw-gradient-from': G, '--tw-gradient-to': 'transparent' }}>
                {schedule.map((day, i) => (
                  <motion.div key={i} initial={{ opacity:0, x:i%2===0?-30:30 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay:0.15+i*0.05 }} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 border-4"
                      style={{ borderColor: BG, background: G, color: BG }}>D{day.day}</div>
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)]">
                      <div className="flex flex-col md:flex-row gap-4 rounded-2xl overflow-hidden" style={CARD}>
                        <div className="md:w-1/2 aspect-video overflow-hidden hidden md:block">
                          <img src={day.image} alt={day.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-6 md:w-1/2">
                          <h3 className="font-bold text-xl mb-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>{day.title}</h3>
                          <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>{day.desc}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Included / Excluded */}
            <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl p-8" style={CARD}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                  <CheckCircle2 className="w-6 h-6" style={{ color: G }} /> What's Included
                </h3>
                <ul className="space-y-4">
                  {['Premium Accommodation','Daily Breakfast & Dinner','Railway Tickets (Default) & Transfers','Custom Flight/Bus on Request','Sightseeing in AC Vehicle','Expert Local Guide'].map(item => (
                    <li key={item} className="flex items-start" style={{ color: '#94a3b8' }}>
                      <CheckCircle2 className="w-5 h-5 mr-3 shrink-0 mt-0.5" style={{ color: G }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl p-8" style={CARD}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>
                  <XCircle className="w-6 h-6" style={{ color: '#64748b' }} /> What's Excluded
                </h3>
                <ul className="space-y-4">
                  {['Airfare / Train Fare','Lunch & Personal Expenses','Monument Entry Fees','Travel Insurance','Camera/Video permits','Tips & Gratuities'].map(item => (
                    <li key={item} className="flex items-start" style={{ color: '#94a3b8' }}>
                      <XCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5" style={{ color: '#64748b' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

          </div>

          {/* ── Booking Sidebar ── */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.16 }}
              className="sticky top-32 rounded-2xl p-8" style={CARD2}>
              <h3 className="text-2xl font-bold mb-6" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>Booking Summary</h3>

              {/* Package toggle */}
              <div className="flex p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {['standard','premium'].map(tier => (
                  <button key={tier} onClick={() => setPackageTier(tier)}
                    className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all capitalize"
                    style={ packageTier===tier
                      ? { background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#050a14' }
                      : { color: '#64748b' }
                    }>
                    {tier === 'standard' ? 'Standard (3AC)' : 'Premium (Flight)'}
                  </button>
                ))}
              </div>

              {/* Passengers */}
              <div className="space-y-4 mb-8 pb-8" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {[{ label:'Adults', sub:'12+ years', val:adults, setVal:setAdults, min:1 }, { label:'Children', sub:'2-11 years', val:children, setVal:setChildren, min:0 }].map(({ label, sub, val, setVal, min }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium flex items-center gap-2" style={{ color: '#f1f5f9' }}>
                        <Users className="w-4 h-4" style={{ color: G }} /> {label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#475569' }}>{sub}</p>
                    </div>
                    <div className="flex items-center gap-3 p-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      <button onClick={() => setVal(Math.max(min, val-1))} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" style={{ color: '#e2e8f0' }}>-</button>
                      <span className="w-4 text-center font-medium" style={{ color: '#e2e8f0' }}>{val}</span>
                      <button onClick={() => setVal(val+1)} className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10" style={{ color: '#e2e8f0' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between" style={{ color: '#94a3b8' }}>
                  <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" style={{ color: G }} /> Adult / person</span>
                  <span className="font-medium">{fmt(baseAdult)}</span>
                </div>
                <div className="flex justify-between" style={{ color: '#94a3b8' }}>
                  <span>{adults}× Adults</span>
                  <span className="font-medium">{fmt(totAdults)}</span>
                </div>
                {children > 0 && (
                  <div className="flex justify-between" style={{ color: '#94a3b8' }}>
                    <span>{children}× Children (60%)</span>
                    <span className="font-medium">{fmt(totChildren)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between font-medium pt-2" style={{ color: '#4ade80', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span>Early Bird (5%)</span>
                    <span>-{fmt(discount)}</span>
                  </div>
                )}
              </div>

              {/* No hidden costs */}
              <div className="rounded-xl p-3 mb-6 text-center" style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <p className="text-xs flex items-center justify-center gap-1" style={{ color: G }}>
                  <CheckCircle2 className="w-3 h-3" /> No hidden costs — taxes included.
                </p>
              </div>

              {/* Total */}
              <div className="pt-6 mb-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-sm mb-1" style={{ color: '#64748b' }}>Total Cost</p>
                <p className="text-3xl font-bold" style={{ color: '#f1f5f9', fontFamily: 'Cinzel,serif' }}>{fmt(total)}</p>
              </div>

              {/* Book button */}
              <button className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                style={{ background: 'linear-gradient(135deg,#c9a84c,#a07830)', color: '#050a14', boxShadow: '0 0 30px rgba(201,168,76,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 50px rgba(201,168,76,0.55)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 30px rgba(201,168,76,0.3)')}>
                <CreditCard className="w-5 h-5" /> Request Booking
              </button>
              <p className="text-center text-xs mt-4" style={{ color: '#475569' }}>No credit card required yet. Our team will confirm availability.</p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
