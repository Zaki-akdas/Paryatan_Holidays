import supabase from './db-client.js';

const SAMPLE_DESTINATIONS = [
  { id: 1, name: 'Agra', description: 'Home of the iconic Taj Mahal and Mughal heritage.', image_url: '/images/destinations/agra/1.jpg', region: 'North India' },
  { id: 2, name: 'Kashmir', description: 'Paradise on Earth with serene lakes and majestic mountains.', image_url: '/images/destinations/kashmir/1.jpg', region: 'North India' },
  { id: 3, name: 'Kerala', description: 'God\'s Own Country — backwaters, beaches, and Ayurveda.', image_url: '/images/destinations/kerala/1.jpg', region: 'South India' },
  { id: 4, name: 'Dubai', description: 'Luxury, adventure, and futuristic skyline experiences.', image_url: '/images/destinations/dubai/1.jpg', region: 'International' },
  { id: 5, name: 'Bali', description: 'Tropical beaches, ancient temples, and vibrant culture.', image_url: '/images/destinations/bali/1.jpg', region: 'International' },
  { id: 6, name: 'Goa', description: 'Sun-kissed beaches, Portuguese charm, and nightlife.', image_url: '/images/destinations/goa/1.jpg', region: 'West India' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(200).json(SAMPLE_DESTINATIONS);
  }
}
