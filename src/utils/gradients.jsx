import React from 'react';
import { FiMusic } from 'react-icons/fi';

const COLORS = [
  'from-purple-500 to-pink-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500',
  'from-yellow-500 to-orange-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-purple-500',
  'from-teal-500 to-green-500',
];

export const getGradient = (title) => {
  const index = title ? title.charCodeAt(0) % COLORS.length : 0;
  return COLORS[index];
};

export const GradientCover = ({ title }) => {
  const gradient = getGradient(title);
  return (
    <div className={`w-full aspect-square rounded-xl mb-3 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
      <FiMusic size={28} className="text-white opacity-80" />
    </div>
  );
};