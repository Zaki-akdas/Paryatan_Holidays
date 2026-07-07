import { useState, useEffect } from 'react';
import HeroParallax from '../components/HeroParallax';
import Tours from '../components/Tours';
import Services from '../components/Services';
import AnimatedShowcase from '../components/AnimatedShowcase';
import VideoPlanner from '../components/VideoPlanner';
import About from '../components/About';
import BookingCTA from '../components/BookingCTA';
import Contact from '../components/Contact';

export default function Home() {
  const [tours, setTours] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursRes, servicesRes] = await Promise.all([
          fetch('/api/tours'),
          fetch('/api/services')
        ]);
        
        const toursData = await toursRes.json();
        const servicesData = await servicesRes.json();
        
        setTours(toursData);
        setServices(servicesData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#050a14' }}>
        <div className="flex flex-col items-center gap-6">
          <img src="/images/logo.png" alt="Paryatan Holidays" className="w-24 h-24 rounded-full object-cover animate-pulse" />
          <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: '#c9a84c', borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen" style={{ background: '#050a14' }}>
      <div className="relative z-10">
        <HeroParallax />
        <Tours tours={tours} />
        <Services services={services} />
        <AnimatedShowcase />
        <VideoPlanner />
        <About />
        <BookingCTA />
        <Contact />
      </div>
    </main>
  );
}
