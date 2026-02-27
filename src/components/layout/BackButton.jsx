import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="md:hidden flex items-center space-x-2 text-gray-400 hover:text-white transition-all duration-200 mb-6 group"
    >
      <div className="w-8 h-8 bg-white/5 border border-white/10 rounded-full flex items-center justify-center group-hover:bg-white/10 group-hover:border-spotify-green/30 transition-all duration-200">
        <FiArrowLeft size={16} className="group-hover:text-spotify-green transition-colors" />
      </div>
      <span className="text-sm font-medium">Back</span>
    </button>
  );
};

export default BackButton;