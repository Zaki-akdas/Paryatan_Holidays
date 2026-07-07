import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Activity, Sparkles, CheckCircle2, ChevronRight, PlayCircle, MapPin, Link as LinkIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const G = '#c9a84c';

export default function VideoPlanner() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const handleAnalyze = async e => {
    e.preventDefault();
    if (!url.trim()) return;
    setStatus('analyzing');
    setProgress(0);
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 90) { clearInterval(iv); return 90; } return p + 10; });
    }, 100);
    try {
      const res = await fetch(`/api/video-analyze?url=${encodeURIComponent(url)}`);
      const data = await res.json();
      setProgress(100);
      setStatus('complete');
      sessionStorage.setItem('videoItinerary', JSON.stringify(data));
      setTimeout(() => setResult(data), 300);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  const viewItinerary = () => {
    sessionStorage.setItem('videoGenerated', JSON.stringify(result));
    if (result?.matched?.id) {
      navigate(`/tour/${result.matched.id}`);
    } else {
      navigate('/generated-itinerary');
    }
  };

  const reset = () => { setStatus('idle'); setUrl(''); setProgress(0); setResult(null); };

  return (
    <section className="py-28 relative overflow-hidden" style={{ background:'linear-gradient(180deg,#060d1a 0%,#050a14 100%)' }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background:'radial-gradient(ellipse at 50% 50%, rgba(201,168,76,0.05) 0%, transparent 65%)' }} />
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage:'linear-gradient(rgba(201,168,76,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,0.06) 1px,transparent 1px)', backgroundSize:'50px 50px', maskImage:'radial-gradient(ellipse 70% 60% at 50% 50%,#000 60%,transparent 100%)' }} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-mono mb-6"
            style={{ background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.25)', color:G }}>
            <Sparkles className="w-4 h-4" /> AI Video-to-Itinerary Engine
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily:'Cinzel,serif', color:'#f1f5f9' }}>
            See it. Paste it.{' '}
            <span style={{ background:'linear-gradient(135deg,#f0c060,#c9a84c)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              Travel it.
            </span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color:'#64748b' }}>
            Paste any YouTube tour video link - our AI analyzes the content and generates a custom Paryatan Holiday itinerary.
          </p>
        </div>

        <motion.div initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
          className="rounded-2xl overflow-hidden" style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(201,168,76,0.2)', boxShadow:'0 0 60px rgba(201,168,76,0.07)' }}>
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background:'rgba(255,255,255,0.03)', borderBottom:'1px solid rgba(201,168,76,0.15)' }}>
            <div className="flex items-center gap-3">
              <div className="flex gap-2">{['#ef4444','#f59e0b','#22c55e'].map(c => (<div key={c} className="w-3 h-3 rounded-full" style={{ background:c, opacity:0.7 }} />))}</div>
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color:'#475569' }}>A.I. Vision Core v2.0</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background:'rgba(201,168,76,0.08)', border:'1px solid rgba(201,168,76,0.2)' }}>
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background:G }} />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ background:G }} />
              </span>
              <span className="text-xs font-mono uppercase tracking-wider" style={{ color:G }}>Neural Link Active</span>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.form key="idle" initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:20 }}
                  onSubmit={handleAnalyze} className="max-w-3xl mx-auto">
                  <div className="flex items-center rounded-2xl p-2 gap-3"
                    style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(201,168,76,0.25)' }}>
                    <Youtube className="w-6 h-6 shrink-0 ml-2 text-red-500" />
                    <input type="url" required value={url} onChange={e => setUrl(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..." className="flex-1 bg-transparent text-sm font-mono focus:outline-none"
                      style={{ color:'#e2e8f0' }} />
                    <button type="submit" className="px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shrink-0"
                      style={{ background:'linear-gradient(135deg,#c9a84c,#a07830)', color:'#050a14', boxShadow:'0 0 20px rgba(201,168,76,0.25)' }}>
                      Analyse <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-8 text-sm font-mono" style={{ color:'#475569' }}>
                    <span className="flex items-center gap-2"><PlayCircle className="w-4 h-4" style={{ color:G }} /> Any YouTube Link</span>
                    <span className="flex items-center gap-2"><Activity className="w-4 h-4" style={{ color:G }} /> AI Research</span>
                  </div>
                </motion.form>
              )}

              {status === 'analyzing' && (
                <motion.div key="analyzing" initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }}
                  className="max-w-2xl mx-auto text-center">
                  <div className="relative w-24 h-24 mx-auto mb-8">
                    <div className="absolute inset-0 rounded-full" style={{ border:`3px solid rgba(201,168,76,0.15)` }} />
                    <div className="absolute inset-0 rounded-full animate-spin" style={{ border:`3px solid ${G}`, borderTopColor:'transparent' }} />
                    <Activity className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ color:G }} />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 font-mono" style={{ color:'#f1f5f9' }}>AI Research in Progress…</h3>
                  <p className="text-sm font-mono mb-8" style={{ color:G }}>Analyzing video content & researching best itinerary</p>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.08)' }}>
                    <motion.div className="h-full rounded-full" style={{ width:`${progress}%`, background:`linear-gradient(90deg,#a07830,${G})` }} />
                  </div>
                  <p className="text-right text-xs font-mono mt-2" style={{ color:'#475569' }}>{progress}%</p>
                </motion.div>
              )}

              {status === 'complete' && (
                <motion.div key="complete" initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="max-w-4xl mx-auto">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden relative group" style={{ border:'1px solid rgba(201,168,76,0.25)' }}>
                      <img src={result?.matched?.image_url || "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800"}
                        alt={result?.matched?.title || "Destination"} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background:'rgba(201,168,76,0.9)', boxShadow:`0 0 25px ${G}` }}>
                          <CheckCircle2 className="w-6 h-6 text-[#050a14]" />
                        </div>
                      </div>
                    </div>
                    <div className="w-full md:w-2/3">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono mb-4"
                        style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.25)', color:'#4ade80' }}>
                        <CheckCircle2 className="w-3 h-3" /> Analysis Complete
                      </div>
                      <h3 className="text-2xl font-bold mb-4" style={{ fontFamily:'Cinzel,serif', color:'#f1f5f9' }}>
                        {result?.detected ? `Detected: ${result.detected}` : 'No destination detected'}
                      </h3>
                      {result?.videoTitle && (<p className="text-xs mb-4" style={{ color:'#64748b' }}>From: "{result.videoTitle}"</p>)}
                      <div className="space-y-3 mb-6">
                        {result?.matched && (
                          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                            <Sparkles className="w-5 h-5 shrink-0" style={{ color:G }} />
                            <span className="text-sm" style={{ color:'#94a3b8' }}>Match: Paryatan {result.matched.title} ({result.matched.duration})</span>
                          </div>
                        )}
                        {!result?.matched && result?.message && (
                          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)' }}>
                            <MapPin className="w-5 h-5 shrink-0" style={{ color:G }} />
                            <span className="text-sm" style={{ color:'#94a3b8' }}>{result.message}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4">
                        {(result?.matched || result?.videoTitle) && (
                          <button onClick={viewItinerary} className="px-6 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
                            style={{ background:'linear-gradient(135deg,#c9a84c,#a07830)', color:'#050a14', boxShadow:'0 0 20px rgba(201,168,76,0.3)' }}>
                            <LinkIcon className="w-4 h-4" /> View AI Itinerary
                          </button>
                        )}
                        {result?.allAvailableTours && !result?.matched && (
                          <span className="text-xs font-mono" style={{ color:'#64748b' }}>Showing available tours - select one:</span>
                        )}
                        {result?.allAvailableTours?.slice(0, 6).map(t => (
                          <Link key={t.id} to={`/tour/${t.id}`} className="px-4 py-2 rounded-lg font-medium text-xs transition-all"
                            style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8' }}>
                            {t.title}
                          </Link>
                        ))}
                        <button onClick={reset} className="px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                          style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', color:'#94a3b8' }}>
                          Analyse Another
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}