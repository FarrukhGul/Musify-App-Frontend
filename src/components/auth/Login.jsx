import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👈 Password show/hide state
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Stable bar heights
  const [barHeights] = useState(() => 
    [...Array(20)].map(() => Math.random() * 30 + 10)
  );

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* FULL SCREEN BACKGROUND - 100% COVER */}
      <div className="fixed inset-0 w-full h-full overflow-hidden">
        {/* Video Background - Perfect full screen */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
          }}
        >
          <source src="/videos/background.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay - Ensures text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80"></div>
        
        {/* Animated Music Bars */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-1 mb-4 opacity-30 z-10">
          {barHeights.map((height, i) => (
            <div
              key={i}
              className="w-1 bg-spotify-green rounded-full animate-pulse"
              style={{
                height: `${height}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '1s'
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content - Centered on top of video */}
      <div className="relative z-20 w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          {/* Spotify-style Icon */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-spotify-green rounded-full flex items-center justify-center animate-pulse shadow-lg shadow-spotify-green/30">
                <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6">
                <span className="absolute w-2 h-2 bg-spotify-green rounded-full animate-ping"></span>
                <span className="absolute w-2 h-2 bg-spotify-green rounded-full animate-ping" style={{ animationDelay: '0.3s', left: '10px' }}></span>
                <span className="absolute w-2 h-2 bg-spotify-green rounded-full animate-ping" style={{ animationDelay: '0.6s', left: '20px' }}></span>
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Musi<span className="text-spotify-green">fy</span>
          </h1>
          <p className="text-spotify-gray text-sm drop-shadow">
            Listen to millions of songs for free
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-spotify-dark/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-center mb-6">Sign in to your account</h2>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              {/* Email Field with Icon */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-spotify-gray mb-2">
                  Email address
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-gray">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-spotify-light/50 border border-transparent rounded-lg text-white placeholder-spotify-gray focus:outline-none focus:ring-2 focus:ring-spotify-green backdrop-blur-sm"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              
              {/* Password Field with Icon and Show/Hide Toggle */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-spotify-gray mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-gray">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-12 py-3 bg-spotify-light/50 border border-transparent rounded-lg text-white placeholder-spotify-gray focus:outline-none focus:ring-2 focus:ring-spotify-green backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                  {/* Show/Hide Password Toggle Button */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spotify-gray hover:text-white focus:outline-none"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-spotify-green text-white rounded-lg font-semibold hover:bg-spotify-green/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spotify-green disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign in'}
            </button>

            <div className="text-center">
              <Link to="/register" className="text-sm text-spotify-green hover:underline hover:text-spotify-green/80 transition">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>

        {/* Created by Farrukh Gul - Footer */}
        <div className="text-center mt-6 text-spotify-gray text-sm">
          <span className="opacity-70">created by </span>
          <span className="text-spotify-green font-semibold">Farrukh Gul</span>
          <span className="mx-2 opacity-30">•</span>
          <span className="opacity-70">© 2024</span>
        </div>
      </div>
    </div>
  );
};

export default Login;