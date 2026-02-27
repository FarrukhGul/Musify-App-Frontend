import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMusic, FiHeart, FiGithub, FiInstagram, FiTwitter, FiLinkedin } from 'react-icons/fi';

const BAR_HEIGHTS = [8, 14, 10, 18, 12, 16, 9, 13, 17, 11, 15, 8, 14, 10, 18, 12];

const Footer = () => {
    const [tick, setTick] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => setTick(t => t + 1), 600);
        return () => clearInterval(interval);
    }, []);

    return (
        <footer className="bg-gradient-to-t from-[#0a0a12] to-[#0f0f1a] border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

                    {/* Brand */}
                    <div>
                        <div className="flex items-center space-x-3 mb-4 text-center">
                            {/* Animated bars */}
                            <div className="flex items-end space-x-0.5 h-6 ">
                                {BAR_HEIGHTS.slice(0, 5).map((h, i) => (
                                    <div
                                        key={i}
                                        className="w-0.5 bg-spotify-green rounded-full transition-all duration-500"
                                        style={{
                                            height: `${tick % 2 === 0 ? h : BAR_HEIGHTS[i + 5]}px`,
                                            transitionDelay: `${i * 80}ms`
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-xl text-center font-bold">
                                <span className="text-white">Musi</span>
                                <span className="text-spotify-green">fy</span>
                            </span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed text-center">
                            Stream your favorite music anytime, anywhere. Upload, share, and discover new tracks.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center space-x-3 mt-5">
                            {[
                                { Icon: FiGithub, href:'https://github.com/FarrukhGul' },
                                { Icon: FiInstagram, href : "https://www.instagram.com/cybercodeforge" },
                                { Icon: FiLinkedin,  href :"https://www.linkedin.com/in/muhammad-farrukh-gul-695126336" },
                            ].map(({ Icon, href }, i) => (
                                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                                    className="w-9 h-9 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-spotify-green hover:border-spotify-green/30 hover:bg-spotify-green/10 transition-all duration-300 hover:scale-110">
                                    <Icon size={15} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Navigate</h3>
                        <ul className="space-y-2.5">
                            {[
                                { label: 'Home', to: '/' },
                                { label: 'Music', to: '/music' },
                                { label: 'Albums', to: '/albums' },
                            ].map(({ label, to }) => (
                                <li key={label}>
                                    <Link to={to}
                                        className="text-gray-500 hover:text-spotify-green text-sm transition-all duration-200 flex items-center space-x-2 group">
                                        <span className="w-0 group-hover:w-3 h-0.5 bg-spotify-green rounded-full transition-all duration-300 overflow-hidden"></span>
                                        <span>{label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Now Playing Animation */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-widest">Vibe</h3>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-spotify-green to-emerald-600 rounded-lg flex items-center justify-center">
                                    <FiMusic size={16} className="text-black" />
                                </div>
                                <div>
                                    <p className="text-white text-xs font-medium">Always playing</p>
                                    <p className="text-gray-500 text-xs">Good music never stops</p>
                                </div>
                            </div>

                            {/* Animated equalizer */}
                            <div className="flex items-end space-x-0.5 h-8">
                                {BAR_HEIGHTS.map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 bg-gradient-to-t from-spotify-green to-emerald-400 rounded-full transition-all duration-500"
                                        style={{
                                            height: `${tick % 2 === 0 ? h : BAR_HEIGHTS[(i + 8) % 16]}px`,
                                            transitionDelay: `${i * 50}ms`,
                                            opacity: 0.7 + (i % 3) * 0.1
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-gray-600 text-xs">
                        © 2024 Musify. All rights reserved.
                    </p>
                    <p className="text-gray-600 text-xs flex items-center space-x-1">
                        <span>Made with</span>
                        <FiHeart size={11} className="text-red-500 animate-pulse" />
                        <span>by</span>
                        <span className="text-spotify-green font-semibold">Farrukh Gul</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;