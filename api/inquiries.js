// Google Sheets via webhook or fallback to memory store
// Production: Set VITE_GOOGLE_SHEETS_WEBHOOK in .env.local

const GOOGLE_SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_WEBHOOK;

let inquiriesStore = [];

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();

  if (req.method === 'POST') {
    const { name, email, phone, subject, message } = req.body || {};
    if (!name || !message) return res.status(400).json({ error: 'Name and message required' });
    
    const inquiry = { id: Date.now(), name, email, phone, subject, message, status: 'new', created_at: new Date().toISOString() };

    if (GOOGLE_SHEETS_WEBHOOK) {
      try {
        await fetch(GOOGLE_SHEETS_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inquiry)
        });
      } catch (e) {
        console.error('Google Sheets error:', e);
      }
    }
    
    inquiriesStore = [inquiry, ...inquiriesStore];
    return res.status(200).json({ success: true });
  }

  // GET - return all inquiries
  res.status(200).json({ inquiries: inquiriesStore });
}