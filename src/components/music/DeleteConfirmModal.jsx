import React, { useState, useRef, useEffect } from 'react';
import { MdDelete } from 'react-icons/md';
import { FiX } from 'react-icons/fi';

const DeleteConfirmModal = ({ open, title, type = 'song', onConfirm, onCancel }) => {
  const [deleting, setDeleting] = useState(false);
  const timerRef = useRef(null);

  // ✅ Only cleanup on unmount — no setState here, linter happy
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleConfirm = () => {
    setDeleting(true);
    timerRef.current = setTimeout(() => {
      onConfirm();
    }, 900);
  };

  const handleCancel = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    onCancel();
  };

  // open prop drives visibility directly — no synced state needed
  if (!open) return null;

  const label = type === 'album' ? 'album' : 'song';

  return (
    <>
      <style>{`
        @keyframes backdropFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(48px) scale(0.90) rotateX(10deg); }
          to   { opacity: 1; transform: translateY(0) scale(1) rotateX(0deg); }
        }
        @keyframes iconPulse {
          0%,100% { transform: scale(1) rotate(0deg); box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50%     { transform: scale(1.1) rotate(-6deg); box-shadow: 0 0 0 14px rgba(239,68,68,0); }
        }
        @keyframes shredDown {
          0%   { transform: scaleY(1) translateY(0); opacity: 1; }
          30%  { transform: scaleY(1.04) translateY(3px); opacity: 1; }
          100% { transform: scaleY(0) translateY(80px); opacity: 0; }
        }
        @keyframes particleFly {
          0%   { transform: translate(0,0) rotate(0deg) scale(1); opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) rotate(var(--tr)) scale(0); opacity: 0; }
        }
        @keyframes rippleOut {
          from { transform: scale(0.5); opacity: 0.7; }
          to   { transform: scale(3.5); opacity: 0; }
        }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes btnShake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-5px); }
          40%     { transform: translateX(5px); }
          60%     { transform: translateX(-3px); }
          80%     { transform: translateX(3px); }
        }
        .dm-backdrop   { animation: backdropFadeIn 0.3s ease forwards; }
        .dm-modal      { animation: modalSlideUp 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .dm-icon-pulse { animation: iconPulse 1.8s ease infinite; }
        .dm-shred      { animation: shredDown 0.8s cubic-bezier(0.4,0,0.6,1) forwards; }
        .dm-ripple {
          position: absolute; inset: -4px;
          border-radius: 9999px;
          border: 2px solid rgba(239,68,68,0.7);
          animation: rippleOut 0.8s ease forwards;
        }
        .dm-particle {
          position: absolute;
          animation: particleFly 0.75s ease forwards;
        }
        .dm-progress { animation: progressFill 0.85s ease forwards; }
        .dm-delete-btn:active { animation: btnShake 0.3s ease; }
      `}</style>

      {/* Backdrop */}
      <div
        className="dm-backdrop fixed inset-0 z-[100] flex items-center justify-center px-4"
        style={{ background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(10px)' }}
        onClick={handleCancel}
      >
        {/* Modal — 3D perspective wrapper */}
        <div
          className="dm-modal relative w-full max-w-sm"
          style={{ perspective: '1200px' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Glass card */}
          <div
            className={`relative overflow-hidden rounded-3xl border border-white/10 ${deleting ? 'dm-shred' : ''}`}
            style={{
              background: 'linear-gradient(145deg, rgba(0,18,18,0.98) 0%, rgba(0,8,8,0.98) 100%)',
              boxShadow: '0 30px 70px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Top red accent line */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-56 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.9), transparent)' }}
            />
            {/* Noise texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.025]"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }}
            />

            <div className="relative p-8">
              {/* Close button */}
              {!deleting && (
                <button
                  onClick={handleCancel}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/12 flex items-center justify-center transition-all duration-200 hover:scale-110 text-gray-500 hover:text-white"
                >
                  <FiX size={15} />
                </button>
              )}

              {/* Icon area */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {deleting && <div className="dm-ripple" />}
                  {deleting && <div className="dm-ripple" style={{ animationDelay: '0.2s' }} />}

                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center ${!deleting ? 'dm-icon-pulse' : ''}`}
                    style={{
                      background: 'linear-gradient(135deg, rgba(239,68,68,0.18), rgba(185,28,28,0.28))',
                      border: '1px solid rgba(239,68,68,0.35)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
                    }}
                  >
                    <MdDelete size={38} className={`transition-all duration-300 ${deleting ? 'text-red-300' : 'text-red-400'}`} />
                  </div>

                  {/* Particles on deleting */}
                  {deleting && [
                    { tx: '-55px', ty: '-65px', tr: '-35deg', color: '#ef4444', s: '8px' },
                    { tx:  '55px', ty: '-55px', tr:  '28deg', color: '#f97316', s: '5px' },
                    { tx: '-65px', ty:  '18px', tr: '-50deg', color: '#ef4444', s: '6px' },
                    { tx:  '65px', ty:  '25px', tr:  '45deg', color: '#dc2626', s: '8px' },
                    { tx: '-22px', ty:  '75px', tr: '-25deg', color: '#f97316', s: '5px' },
                    { tx:  '32px', ty:  '70px', tr:  '38deg', color: '#ef4444', s: '7px' },
                    { tx: '-85px', ty: '-15px', tr: '-65deg', color: '#dc2626', s: '5px' },
                    { tx:  '85px', ty:  '-8px', tr:  '58deg', color: '#f97316', s: '8px' },
                    { tx:   '0px', ty: '-80px', tr:  '10deg', color: '#ef4444', s: '6px' },
                    { tx:  '40px', ty: '-75px', tr: '-20deg', color: '#dc2626', s: '5px' },
                  ].map((p, i) => (
                    <div
                      key={i}
                      className="dm-particle"
                      style={{
                        '--tx': p.tx, '--ty': p.ty, '--tr': p.tr,
                        background: p.color,
                        width: p.s, height: p.s,
                        top: '50%', left: '50%',
                        marginTop: `calc(-${p.s} / 2)`,
                        marginLeft: `calc(-${p.s} / 2)`,
                        animationDelay: `${i * 35}ms`,
                        borderRadius: i % 3 === 0 ? '50%' : '2px',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Text */}
              <div className="text-center mb-7">
                <h2 className="text-xl font-bold text-white mb-2 tracking-tight">
                  {deleting ? 'Deleting...' : `Delete this ${label}?`}
                </h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {deleting
                    ? <span className="text-gray-500">Removing <span className="text-gray-300">"{title}"</span> permanently...</span>
                    : <>
                        Are you sure you want to delete{' '}
                        <span className="text-white font-semibold">"{title}"</span>?{' '}
                        This action <span className="text-red-400">cannot be undone</span>.
                      </>
                  }
                </p>
              </div>

              {/* Buttons */}
              {!deleting && (
                <div className="flex gap-3">
                  <button
                    onClick={handleCancel}
                    className="flex-1 py-3 rounded-2xl text-sm font-semibold text-gray-300 hover:text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.09)',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="dm-delete-btn flex-1 py-3 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] relative overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, #b91c1c, #ef4444)',
                      boxShadow: '0 4px 24px rgba(220,38,38,0.45), inset 0 1px 0 rgba(255,255,255,0.1)',
                      border: '1px solid rgba(239,68,68,0.4)',
                    }}
                  >
                    <span className="relative z-10">Yes, Delete</span>
                  </button>
                </div>
              )}

              {/* Progress bar when deleting */}
              {deleting && (
                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-2">
                  <div
                    className="dm-progress h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #ef4444, #f97316)',
                      boxShadow: '0 0 10px rgba(239,68,68,0.8)',
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteConfirmModal;