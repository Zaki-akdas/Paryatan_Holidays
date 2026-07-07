import supabase from './db-client.js';

const knowledgeBase = {
  company: {
    name: "Paryatan Holidays",
    contact: { phone: "+91-8982382828", email: "sales@paryatan.co.in" },
    address: "Suresh Arcade, Bhopal"
  },
  services: ["Tour Packages", "Flight & Railway Bookings", "Hotel Reservations", "Visa Assistance"],
  budgetInfo: { domestic: "12,000", international: "35,000" }
};

async function getTourInfo(query) {
  try {
    const { data: tours } = await supabase.from('paryatan_tours').select('*');
    if (!tours) return null;
    const searchTerm = query.toLowerCase();
    return tours.find(t => 
      t.title?.toLowerCase().includes(searchTerm) ||
      t.location?.toLowerCase().includes(searchTerm) ||
      t.destination?.toLowerCase().includes(searchTerm) ||
      t.description?.toLowerCase().includes(searchTerm)
    ) || null;
  } catch (e) {
    console.error('Tour fetch error:', e);
    return null;
  }
}

function generateResponse(message, tourData = null) {
  const lowerMsg = message.toLowerCase().trim();

  const greetings = ['hi', 'hello', 'namaste', 'hey', 'good morning', 'good evening'];
  if (greetings.some(g => lowerMsg.includes(g))) {
    return `Hello! I'm Sarah, your AI travel expert at ${knowledgeBase.company.name}. I can help you explore tours, check itineraries, get pricing, or answer travel questions. What destination interests you?`;
  }

  if (lowerMsg.includes('book') || lowerMsg.includes('booking') || lowerMsg.includes('reserve')) {
    return `For bookings, view tour itineraries on our website or call ${knowledgeBase.company.contact.phone}. We offer customized packages for all destinations!`;
  }

  if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('budget') || lowerMsg.includes('₹')) {
    if (tourData?.price) {
      return `The ${tourData.title} starts at ₹${tourData.price.toLocaleString()}. Domestic tours from ₹${knowledgeBase.budgetInfo.domestic}, international from ₹${knowledgeBase.budgetInfo.international}.`;
    }
    return `Domestic tours start from ₹${knowledgeBase.budgetInfo.domestic} per person, international from ₹${knowledgeBase.budgetInfo.international}. Prices vary by duration and accommodation.`;
  }

  if (lowerMsg.includes('itinerary') || lowerMsg.includes('schedule') || lowerMsg.includes('plan')) {
    if (tourData?.itinerary) {
      return `Itinerary for ${tourData.title}:\n${tourData.itinerary}`;
    }
    return "Each tour has a detailed day-by-day itinerary. Click 'View Itinerary' on any tour card to see full details.";
  }

  if (lowerMsg.includes('contact') || lowerMsg.includes('support') || lowerMsg.includes('call')) {
    return `📞 ${knowledgeBase.company.contact.phone}\n📧 ${knowledgeBase.company.contact.email}\n📍 ${knowledgeBase.company.address}`;
  }

  if (tourData) {
    return `🌟 ${tourData.title}\n📍 ${tourData.location}\n⏱️ Duration: ${tourData.duration}\n💰 Price: ₹${tourData.price.toLocaleString()}\n\n${tourData.description}\n\nBest time: ${tourData.best_time}\nIncludes: ${tourData.includes}`;
  }

  return `I'm Sarah from ${knowledgeBase.company.name}. I can help with tour recommendations, itineraries, pricing, and bookings. Our destinations include Kashmir, Kerala, Goa, Jaipur, Ladakh, Dubai, Bali, and more. What would you like to explore?`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const tourData = await getTourInfo(message);
    const reply = generateResponse(message, tourData);

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    return res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat API error:', err);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
}
