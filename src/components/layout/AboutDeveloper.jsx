import React from 'react';
import { FiGithub, FiLinkedin, FiInstagram } from 'react-icons/fi';

const AboutDeveloper = () => {
  return (
    <div className="max-w-xl mx-auto py-10 px-4">

      {/* Card */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8">

        {/* Image + Name */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 text-center sm:text-left">
          <div className="relative flex-shrink-0">
            <img
              src="/farrukh.jpeg"
              alt="Muhammad Farrukh Gul"
              className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl object-cover border-2 border-spotify-green/40"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-br from-spotify-green to-emerald-600 hidden items-center justify-center text-black text-4xl font-bold">
              F
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-spotify-green rounded-full border-2 border-[#0f0f1a]" />
          </div>

          <div className="flex flex-col items-center sm:items-start">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Muhammad Farrukh Gul</h1>
            <p className="text-spotify-green text-sm font-medium mt-0.5">Mern Stack Developer</p>
            <span className="inline-block mt-2 px-3 py-0.5 bg-spotify-green/10 border border-spotify-green/20 text-spotify-green text-xs rounded-full">
              CS Student · 8th Semester
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-5" />

        {/* Bio */}
<div className="mb-6 space-y-3">
  <p className="text-gray-400 text-sm leading-relaxed">
    <span className="text-white font-medium">Bachelor of Computer Science</span> student at{' '}
    <span className="text-spotify-green font-medium">Minhaj University Lahore</span>, graduating in{' '}
    <span className="text-white font-medium">2026</span>. I build scalable, production-ready web
    applications using the <span className="text-white font-medium">MERN stack</span>.This music
    app is one of them.
  </p>
  <p className="text-gray-400 text-sm leading-relaxed">
    A <span className="text-white font-medium">self-learner</span> at heart,I love picking up new
    technologies, adapting quickly, and turning ideas into real products. I care deeply about{' '}
    <span className="text-white font-medium">clean code</span> and great user experiences.
    Currently seeking opportunities where I can contribute, grow, and ship things that matter. 🚀
  </p>
</div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['HTML5', 'Css', 'JavaScript', 'Tailwind CSS', 'Bootstrap', 'Github', 'C++', 'React', 'Node.js', 'MongoDB', 'Express.js'].map(skill => (
            <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 text-gray-300 text-xs rounded-lg hover:border-spotify-green/30 hover:text-spotify-green transition-colors cursor-default">
              {skill}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mb-5" />

        {/* Social Links */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href="https://github.com/FarrukhGul"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-white hover:border-white/20 transition-all text-sm font-medium"
          >
            <FiGithub size={16} />
            GitHub
          </a>
          <a
            href="https://www.instagram.com/cybercodeforge"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-[#E1306C] hover:border-[#E1306C]/30 transition-all text-sm font-medium"
          >
            <FiInstagram size={16} />
            Instagram
          </a>
          <a
            href="https://www.linkedin.com/in/muhammad-farrukh-gul-695126336"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-[#0A66C2] hover:border-[#0A66C2]/30 transition-all text-sm font-medium"
          >
            <FiLinkedin size={16} />
            LinkedIn
          </a>
        </div>

      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-600 mt-6">
        Built with ♥ for <span className="text-spotify-green">Musify</span> · 2026
      </p>
    </div>
  );
};

export default AboutDeveloper;