import { useState } from 'react';
import { Send, Phone, Mail, User, MessageSquare } from 'lucide-react';

const G = '#c9a84c';

export default function GetInTouchForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.error || 'Failed to submit');
      }
    } catch {
      setError('Network error');
    }
    setSubmitting(false);
  };

  const Input = ({ icon: Icon, ...props }) => (
    <div className="relative">
      <Icon className="w-4 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
      <input
        {...props}
        className="w-full pl-12 pr-4 py-3.5 rounded-xl font-mono text-sm"
        style={{ 
          background: 'rgba(255,255,255,0.05)', 
          border: '1px solid rgba(255,255,255,0.1)',
          color: '#e2e8f0'
        }}
        required
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input icon={User} type="text" placeholder="Your Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <Input icon={Phone} type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
      </div>
      
      <Input icon={Mail} type="email" placeholder="Email Address" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
      <Input icon={MessageSquare} type="text" placeholder="Subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
      
      <div className="relative">
        <MessageSquare className="w-4 h-5 absolute left-4 top-4" style={{ color: '#475569' }} />
        <textarea
          placeholder="Your Message"
          value={formData.message}
          onChange={e => setFormData({...formData, message: e.target.value})}
          rows={4}
          className="w-full pl-12 pr-4 pt-3.5 rounded-xl font-mono text-sm resize-none"
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#e2e8f0'
          }}
          required
        />
      </div>

      {error && <p className="text-sm" style={{ color: '#ef4444' }}>{error}</p>}
      {success && <p className="text-sm" style={{ color: '#4ade80' }}>Message sent successfully!</p>}

      <button type="submit" disabled={submitting} className="w-full md:w-auto px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
        style={{ 
          background: 'linear-gradient(135deg, #c9a84c, #f0c060)',
          color: '#050a14',
          opacity: submitting ? 0.7 : 1
        }}>
        <Send className="w-4 h-4" />
        {submitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}