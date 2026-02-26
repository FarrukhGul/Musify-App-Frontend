export const getGradient = (title) => {
  const gradients = [
    'from-violet-200 to-purple-300',
    'from-emerald-200 to-teal-300',
    'from-rose-200 to-pink-300',
    'from-amber-200 to-orange-300',
    'from-cyan-200 to-blue-300',
    'from-fuchsia-200 to-purple-300',
    'from-lime-200 to-green-300',
    'from-red-200 to-rose-300',
    'from-sky-200 to-cyan-300',
    'from-purple-200 to-violet-300',
    'from-teal-200 to-emerald-300',
    'from-orange-200 to-red-300',
  ];
  
  const hash = (title || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
};

export const GradientCover = ({ title, className = "w-full aspect-square rounded-md mb-4" }) => (
  <div className={`bg-gradient-to-br ${getGradient(title)} ${className} flex items-center justify-center`}>
    <svg className="w-1/3 h-1/3 text-white opacity-80" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
    </svg>
  </div>
);