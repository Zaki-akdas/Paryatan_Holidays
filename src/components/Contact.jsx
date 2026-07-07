import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const G = '#c9a84c';
const CARD = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
const INPUT = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#e2e8f0',
  borderRadius: '12px',
  padding: '12px 16px',
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.2s',
};

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = e => {
    e.preventDefault();
    const num = '918982382828';
    const txt = `*New Inquiry*%0A%0A*Name:* ${form.name}%0A*Email:* ${form.email}%0A*Phone:* ${form.phone}%0A*Subject:* ${form.subject}%0A*Message:* ${form.message}`;
    window.open(`https://wa.me/${num}?text=${txt}`, '_blank');
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg,#050a14 0%,#060d1a 100%)' }}>

      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right,transparent,rgba(201,168,76,0.3),transparent)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-3" style={{ color: G }}>Reach Out</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily:'Cinzel,serif', color:'#f1f5f9' }}>Get in Touch</h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color:'#64748b' }}>
            Questions about our tours or need a custom itinerary? Our travel experts will respond via WhatsApp.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Info card */}
          <motion.div initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <div className="rounded-2xl p-8 h-full" style={CARD}>
              <h3 className="text-xl font-bold mb-8" style={{ fontFamily:'Cinzel,serif', color:'#f1f5f9' }}>Contact Info</h3>
              <div className="space-y-7">
                {[
                  { Icon:MapPin,  title:'Our Office', text:"Suresh Arcade, Vidyanagar, Infront of D'Mart, Hoshangabad Road, Bhopal (M.P.)" },
                  { Icon:Phone,   title:'Phone',      text:'+91-8982382828\n+91-9589408202' },
                  { Icon:Mail,    title:'Email',      text:'sales@paryatan.co.in' },
                ].map(({ Icon, title, text }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)' }}>
                      <Icon className="w-5 h-5" style={{ color:G }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm mb-1" style={{ color:'#f1f5f9' }}>{title}</p>
                      <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color:'#64748b' }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
            className="lg:col-span-2">
            <form onSubmit={submit} className="rounded-2xl p-8 md:p-10" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.15)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {[
                  { name:'name',    label:'Full Name',     type:'text',  ph:'John Doe' },
                  { name:'email',   label:'Email Address', type:'email', ph:'john@example.com' },
                  { name:'phone',   label:'Phone Number',  type:'tel',   ph:'+91 98765 43210' },
                  { name:'subject', label:'Subject',       type:'text',  ph:'e.g. Kerala Tour Inquiry' },
                ].map(({ name, label, type, ph }) => (
                  <div key={name}>
                    <label className="block text-sm font-semibold mb-2" style={{ color:'#94a3b8' }}>{label} *</label>
                    <input type={type} name={name} required value={form[name]} onChange={handle}
                      placeholder={ph} style={INPUT}
                      onFocus={e => (e.target.style.borderColor = G)}
                      onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
                  </div>
                ))}
              </div>
              <div className="mb-8">
                <label className="block text-sm font-semibold mb-2" style={{ color:'#94a3b8' }}>Your Message *</label>
                <textarea name="message" required rows={4} value={form.message} onChange={handle}
                  placeholder="Tell us about your travel plans…"
                  style={{ ...INPUT, resize:'none' }}
                  onFocus={e => (e.target.style.borderColor = G)}
                  onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
              </div>
              <button type="submit"
                className="px-8 py-4 font-bold rounded-xl flex items-center gap-2 transition-all"
                style={{ background:'linear-gradient(135deg,#c9a84c,#a07830)', color:'#050a14', boxShadow:'0 0 25px rgba(201,168,76,0.3)' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 45px rgba(201,168,76,0.55)')}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 0 25px rgba(201,168,76,0.3)')}>
                <MessageCircle className="w-5 h-5" /> Send via WhatsApp
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
