import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const IMAGE_API_KEY = process.env.IMAGE_API_KEY || process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { prompt, destination, size = '1024x1024', style = 'photorealistic' } = req.body || {};

    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    const keywords = (destination || prompt).toLowerCase();
    let stockUrl = 'https://images.unsplash.com/photo-1469854523485-47f8e6f1f2b4?w=1920';

    if (keywords.includes('dubai') || keywords.includes('uae')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?dubai,skyscrapers,arab`;
    } else if (keywords.includes('bali') || keywords.includes('indonesia')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?bali,temple,indonesia`;
    } else if (keywords.includes('agra') || keywords.includes('taj mahal')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?taj-mahal,india,monument`;
    } else if (keywords.includes('kashmir')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?kashmir,lake,mountains`;
    } else if (keywords.includes('kerala') || keywords.includes('backwater')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?kerala,houseboat,backwater`;
    } else if (keywords.includes('maldives')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?maldives,overwater,bungalow`;
    } else if (keywords.includes('thailand') || keywords.includes('bangkok')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?thailand,temple,buddha`;
    } else if (keywords.includes('singapore')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?singapore,marina,supertree`;
    } else if (keywords.includes('switzerland')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?switzerland,alps,mountain`;
    } else if (keywords.includes('new york') || keywords.includes('nyc')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?new-york,skyline,statue-liberty`;
    } else if (keywords.includes('paris') || keywords.includes('france')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?paris,eiffel,tower`;
    } else if (keywords.includes('london')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?london,big-ben,uk`;
    } else if (keywords.includes('tokyo') || keywords.includes('japan')) {
      stockUrl = `https://source.unsplash.com/1920x1080/?tokyo,japan,temple`;
    }

    if (IMAGE_API_KEY) {
      const response = await fetch('https://api.deepai.org/api/text2img', {
        method: 'POST',
        headers: {
          'Api-Key': IMAGE_API_KEY
        },
        body: new URLSearchParams({ text: `High-resolution photorealistic ${destination || prompt}` })
      });

      const data = await response.json();
      if (data.output_url) {
        return res.status(200).json({ imageUrl: data.output_url });
      }
    }

    return res.status(200).json({ imageUrl: stockUrl });
  } catch (err) {
    console.error('Image generation error:', err);
    res.status(500).json({ error: err.message });
  }
}