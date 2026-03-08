import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const random = (min, max) => Math.random() * (max - min) + min;
const NOTES = ['♪', '♫', '♩', '♬', '𝄞', '♭', '♮', '♯'];

const funnyMessages = [
  "Bhai yeh page toh gaya... 💀",
  "Isko bhi delete kar diya kisi ne 🗑️",
  "DJ ne yeh track skip kar diya ⏭️",
  "Headphones mein kuch atak gaya 🎧",
  "Yaar chhod yahan kuch nahi 😭",
  "Spotify pe search karo shayad mile 🔍",
  "Error bhi sunna chahta tha music 🎵",
  "Bhai itna click kyun kar raha hai 😂",
];

const EQ_BARS  = [18, 32, 14, 40, 22, 36, 16, 28, 38, 12, 30, 24, 20, 34, 10, 26];
const EQ_BARS2 = [28, 14, 38, 20, 34, 16, 40, 22, 12, 36, 18, 30, 26, 10, 32, 24];

const NotFound = () => {
  const [notes, setNotes]           = useState([]);
  const [eqTick, setEqTick]         = useState(0);
  const [shake, setShake]           = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [msgIdx, setMsgIdx]         = useState(0);
  const [showMsg, setShowMsg]       = useState(false);
  const [glitch, setGlitch]         = useState(false);
  const eqRef    = useRef(null);
  const noiseRef = useRef(null);

  useEffect(() => {
    setNotes(Array.from({ length: 18 }, (_, i) => ({
      id: i,
      char:  NOTES[Math.floor(random(0, NOTES.length))],
      left:  `${random(2, 96)}%`,
      dur:   `${random(7, 15)}s`,
      delay: `${random(0, 9)}s`,
      size:  `${random(14, 34)}px`,
      op:    random(0.12, 0.4),
      green: Math.random() > 0.5,
    })));

    eqRef.current    = setInterval(() => setEqTick(t => t + 1), 420);
    noiseRef.current = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 110);
    }, 3800);

    return () => {
      clearInterval(eqRef.current);
      clearInterval(noiseRef.current);
    };
  }, []);

  const handleClick = () => {
    setShake(true);
    setClickCount(c => c + 1);
    setMsgIdx(p => (p + 1) % funnyMessages.length);
    setShowMsg(true);
    setTimeout(() => setShake(false), 560);
  };

  return (
    <div className="min-h-screen bg-[#080810] flex flex-col text-white overflow-x-hidden">

      {/* ── Background layers ── */}
      {/* Grid */}
      <div className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(30,215,96,0.04) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(30,215,96,0.04) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Center glow */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle,rgba(30,215,96,0.07) 0%,rgba(99,102,241,0.04) 45%,transparent 70%)',
            animation: 'glowBreathe 4s ease-in-out infinite',
          }}
        />
      </div>
      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none z-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)',
        }}
      />
      {/* Static noise */}
      {glitch && (
        <div className="fixed inset-0 pointer-events-none z-20 opacity-25 mix-blend-screen"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E\")",
          }}
        />
      )}

      {/* Floating notes */}
      {notes.map(n => (
        <div key={n.id}
          className="fixed pointer-events-none select-none z-[1]"
          style={{
            left: n.left,
            bottom: '-5%',
            fontSize: n.size,
            opacity: n.op,
            color: n.green ? '#1ed760' : '#a78bfa',
            animation: `floatUp ${n.dur} ${n.delay} linear infinite`,
          }}
        >
          {n.char}
        </div>
      ))}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

        @keyframes floatUp {
          0%   { transform: translateY(0) rotate(0deg);      opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(-110vh) rotate(360deg); opacity: 0; }
        }
        @keyframes glowBreathe {
          0%,100% { transform: scale(1);    opacity: 0.7; }
          50%     { transform: scale(1.18); opacity: 1;   }
        }
        @keyframes glitchBase {
          0%,89%,100% { transform: translate(0); }
          90% { transform: translate(-3px, 1px); }
          92% { transform: translate(3px, -1px); }
          94% { transform: translate(-2px, 2px); }
          96% { transform: translate(2px, -2px); }
        }
        @keyframes glitchR {
          0%,87%,100% { transform: translate(0); }
          88% { transform: translate(-5px, 0); }
          91% { transform: translate(5px, 0);  }
          94% { transform: translate(-3px, 0); }
        }
        @keyframes glitchB {
          0%,87%,100% { transform: translate(0); }
          89% { transform: translate(5px, 0);  }
          92% { transform: translate(-5px, 0); }
          95% { transform: translate(3px, 0);  }
        }
        @keyframes headBob {
          0%,100% { transform: translateY(0)   rotate(-4deg); }
          50%     { transform: translateY(-10px) rotate(4deg); }
        }
        @keyframes headShake {
          0%,100% { transform: rotate(0); }
          15% { transform: translateX(-10px) rotate(-10deg); }
          30% { transform: translateX(10px)  rotate(10deg); }
          50% { transform: translateX(-7px)  rotate(-6deg); }
          70% { transform: translateX(7px)   rotate(6deg); }
          85% { transform: translateX(-3px)  rotate(-2deg); }
        }
        @keyframes msgPop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.06); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes reelSpin     { to { transform: rotate(360deg); } }
        @keyframes reelSpinSlow { to { transform: rotate(360deg); } }
        @keyframes crtFlicker {
          0%,96%,100% { opacity: 1; }
          97% { opacity: 0.65; }
          98% { opacity: 1; }
          99% { opacity: 0.4; }
        }

        .glitch-404 {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(88px, 20vw, 200px);
          color: #1ed760;
          line-height: 1;
          position: relative;
          display: inline-block;
          text-shadow: 0 0 50px rgba(30,215,96,0.35);
          animation: glitchBase 3.5s infinite;
        }
        .glitch-404::before {
          content: attr(data-t);
          position: absolute; inset: 0;
          color: #ff0055;
          clip-path: polygon(0 0,100% 0,100% 38%,0 38%);
          animation: glitchR 3.5s infinite;
        }
        .glitch-404::after {
          content: attr(data-t);
          position: absolute; inset: 0;
          color: #00d4ff;
          clip-path: polygon(0 62%,100% 62%,100% 100%,0 100%);
          animation: glitchB 3.5s infinite;
        }
        .head-bob   { animation: headBob   2.6s ease-in-out infinite; }
        .head-shake { animation: headShake 0.55s ease !important; }
        .msg-pop    { animation: msgPop    0.3s ease forwards; }
        .reel       { animation: reelSpin     2s   linear infinite; }
        .reel-slow  { animation: reelSpinSlow 4.5s linear infinite; }
        .crt        { animation: crtFlicker   9s   infinite; }
      `}</style>

      {/* ── Main content ── */}
      <main className="relative z-30 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg flex flex-col items-center text-center gap-4">

          {/* Top label */}
          <p className="crt font-mono text-[10px] sm:text-xs tracking-[0.28em] text-white/25 uppercase">
            [ ERROR_404 ] // TRACK_NOT_FOUND
          </p>

          {/* 404 */}
          <span className="glitch-404" data-t="404">404</span>

          {/* Headphone */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={handleClick}
              className={`text-[68px] sm:text-[86px] bg-transparent border-none cursor-pointer leading-none select-none transition-none ${shake ? 'head-shake' : 'head-bob'}`}
              style={{ filter: 'drop-shadow(0 0 18px rgba(30,215,96,0.35))' }}
            >
              🎧
            </button>
            <p className="text-[10px] text-white/20 tracking-widest font-mono">
              ( click kar daikho )
            </p>
          </div>

          {/* Funny message */}
          <div className="h-6 flex items-center justify-center">
            {showMsg && (
              <p key={msgIdx} className="msg-pop text-[#1ed760] text-xs sm:text-sm font-mono tracking-wide">
                {funnyMessages[msgIdx]}
              </p>
            )}
          </div>

          {/* Description */}
          <p className="text-white/50 text-sm sm:text-base italic leading-relaxed max-w-xs sm:max-w-sm font-mono">
            Yeh page toh tha hi nahi kabhi...<br />
            Ya tha, aur kisi ne{' '}
            <span className="text-red-400 not-italic font-bold">delete</span>{' '}
            kar diya. 💔
          </p>

          {/* Equalizer */}
          <div className="flex items-end justify-center gap-[3px] h-10 mt-1">
            {EQ_BARS.map((h, i) => (
              <div key={i}
                className="rounded-t-sm"
                style={{
                  width: '5px',
                  height: `${eqTick % 2 === 0 ? h : EQ_BARS2[i]}px`,
                  transition: `height 0.35s cubic-bezier(.4,0,.2,1) ${i * 22}ms`,
                  background:
                    i % 3 === 0 ? 'linear-gradient(to top,#1ed760,#22d3ee)'
                    : i % 3 === 1 ? 'linear-gradient(to top,#1db954,#1ed760)'
                    : 'linear-gradient(to top,#a78bfa,#1ed760)',
                  opacity: 0.75,
                }}
              />
            ))}
          </div>

          {/* Cassette */}
          <div className="flex items-center justify-center opacity-50">
            <div className="flex items-center justify-around gap-3 border border-white/10 rounded-lg px-4 py-2 bg-white/[0.02] w-32 h-11">
              <svg width="24" height="24" viewBox="0 0 28 28" className="reel flex-shrink-0">
                <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                <circle cx="14" cy="14" r="5"  fill="none" stroke="#1ed760" strokeWidth="2"/>
                <line x1="14" y1="2"  x2="14" y2="8"  stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                <line x1="14" y1="20" x2="14" y2="26" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                <line x1="2"  y1="14" x2="8"  y2="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                <line x1="20" y1="14" x2="26" y2="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              </svg>
              <span className="text-[7px] text-white/20 font-mono leading-tight">SIDE_B<br/>MISSING</span>
              <svg width="24" height="24" viewBox="0 0 28 28" className="reel-slow flex-shrink-0">
                <circle cx="14" cy="14" r="12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2"/>
                <circle cx="14" cy="14" r="5"  fill="none" stroke="#a78bfa" strokeWidth="2"/>
                <line x1="14" y1="2"  x2="14" y2="8"  stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                <line x1="14" y1="20" x2="14" y2="26" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                <line x1="2"  y1="14" x2="8"  y2="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
                <line x1="20" y1="14" x2="26" y2="14" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/"
            className="mt-2 inline-flex items-center gap-2 px-8 py-3 rounded-full font-mono font-bold text-sm tracking-widest text-black transition-all duration-300 hover:-translate-y-1 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg,#1ed760,#1db954)',
              boxShadow: '0 0 28px rgba(30,215,96,0.4), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            ▶ WAPAS GHAR JAO
          </Link>

          {/* Easter egg */}
          {clickCount >= 5 && (
            <p className="text-[11px] font-mono text-[#1ed760]/40">
              {clickCount} baar click kiya... seriously bhai? 😂
            </p>
          )}

          {/* Bottom label */}
          <p className="text-[9px] font-mono tracking-[0.25em] text-white/15 uppercase mt-4">
            MUSIFY_SYS // v2.0 // PAGE_LOST_IN_SPACE
          </p>
        </div>
      </main>


    </div>
  );
};

export default NotFound;