import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Icon from './Icon';

const RoamingElement = ({ children, initialX = 0, initialY = 0, duration = 15, delay = 0, side = 'left' }) => {
  // Center is 50vw. The container is max-w-6xl (72rem). Half of container is 36rem.
  // Gutter positioning: 50vw - 36rem - (offset for icon size/padding)
  const positionClass = side === 'left' 
    ? 'left-[2%] 2xl:left-[calc(50vw-42rem)]' 
    : 'right-[2%] 2xl:right-[calc(50vw-42rem)]';

  return (
    <motion.div
      className={`fixed ${positionClass} top-1/2 -translate-y-1/2 pointer-events-none hidden xl:block z-0 opacity-50`}
      animate={{
        x: [initialX, initialX + 50, initialX - 30, initialX + 20, initialX],
        y: [initialY, initialY - 80, initialY + 60, initialY - 40, initialY],
        rotate: [0, 15, -15, 10, -5, 0],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
};

export default function SideDecorators({ categoryId }) {
  const { isDark } = useTheme();

  const getElements = (cat) => {
    switch (cat) {
      case 'google-searches': return [
        <div className={`w-40 h-8 ${isDark ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'} border rounded-full flex items-center px-3 gap-2 backdrop-blur-sm`}><div className="w-2 h-2 rounded-full bg-red-400" /><div className={`w-16 h-1.5 ${isDark ? 'bg-white/20' : 'bg-black/20'} rounded`} /></div>,
        <span className="text-7xl font-black text-blue-500/40">G</span>,
        <span className="text-6xl opacity-40 grayscale">🔍</span>,
        <span className="text-6xl opacity-40 grayscale">📱</span>,
        <span className={`text-6xl font-bold opacity-30 ${isDark ? 'text-white' : 'text-slate-800'}`}>.com</span>,
        <span className="text-6xl opacity-40 grayscale">🖱️</span>,
      ];
      case 'planets': return [
        <div className="w-32 h-32 rounded-full" style={{ background: 'radial-gradient(circle at 30% 30%, #fbbf24, #d97706)' }} />,
        <div className="relative w-28 h-28"><div className="absolute inset-0 rounded-full" style={{ background: '#818cf8' }} /><div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160%] h-[40%] rounded-[100%] border-[6px] ${isDark ? 'border-indigo-300/40' : 'border-indigo-600/40'} rotate-[20deg]`} /></div>,
        <span className="text-6xl opacity-40 grayscale">🌍</span>,
        <span className="text-6xl opacity-40 grayscale">☄️</span>,
        <span className="text-6xl opacity-40 grayscale">🚀</span>,
        <span className="text-5xl opacity-40 grayscale">🌟</span>,
      ];
      case 'stocks': return [
        <div className="flex items-end gap-1 h-24">{[40, 70, 50, 90, 60].map((h, i) => <div key={i} className="w-3 bg-emerald-500/40 rounded-t" style={{ height: `${h}%` }} />)}</div>,
        <svg width="100" height="60" viewBox="0 0 100 60" fill="none"><path d="M0 50 L20 30 L40 40 L60 10 L80 20 L100 0" stroke="#10b981" strokeWidth="4" strokeLinecap="round" className="opacity-40" /></svg>,
        <span className="text-6xl opacity-40 grayscale">📉</span>,
        <span className="text-6xl opacity-40 grayscale">💹</span>,
        <span className="text-6xl opacity-40 grayscale">💸</span>,
        <span className="text-6xl font-black text-green-500/30">$</span>,
      ];
      case 'memes': return [
        <span className="text-7xl opacity-50 grayscale">😂</span>,
        <span className="text-7xl opacity-50 grayscale">🤣</span>,
        <span className="text-6xl opacity-50 grayscale">🐸</span>,
        <span className="text-6xl opacity-50 grayscale">🤡</span>,
        <span className="text-6xl opacity-50 grayscale">💀</span>,
        <span className="text-6xl font-black text-yellow-500/40">LOL</span>,
      ];
      case 'weird': return [
        <span className="text-7xl font-black text-fuchsia-500/40">?</span>,
        <span className="text-6xl opacity-40 grayscale">👽</span>,
        <span className="text-6xl opacity-40 grayscale">👾</span>,
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`opacity-30 ${isDark ? 'text-fuchsia-400' : 'text-fuchsia-600'}`}><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" /><circle cx="12" cy="12" r="3" /></svg>,
        <span className="text-6xl opacity-40 grayscale">🌀</span>,
        <span className="text-6xl opacity-40 grayscale">🦄</span>,
      ];
      case 'crime': return [
        <div className="w-48 h-6 bg-yellow-400/30 rotate-[35deg] flex items-center justify-center"><span className="text-[8px] font-black tracking-widest text-yellow-600/50">CAUTION</span></div>,
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40"><circle cx="6" cy="12" r="4" /><circle cx="18" cy="12" r="4" /><path d="M10 12h4" /></svg>,
        <span className="text-6xl opacity-40 grayscale">🚨</span>,
        <span className="text-6xl opacity-40 grayscale">🩸</span>,
        <span className="text-6xl opacity-40 grayscale">🕵️</span>,
        <span className="text-6xl opacity-40 grayscale">🔒</span>,
      ];
      case 'death': return [
        <Icon name="skull" size={80} color="#64748b" className="opacity-30" />,
        <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-red-500/40" />,
        <span className="text-6xl opacity-40 grayscale">☠️</span>,
        <span className="text-6xl opacity-40 grayscale">🧟</span>,
        <div className="w-10 h-12 bg-red-500/30 rounded-t-full relative"><div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500/50 rounded-full animate-pulse" /></div>,
        <span className="text-6xl opacity-40 grayscale">🪦</span>,
      ];
      case 'baby-names': return [
        <div className="flex gap-1"><div className={`w-8 h-8 ${isDark ? 'bg-pink-400/30 text-pink-200' : 'bg-pink-500/30 text-pink-700'} flex items-center justify-center font-bold`}>A</div><div className={`w-8 h-8 ${isDark ? 'bg-blue-400/30 text-blue-200' : 'bg-blue-500/30 text-blue-700'} flex items-center justify-center font-bold`}>B</div></div>,
        <span className="text-6xl opacity-40 grayscale">🍼</span>,
        <span className="text-6xl opacity-40 grayscale">🧸</span>,
        <span className="text-6xl opacity-40 grayscale">👶</span>,
        <span className="text-6xl opacity-40 grayscale">🎈</span>,
        <span className={`text-6xl font-bold opacity-30 italic ${isDark ? 'text-white' : 'text-slate-800'}`}>John</span>,
      ];
      case 'elections': return [
        <svg width="60" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40"><path d="M4 20h16M7 20v-8h10v8M9 12V4h6v8" /></svg>,
        <svg width="50" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /><path d="M12 17v4M8 21h8" /></svg>,
        <span className="text-6xl opacity-40 grayscale">🗳️</span>,
        <span className="text-6xl opacity-40 grayscale">🇺🇸</span>,
        <span className="text-6xl opacity-40 grayscale">📢</span>,
        <span className="text-6xl font-black text-red-500/30">VOTE</span>,
      ];
      case 'youtube': return [
        <svg width="80" height="80" viewBox="0 0 24 24" fill="red" className="opacity-30"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.14 1 12 1 12s0 3.86.46 5.58a2.78 2.78 0 0 0 1.94 2C5.12 20 12 20 12 20s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.86 23 12 23 12s0-3.86-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" /></svg>,
        <div className={`w-32 h-20 ${isDark ? 'bg-white/10 border-white/20' : 'bg-black/5 border-black/10'} border rounded flex items-center justify-center`}><div className={`w-8 h-8 rounded-full ${isDark ? 'bg-white/20' : 'bg-black/20'}`} /></div>,
        <span className="text-6xl opacity-40 grayscale">▶️</span>,
        <span className="text-6xl opacity-40 grayscale">🔔</span>,
        <span className="text-6xl opacity-40 grayscale">📹</span>,
        <span className={`text-6xl font-bold opacity-30 ${isDark ? 'text-white' : 'text-slate-800'}`}>1M</span>,
      ];
      case 'occupations': return [
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40"><path d="M20 7h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11h20V9c0-1.1-.9-2-2-2zM9 4h6v3H9V4z" /></svg>,
        <Icon name="cpu" size={60} color="currentColor" className={`opacity-30 ${isDark ? 'text-blue-300' : 'text-blue-600'}`} />,
        <span className="text-6xl opacity-40 grayscale">🩺</span>,
        <span className="text-6xl opacity-40 grayscale">👷</span>,
        <span className="text-6xl opacity-40 grayscale">👨‍🏫</span>,
        <span className="text-6xl opacity-40 grayscale">🛠️</span>,
      ];
      case 'sports': return [
        <div className="w-16 h-16 rounded-full bg-orange-500/30 border border-orange-500/50 flex items-center justify-center"><div className="w-full h-[1px] bg-orange-500/50" /></div>,
        <svg width="50" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-40"><ellipse cx="12" cy="7" rx="6" ry="5" /><path d="M12 12v10" /></svg>,
        <span className="text-6xl opacity-40 grayscale">⚽</span>,
        <span className="text-6xl opacity-40 grayscale">🏈</span>,
        <span className="text-6xl opacity-40 grayscale">🎾</span>,
        <span className="text-6xl opacity-40 grayscale">🥇</span>,
      ];
      case 'weather': return [
        <Icon name="cloud" size={80} color="var(--blue)" className="opacity-30" />,
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`opacity-40 ${isDark ? 'text-sky-400' : 'text-sky-600'}`}><path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" /><path d="M12 12L2 12M12 12l10 0" /></svg>,
        <span className="text-6xl opacity-40 grayscale">⛈️</span>,
        <span className="text-6xl opacity-40 grayscale">☀️</span>,
        <span className="text-6xl opacity-40 grayscale">❄️</span>,
        <span className="text-6xl opacity-40 grayscale">☔</span>,
      ];
      case 'environment': return [
        <Icon name="leaf" size={80} color="var(--green)" className="opacity-30" />,
        <span className="text-6xl opacity-40 grayscale">🌻</span>,
        <span className="text-6xl opacity-40 grayscale">🦋</span>,
        <span className="text-6xl opacity-40 grayscale">🐦</span>,
        <span className="text-6xl opacity-40 grayscale">🌲</span>,
        <span className="text-6xl opacity-40 grayscale">🌿</span>,
      ];
      case 'energy': return [
        <Icon name="zap" size={90} color="var(--yellow)" className="opacity-40" />,
        <div className="w-1 h-24 bg-gradient-to-b from-transparent via-yellow-400/50 to-transparent" />,
        <span className="text-6xl opacity-40 grayscale">🔌</span>,
        <span className="text-6xl opacity-40 grayscale">🔋</span>,
        <span className="text-6xl opacity-40 grayscale">💡</span>,
        <span className="text-6xl opacity-40 grayscale">☢️</span>,
      ];
      case 'films': return [
        <Icon name="film" size={80} color="var(--purple)" className="opacity-30" />,
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`opacity-40 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}><path d="M2 3h20v18H2zM2 8h20M7 3v5M17 3v5" /></svg>,
        <span className="text-6xl opacity-40 grayscale">🍿</span>,
        <span className="text-6xl opacity-40 grayscale">🎥</span>,
        <span className="text-6xl opacity-40 grayscale">🎭</span>,
        <span className="text-6xl opacity-40 grayscale">🎬</span>,
      ];
      case 'food': return [
        <Icon name="utensils" size={80} color="var(--amber)" className="opacity-30" />,
        <div className="w-20 h-12 bg-amber-500/20 border-4 border-amber-500/30 rounded-t-full relative"><div className="absolute -bottom-2 left-0 right-0 h-2 bg-amber-500/30" /></div>,
        <span className="text-6xl opacity-40 grayscale">🍕</span>,
        <span className="text-6xl opacity-40 grayscale">🍔</span>,
        <span className="text-6xl opacity-40 grayscale">👨‍🍳</span>,
        <span className="text-6xl opacity-40 grayscale">🍩</span>,
      ];
      case 'education': return [
        <svg width="80" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`opacity-40 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}><path d="M22 10L12 5 2 10l10 5 10-5z" /><path d="M6 12v5c0 2 2.7 3.6 6 3.6s6-1.6 6-3.6v-5" /></svg>,
        <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={`opacity-40 ${isDark ? 'text-indigo-300' : 'text-indigo-500'}`}><circle cx="12" cy="12" r="3" /><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" /><path d="M12 3v18M3 12h18" /></svg>,
        <span className="text-6xl opacity-40 grayscale">📚</span>,
        <span className="text-6xl opacity-40 grayscale">✏️</span>,
        <span className="text-6xl opacity-40 grayscale">📏</span>,
        <span className="text-6xl opacity-40 grayscale">🧠</span>,
      ];
      default: return [
        <span className="text-6xl opacity-40 grayscale">🧀</span>,
        <span className="text-6xl opacity-40 grayscale">🧈</span>,
        <span className="text-6xl opacity-40 grayscale">🐝</span>,
        <span className="text-6xl opacity-40 grayscale">🏊</span>,
        <span className="text-6xl opacity-40 grayscale">📉</span>,
        <span className="text-6xl opacity-40 grayscale">🤷</span>,
      ];
    }
  };

  const elements = getElements(categoryId);

  const positions = [
    { side: 'left',  initialX: 10,  initialY: -220, duration: 25 },
    { side: 'left',  initialX: -20, initialY: -20,  duration: 18 },
    { side: 'left',  initialX: 30,  initialY: 180,  duration: 22 },
    { side: 'right', initialX: -10, initialY: -180, duration: 20 },
    { side: 'right', initialX: 20,  initialY: 30,   duration: 28 },
    { side: 'right', initialX: -30, initialY: 210,  duration: 24 },
  ];

  return (
    <>
      {elements.map((El, idx) => (
        <RoamingElement 
          key={idx} 
          side={positions[idx].side}
          initialX={positions[idx].initialX}
          initialY={positions[idx].initialY}
          duration={positions[idx].duration}
          delay={idx * 1.5}
        >
          {El}
        </RoamingElement>
      ))}
    </>
  );
}
