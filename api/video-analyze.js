import supabase from './db-client.js';

const DESTINATIONS = [
  { keywords: ['dubai', 'uae', 'emirates', 'abu dhabi', 'sharjah', 'arab'], matchKey: 'dubai', highlights: ['Burj Khalifa Observation','Desert Safari Adventure','Dubai Mall Shopping','Abra Ride in Dubai Creek'], basePrice: { standard:25000, premium:35000 } },
  { keywords: ['bali', 'indonesia', 'ubud', 'seminyak'], matchKey: 'bali', highlights: ['Uluwatu Temple Sunset','Rice Terraces Trek','Water Sports at Nusa Dua','Traditional Dance Show'], basePrice: { standard:28000, premium:38000 } },
  { keywords: ['agra', 'taj mahal', 'delhi', 'fatehpur sikri', 'india gate'], matchKey: 'agra', highlights: ['Taj Mahal Sunrise Visit','Agra Fort Exploration','Mughal Heritage Walk','Local Craft Shopping'], basePrice: { standard:14500, premium:19500 } },
  { keywords: ['kashmir', 'srinagar', 'gulmarg', 'pahalgam', 'dal lake'], matchKey: 'kashmir', highlights: ['Srinagar Houseboat Stay','Gulmarg Gondola Ride','Pahalgam Valley','Shikara Ride on Dal Lake'], basePrice: { standard:18500, premium:24500 } },
  { keywords: ['kerala', 'kochi', 'munnar', 'alleppey', 'backwater'], matchKey: 'kerala', highlights: ['Houseboat Cruise in Alleppey','Munnar Tea Plantations','Kochi Fort Kochi','Ayurvedic Spa Session'], basePrice: { standard:16500, premium:22500 } },
  { keywords: ['goa', 'panaji', 'calangute', 'anjuna'], matchKey: 'goa', highlights: ['Beach Hopping Tour','Portuguese Heritage Walk','Water Sports Activities','Sunset at Fort Aguada'], basePrice: { standard:12500, premium:18500 } },
  { keywords: ['ladakh', 'leh', 'pangong', 'nubra'], matchKey: 'ladakh', highlights: ['Pangong Lake Sunrise','Nubra Valley Adventure','Magnetic Hill Visit','Local Monastery Tour'], basePrice: { standard:22000, premium:28000 } },
  { keywords: ['jaipur', 'jodhpur', 'udaipur', 'rajasthan', 'amber fort'], matchKey: 'jaipur', highlights: ['Amber Fort Elephant Ride','City Palace Visit','Hawa Mahal Photo Stop','Johari Bazaar Shopping'], basePrice: { standard:11500, premium:16500 } },
  { keywords: ['darjeeling', 'gangtok', 'mirik', 'tea garden'], matchKey: 'darjeeling', highlights: ['Tiger Hill Sunrise','Toy Train Ride','Tea Garden Tour','Gangtok Monastery'], basePrice: { standard:15500, premium:21500 } },
  { keywords: ['kanha', 'bandhavgarh', 'tiger', 'wildlife'], matchKey: 'kanha', highlights: ['Jungle Safari Rides','Tiger Spotting','Bird Watching','Nature Walks'], basePrice: { standard:13500, premium:19500 } },
  { keywords: ['mysore', 'coorg', 'ooty'], matchKey: 'mysore', highlights: ['Mysore Palace Illumination','Chamundi Hills Visit','Brindavan Gardens','Silk Shopping'], basePrice: { standard:11500, premium:16500 } },
  { keywords: ['rishikesh', 'yoga', 'ganga', 'rafting'], matchKey: 'rishikesh', highlights: ['Ganga Aarti Ceremony','White Water Rafting','Yoga & Meditation','Laxman Jhula Walk'], basePrice: { standard:10500, premium:15500 } },
];

const GLOBAL_DESTINATIONS = [
  { keywords: ['paris', 'france', 'eiffel', 'louvre'], key: 'international', highlights: ['Eiffel Tower Visit','Louvre Museum Tour','Seine River Cruise','Notre Dame Area'], basePrice: { standard: 45000, premium: 65000 } },
  { keywords: ['london', 'uk', 'britain', 'big ben'], key: 'international', highlights: ['Tower of London','British Museum','Buckingham Palace','London Eye'], basePrice: { standard: 40000, premium: 58000 } },
  { keywords: ['tokyo', 'japan', 'kyoto', 'cherry blossom'], key: 'international', highlights: ['Sensoji Temple','Shibuya Crossing','Mount Fuji Day Trip','Traditional Tea Ceremony'], basePrice: { standard: 55000, premium: 75000 } },
  { keywords: ['new york', 'manhattan', 'statue of liberty'], key: 'international', highlights: ['Statue of Liberty','Central Park Tour','Empire State Building','Broadway Show'], basePrice: { standard: 50000, premium: 70000 } },
  { keywords: ['singapore', 'marina bay', 'gardens by the bay'], key: 'international', highlights: ['Marina Bay Sands','Sentosa Island','Universal Studios','Night Safari'], basePrice: { standard: 35000, premium: 48000 } },
];

function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([^&\?]+)/,
    /(?:youtube\.com\/(?:shorts\/)|youtube\.com\/(?:live_stream\?stream_id=))([^&\?]+)/
  ];
  for (const p of patterns) {
    const match = url.match(p);
    if (match) return match[1];
  }
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v') || null;
  } catch {
    return null;
  }
}

function extractDestinations(text) {
  const lowerText = text.toLowerCase();
  const found = [];
  for (const dest of DESTINATIONS) {
    for (const kw of dest.keywords) {
      if (lowerText.includes(kw.toLowerCase())) {
        found.push(dest);
        break;
      }
    }
  }
  if (found.length === 0) {
    for (const dest of GLOBAL_DESTINATIONS) {
      for (const kw of dest.keywords) {
        if (lowerText.includes(kw.toLowerCase())) {
          found.push(dest);
          break;
        }
      }
    }
  }
  return found;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    const videoId = extractVideoId(url);
    let fullText = url;

    if (videoId) {
      try {
        const encodedUrl = encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`);
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodedUrl}&format=json`;
        const oembedRes = await fetch(oembedUrl);
        if (oembedRes.ok) {
          const videoData = await oembedRes.json();
          fullText = videoData?.title || url;
        }
      } catch (e) {
        console.warn('oEmbed failed:', e.message);
      }
    }

    const matchedDests = extractDestinations(fullText);

    if (matchedDests.length === 0) {
      const { data: allTours } = await supabase.from('paryatan_tours').select('id, title, category, image_url, duration');
      return res.json({
        detected: null,
        matched: null,
        allAvailableTours: allTours || [],
        videoTitle: fullText,
        message: 'No specific destinations detected. Showing all available tours.',
        generatedItinerary: null
      });
    }

    const primaryDest = matchedDests[0];
    const detectedList = matchedDests.map(d => d.matchKey || d.key).join(', ');
    const { data: existingTour } = await supabase
      .from('paryatan_tours')
      .select('*')
      .or(`title.ilike.%${primaryDest.matchKey || primaryDest.key}%,title.ilike.%${detectedList}%`)
      .limit(1)
      .single();

    const generatedItinerary = {
      duration: existingTour?.duration || primaryDest.matchKey ? '5N/6D' : '6N/7D',
      title: existingTour?.title || detectedList.charAt(0).toUpperCase() + detectedList.slice(1),
      highlights: primaryDest.highlights,
      basePrice: primaryDest.basePrice,
      isDomestic: !!primaryDest.matchKey
    };

    return res.json({
      detected: detectedList,
      matched: existingTour,
      allMatches: matchedDests,
      allAvailableTours: [existingTour].filter(Boolean),
      videoTitle: fullText,
      generatedItinerary,
      message: `Generated custom itinerary for ${generatedItinerary.title}`
    });
  } catch (err) {
    console.error('Video analyze error:', err);
    res.status(500).json({ error: err.message });
  }
}