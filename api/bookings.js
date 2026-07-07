import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { tourId, tourTitle, adults, children, packageTier, total, name, phone, email, message, videoSource } = req.body || {};

    if (!tourTitle || !total) {
      return res.status(400).json({ error: 'Tour details are required' });
    }

    const { data, error } = await supabase.from('paryatan_bookings').insert({
      tour_id: tourId || null,
      tour_title: tourTitle,
      adults: adults || 1,
      children: children || 0,
      package_tier: packageTier || 'standard',
      total_amount: total,
      customer_name: name || null,
      customer_phone: phone || null,
      customer_email: email || null,
      custom_message: message || null,
      video_source: videoSource || null,
      status: 'pending',
      created_at: new Date().toISOString()
    }).select();

    if (error) throw error;

    return res.status(200).json({ success: true, booking: data[0] });
  } catch (err) {
    console.error('Booking save error:', err);
    res.status(500).json({ error: err.message || 'Failed to save booking' });
  }
}