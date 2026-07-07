import supabase from './db-client.js';

const SAMPLE_TESTIMONIALS = [
  { id: 1, name: 'Priya Sharma', location: 'Mumbai', text: 'The Kashmir tour was seamlessly organized. Every detail was perfect.', rating: 5 },
  { id: 2, name: 'Rahul Verma', location: 'Delhi', text: 'Agra Heritage Tour exceeded expectations. Highly recommended!', rating: 5 },
  { id: 3, name: 'Sneha Iyer', location: 'Bangalore', text: 'Kerala backwaters experience was magical. Will book again.', rating: 4 },
];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(200).json(SAMPLE_TESTIMONIALS);
  }
}
