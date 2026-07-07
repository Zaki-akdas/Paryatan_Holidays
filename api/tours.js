import supabase from './db-client.js';

const SAMPLE_TOURS = [
  { id: '1', title: 'Agra Heritage Tour', category: 'Heritage', duration: '5D/4N', image_url: '/images/tours/agra.jpg' },
  { id: '2', title: 'Kashmir Paradise', category: 'Nature', duration: '6D/5N', image_url: '/images/tours/kashmir.jpg' },
  { id: '3', title: 'Kerala Backwaters', category: 'Relaxation', duration: '5D/4N', image_url: '/images/tours/kerala.jpg' },
  { id: '4', title: 'Dubai Luxury', category: 'Luxury', duration: '4D/3N', image_url: '/images/tours/dubai.jpg' },
  { id: '5', title: 'Bali Adventure', category: 'Adventure', duration: '7D/6N', image_url: '/images/tours/bali.jpg' },
  { id: '6', title: 'Goa Beach Retreat', category: 'Beach', duration: '4D/3N', image_url: '/images/tours/goa.jpg' },
  { id: '7', title: 'Ladakh Expedition', category: 'Adventure', duration: '8D/7N', image_url: '/images/tours/ladakh.jpg' },
  { id: '8', title: 'Jaipur Royal Tour', category: 'Heritage', duration: '3D/2N', image_url: '/images/tours/jaipur.jpg' },
  { id: '9', title: 'Darjeeling Hills', category: 'Nature', duration: '5D/4N', image_url: '/images/tours/darjeeling.jpg' },
  { id: '10', title: 'Kanha Wildlife', category: 'Wildlife', duration: '3D/2N', image_url: '/images/tours/kanha.jpg' },
  { id: '11', title: 'Mysore Cultural', category: 'Heritage', duration: '2D/1N', image_url: '/images/tours/mysore.jpg' },
  { id: '12', title: 'Rishikesh Spiritual', category: 'Wellness', duration: '4D/3N', image_url: '/images/tours/rishikesh.jpg' },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('paryatan_tours')
        .select('*')
        .order('id', { ascending: true });
      if (error || !data || data.length === 0) {
        return res.status(200).json(SAMPLE_TOURS);
      }
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(200).json(SAMPLE_TOURS);
  }
}
