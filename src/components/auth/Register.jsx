import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiShield } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const [barHeights] = useState(() => [...Array(20)].map(() => Math.random() * 30 + 10));

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) return setError('Passwords do not match');
    setLoading(true);
    const result = await register(formData);
    if (result.success) navigate('/login');
    else setError(result.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover"
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', minWidth: '100%', minHeight: '100%' }}>
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 mb-4 opacity-30 z-10">
          {barHeights.map((height, i) => (
            <div key={i} className="w-1 bg-spotify-green rounded-full animate-pulse"
              style={{ height: `${height}px`, animationDelay: `${i * 0.1}s`, animationDuration: '1s' }}></div>
          ))}
        </div>
      </div>

      <div className="relative z-20 w-full max-w-md py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-spotify-green rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-spotify-green/30">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Musi<span className="text-spotify-green">fy</span>
          </h1>
          <p className="text-gray-400 text-sm">Join the music community</p>
        </div>

        <div className="bg-spotify-dark/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiUser size={18} /></span>
                <input name="username" type="text" required value={formData.username} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition"
                  placeholder="johndoe" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiMail size={18} /></span>
                <input name="email" type="email" required value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition"
                  placeholder="you@example.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiLock size={18} /></span>
                <input name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Confirm Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><FiShield size={18} /></span>
                <input name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-spotify-green transition"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition">
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">I want to</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setFormData({ ...formData, role: 'user' })}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${formData.role === 'user' ? 'bg-spotify-green/20 border-spotify-green text-spotify-green' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                  🎧 Listen
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, role: 'artist' })}
                  className={`py-3 px-4 rounded-xl border text-sm font-medium transition-all duration-200 ${formData.role === 'artist' ? 'bg-spotify-green/20 border-spotify-green text-spotify-green' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'}`}>
                  🎤 Upload
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 px-4 bg-spotify-green text-black font-semibold rounded-xl hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-spotify-green/20 mt-2">
              {loading ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  <span>Creating account...</span>
                </span>
              ) : 'Create account'}
            </button>

            <div className="text-center">
              <Link to="/login" className="text-sm text-spotify-green hover:text-emerald-400 transition">
                Already have an account? Sign in
              </Link>
            </div>
          </form>
        </div>

        <div className="text-center mt-6 text-gray-500 text-sm">
          <span>created by </span>
          <span className="text-spotify-green font-semibold">Farrukh Gul</span>
          <span className="mx-2 opacity-30">•</span>
          <span>© 2024</span>
        </div>
      </div>
    </div>
  );
};

export default Register;