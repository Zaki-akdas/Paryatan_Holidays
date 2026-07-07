import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, MessageSquare, Search, RefreshCw, Shield, LogIn, LogOut, Lock } from 'lucide-react';

const G = '#c9a84c';
const BG = '#050a14';

const ADMIN_PASSWORD = 'paryatan2024';

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  // Require password every visit - no persistence
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadData();
    }
    const iv = setInterval(() => { if (authenticated) loadData(); }, 30000);
    return () => clearInterval(iv);
  }, [authenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (e) {
      console.error('Load error:', e);
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt with password:', password, 'expected:', ADMIN_PASSWORD);
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError(false);
      localStorage.setItem('adminAuth', 'true');
      console.log('Login successful');
    } else {
      setLoginError(true);
      console.log('Login failed');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setPassword('');
    localStorage.removeItem('adminAuth');
  };

  const filteredInquiries = inquiries.filter(i => 
    !searchTerm ||
    i.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    i.message?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md mx-auto px-4">
          <div className="rounded-3xl p-10" style={{ 
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
            border: '1px solid rgba(201,168,76,0.3)',
            boxShadow: '0 25px 50px -12px rgba(201,168,76,0.25)'
          }}>
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, #c9a84c, #f0c060)',
                boxShadow: '0 0 30px rgba(201,168,76,0.5)'
              }}>
                <Shield className="w-8 h-8" style={{ color: BG }} />
              </div>
              <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cinzel,serif', color: '#f1f5f9' }}>Admin Login</h1>
              <p className="text-sm mt-2" style={{ color: '#64748b' }}>Secure access required</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase mb-2" style={{ color: G }}>Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setLoginError(false); }}
                    placeholder="Enter admin password"
                    className="w-full pl-12 pr-4 py-3.5 rounded-xl font-mono text-sm"
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: `1px solid ${loginError ? '#ef4444' : 'rgba(255,255,255,0.15)'}`,
                      color: '#e2e8f0'
                    }}
                    autoFocus
                  />
                </div>
                {loginError && <p className="text-xs mt-2" style={{ color: '#ef4444' }}>Invalid password</p>}
              </div>
              
              <button type="submit" className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
                style={{ 
                  background: 'linear-gradient(135deg, #c9a84c, #f0c060)', 
                  color: BG,
                  boxShadow: '0 0 20px rgba(201,168,76,0.3)'
                }}>
                <LogIn className="w-5 h-5" /> Access Dashboard
              </button>
            </form>
            
            <a href="/" className="flex items-center justify-center gap-2 mt-6 text-xs" style={{ color: '#64748b' }}>
              <ChevronLeft className="w-4 h-4" /> Back to Website
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12" style={{ background: BG }}>
      <div className="pt-24 md:pt-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ 
                background: 'linear-gradient(135deg, #c9a84c, #f0c060)',
                boxShadow: '0 0 20px rgba(201,168,76,0.3)'
              }}>
                <Shield className="w-6 h-6" style={{ color: BG }} />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: 'Cinzel,serif', color: '#f1f5f9' }}>
                Admin Dashboard
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button onClick={handleLogout} className="px-4 py-2 rounded-xl font-medium text-sm flex items-center gap-2"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                <LogOut className="w-4 h-4" /> Logout
              </button>
              <a href="/" className="flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-mono" 
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8' }}>
                Site
              </a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <div className="px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2"
              style={{ 
                background: 'linear-gradient(135deg,#c9a84c,#f0c060)',
                color: BG,
                border: '1px solid rgba(201,168,76,0.2)'
              }}>
              <MessageSquare className="w-4 h-4" /> Inquiries ({inquiries.length})
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
              <input 
                value={searchTerm} 
                onChange={e => setSearchTerm(e.target.value)} 
                placeholder="Search..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-sm font-mono" 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  color: '#e2e8f0',
                  outline: 'none'
                }} 
              />
            </div>
            <button onClick={loadData} disabled={loading} className="px-4 py-2.5 rounded-xl flex items-center gap-2 font-mono text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: G }}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-2xl overflow-hidden" style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.08)' 
            }}>
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-mono uppercase" style={{ background: 'rgba(255,255,255,0.04)', color: '#64748b' }}>
                    <th className="px-6 py-4 font-medium">Name</th>
                    <th className="px-6 py-4 font-medium">Contact</th>
                    <th className="px-6 py-4 font-medium">Subject</th>
                    <th className="px-6 py-4 font-medium">Message</th>
                    <th className="px-6 py-4 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInquiries.map((i) => (
                    <tr key={i.id} className="border-t transition-colors" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                      <td className="px-6 py-4 font-medium" style={{ color: '#f1f5f9' }}>{i.name}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#94a3b8' }}>{i.phone || i.email || '-'}</td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#94a3b8' }}>{i.subject}</td>
                      <td className="px-6 py-4 max-w-sm truncate text-sm" style={{ color: '#64748b' }} title={i.message}>
                        {i.message}
                      </td>
                      <td className="px-6 py-4 text-xs font-mono" style={{ color: '#475569' }}>
                        {i.created_at ? new Date(i.created_at).toLocaleDateString('en-IN') : '-'}
                      </td>
                    </tr>
                  ))}
                  {filteredInquiries.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center" style={{ color: '#475569' }}>
                        No inquiries found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}