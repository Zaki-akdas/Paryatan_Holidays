import supabase from './db-client.js';

const SAMPLE_SERVICES = [
  { id: 1, icon: 'FileText', title: 'Visa Assistance', description: 'Hassle-free visa processing for all destinations with end-to-end documentation support.' },
  { id: 2, icon: 'Plane', title: 'Flight Booking', description: 'Best fares on domestic and international flights with flexible date options.' },
  { id: 3, icon: 'Building', title: 'Hotel Accommodation', description: 'Handpicked hotels and resorts ensuring comfort and value for money.' },
  { id: 4, icon: 'Shield', title: 'Travel Insurance', description: 'Comprehensive coverage for a worry-free journey across the globe.' },
  { id: 5, icon: 'Map', title: 'Custom Itineraries', description: 'Bespoke travel plans crafted to match your pace and preferences.' },
  { id: 6, icon: 'Briefcase', title: 'Corporate Travel', description: 'Dedicated solutions for business trips, group bookings and MICE events.' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('paryatan_services')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(200).json(SAMPLE_SERVICES);
  }
}
