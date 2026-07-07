import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Itinerary from './pages/Itinerary';
import VideoItinerary from './pages/VideoItinerary';
import GeneratedItinerary from './pages/GeneratedItinerary';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ChatWidget from './components/ChatWidget';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div
        className="min-h-screen font-sans relative"
        style={{ background: '#050a14', color: '#e2e8f0' }}
      >
        <style>{`::selection { background: #c9a84c; color: #050a14; }`}</style>

        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/"        element={<Home />} />
            <Route path="/tour/:id" element={<Itinerary />} />
            <Route path="/video-itinerary/:tourId" element={<VideoItinerary />} />
            <Route path="/generated-itinerary" element={<GeneratedItinerary />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
          <Footer />
          <ChatWidget />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
