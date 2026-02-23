import { useState } from 'react';
import { useApp } from '../store';
import { Shield, Monitor, Wrench, Users, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(email, password)) {
      setError('Invalid email or password');
    }
  };

  const quickLogin = (em: string, pw: string) => {
    setEmail(em);
    setPassword(pw);
    if (!login(em, pw)) setError('Login failed');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
            <Shield className="w-8 h-8 text-blue-300" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SchoolCare NZ</h1>
          <p className="text-blue-200/70 text-sm">IT Support & Property Maintenance Portal</p>
          <p className="text-blue-300/50 text-xs mt-1">MOE Compliant Property Management</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/10 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setError(''); }}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                placeholder="your@school.nz"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200/40 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition pr-12"
                  placeholder="••••••••"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/50 hover:text-blue-100 transition">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            {error && <p className="text-red-300 text-sm bg-red-500/10 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" className="w-full py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-xl transition shadow-lg shadow-blue-500/30 active:scale-[0.98]">
              Sign In
            </button>
          </form>
        </div>

        <div className="mt-6 bg-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
          <p className="text-blue-200/60 text-xs text-center mb-3 font-medium uppercase tracking-wider">Quick Demo Login</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => quickLogin('admin@school.nz', 'admin123')} className="flex items-center gap-2 px-3 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-xl text-xs font-medium transition border border-amber-400/20">
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
            <button onClick={() => quickLogin('sarah@school.nz', 'tech123')} className="flex items-center gap-2 px-3 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl text-xs font-medium transition border border-blue-400/20">
              <Monitor className="w-3.5 h-3.5" /> IT Tech
            </button>
            <button onClick={() => quickLogin('mike@school.nz', 'prop123')} className="flex items-center gap-2 px-3 py-2.5 bg-green-500/20 hover:bg-green-500/30 text-green-200 rounded-xl text-xs font-medium transition border border-green-400/20">
              <Wrench className="w-3.5 h-3.5" /> Property Mgr
            </button>
            <button onClick={() => quickLogin('jane@school.nz', 'staff123')} className="flex items-center gap-2 px-3 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 rounded-xl text-xs font-medium transition border border-purple-400/20">
              <Users className="w-3.5 h-3.5" /> Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
