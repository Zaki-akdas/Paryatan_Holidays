import supabase from './db-client.js';

const SAMPLE_EXPERIENCES = [
  { id: 1, title: 'Taj Mahal Sunrise Tour', description: 'Witness the marble wonder at dawn with a guided heritage walk.' },
  { id: 2, title: 'Desert Safari in Dubai', description: 'Dune bashing, camel ride, and a starlit Bedouin camp dinner.' },
  { id: 3, title: 'Kerala Houseboat Cruise', description: 'Drift through serene backwaters on a luxury houseboat.' },
  { id: 4, title: 'Gulmarg Gondola Ride', description: 'Europe\'s highest cable car with panoramic Himalayan views.' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(200).json(SAMPLE_EXPERIENCES);
  }
}
