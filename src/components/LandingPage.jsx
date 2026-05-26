import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

// Sphere diameter at each breakpoint (must match Tailwind classes)
const SPHERE_SIZES = { sm: 240, md: 380, lg: 480 };

function getVisualRadius() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
  if (w >= 1024) return SPHERE_SIZES.lg / 2;
  if (w >= 640) return SPHERE_SIZES.md / 2;
  return SPHERE_SIZES.sm / 2;
}

export default function LandingPage({ onExplore }) {
  const { isDark, toggle } = useTheme();
  const [separation, setSeparation] = useState(340);
  const [lightSource, setLightSource] = useState({ x: 30, y: 25 });
  const containerRef = useRef(null);

  useEffect(() => {
    let animId;
    let targetSep = 340;
    let curSep = 340;
    let targetLight = { x: 30, y: 25 };
    let curLight = { x: 30, y: 25 };

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = Math.sqrt((window.innerWidth / 2) ** 2 + (window.innerHeight / 2) ** 2);
      const ratio = Math.min(dist / (maxDist * 0.85), 1);

      // Enforce minimum gap so spheres NEVER overlap
      const radius = getVisualRadius();
      const minSep = radius * 2 + 60; // 60px guaranteed gap
      const maxSep = Math.max(minSep + 350, 700);
      targetSep = minSep + ratio * (maxSep - minSep);

      const lx = 30 + (dx / (window.innerWidth / 2)) * 20;
      const ly = 25 + (dy / (window.innerHeight / 2)) * 20;
      targetLight = { x: Math.max(8, Math.min(60, lx)), y: Math.max(8, Math.min(55, ly)) };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const update = () => {
      curSep += (targetSep - curSep) * 0.05;
      curLight.x += (targetLight.x - curLight.x) * 0.05;
      curLight.y += (targetLight.y - curLight.y) * 0.05;
      setSeparation(curSep);
      setLightSource({ x: curLight.x, y: curLight.y });
      animId = requestAnimationFrame(update);
    };
    animId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  const getMathWavePath = (width, height) => {
    const points = [];
    const segments = 90;
    const amplitude = Math.max(12, 40 - (width / 700) * 22);
    const frequency = 2.5 + (700 / width) * 2.5;
    for (let i = 0; i <= segments; i++) {
      const x = (i / segments) * width;
      const y = height / 2 + Math.sin((i / segments) * Math.PI * frequency) * amplitude;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  const scatterPoints = Array.from({ length: 11 }, (_, idx) => {
    const ratio = 0.1 + (idx * 0.8) / 10;
    return { ratio, offset: (idx % 3 - 1) * 7 };
  });

  // Dynamic shadow offsets (opposite of light)
  const sxL = -((lightSource.x - 30) * 0.5);
  const syL = -((lightSource.y - 25) * 0.5);
  const sxR = -(((100 - lightSource.x) - 30) * 0.5);
  const syR = -((lightSource.y - 25) * 0.5);

  // --- Iridescent bubble gradient builders ---
  const lx = lightSource.x;
  const ly = lightSource.y;

  const lightBubbleGradient = (flip = false) => {
    const cx = flip ? 100 - lx : lx;
    return [
      `radial-gradient(circle at ${cx}% ${ly}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.6) 6%, transparent 20%)`,
      `radial-gradient(circle at ${cx + 15}% ${ly + 25}%, rgba(255,255,255,0.5) 0%, transparent 15%)`,
      // Iridescent rainbow rim
      `conic-gradient(from ${flip ? 200 : 160}deg at 50% 50%, rgba(255,182,193,0.35), rgba(173,216,230,0.4), rgba(255,255,150,0.3), rgba(200,160,255,0.35), rgba(100,220,200,0.35), rgba(255,200,150,0.3), rgba(255,182,193,0.35))`,
      // Transparent glass core
      `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.05) 0%, rgba(240,248,255,0.15) 40%, rgba(200,220,255,0.2) 70%, rgba(180,200,240,0.35) 88%, rgba(160,180,220,0.5) 100%)`,
    ].join(', ');
  };

  const darkBubbleGradient = (flip = false) => {
    const cx = flip ? 100 - lx : lx;
    return [
      // Hot specular starburst
      `radial-gradient(circle at ${cx}% ${ly}%, rgba(255,255,255,0.9) 0%, rgba(200,230,255,0.4) 4%, transparent 14%)`,
      // Secondary reflection window (neon cyan)
      `radial-gradient(circle at ${cx + 20}% ${ly + 30}%, rgba(0,255,200,0.3) 0%, transparent 18%)`,
      // Third reflection window (neon blue)
      `radial-gradient(ellipse at ${100 - cx + 10}% ${100 - ly}%, rgba(60,120,255,0.25) 0%, transparent 22%)`,
      // Vivid iridescent rim
      `conic-gradient(from ${flip ? 180 : 140}deg at 50% 50%, rgba(255,50,50,0.3), rgba(255,140,0,0.25), rgba(255,255,0,0.2), rgba(0,255,100,0.3), rgba(0,200,255,0.35), rgba(100,50,255,0.3), rgba(255,0,150,0.3), rgba(255,50,50,0.3))`,
      // Deep dark translucent core
      `radial-gradient(circle at 50% 55%, rgba(0,0,0,0.85) 0%, rgba(5,10,20,0.9) 35%, rgba(15,25,50,0.7) 65%, rgba(30,40,70,0.4) 85%, transparent 100%)`,
    ].join(', ');
  };

  const lightBubbleShadow = '0 25px 60px rgba(180,200,240,0.25), inset 0 0 60px rgba(255,255,255,0.15), inset 0 -20px 40px rgba(200,180,255,0.08)';
  const darkBubbleShadow = '0 25px 80px rgba(80,120,255,0.2), 0 0 120px rgba(100,200,255,0.08), inset 0 0 50px rgba(255,255,255,0.03), inset 0 -15px 30px rgba(0,0,0,0.5)';

  const renderBubble = (flip = false) => (
    <div
      className="silver-ball w-60 h-60 sm:w-[380px] sm:h-[380px] lg:w-[480px] lg:h-[480px]"
      style={{
        background: isDark ? darkBubbleGradient(flip) : lightBubbleGradient(flip),
        boxShadow: isDark ? darkBubbleShadow : lightBubbleShadow,
        border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.5)',
      }}
    >
      {/* Glossy top-half glare arc */}
      <div className="sphere-glass-glare" />

      {/* Animated sweep reflection */}
      <div className="silver-ball-sweep" style={{ opacity: isDark ? 0.15 : 0.3 }} />

      {/* Primary specular pill highlight */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '28%', height: '14%',
          top: `${(flip ? ly + 2 : ly)}%`,
          left: `${(flip ? 100 - lx - 5 : lx - 5)}%`,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
          filter: 'blur(3px)',
          transform: `rotate(${flip ? -15 : -20}deg)`,
        }}
      />

      {/* Secondary smaller specular pill */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: '16%', height: '9%',
          top: `${(flip ? ly + 18 : ly + 20)}%`,
          left: `${(flip ? 100 - lx + 12 : lx + 15)}%`,
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, transparent 100%)',
          filter: 'blur(2px)',
          transform: `rotate(${flip ? 10 : 15}deg)`,
        }}
      />

      {/* Starburst pinpoint (dark mode only) */}
      {isDark && (
        <div
          className="specular-dot-sharp"
          style={{
            left: `${flip ? 100 - lx : lx}%`,
            top: `${ly}%`,
            transform: 'translate(-50%, -50%)',
            width: '6px', height: '6px',
            boxShadow: '0 0 12px 4px rgba(255,255,255,0.9), 0 0 30px 8px rgba(100,200,255,0.4)',
          }}
        />
      )}

      {/* Rainbow edge shimmer ring */}
      <div
        className="absolute inset-[2px] rounded-full pointer-events-none"
        style={{
          border: isDark
            ? '1.5px solid rgba(100,200,255,0.15)'
            : '1.5px solid rgba(255,200,230,0.3)',
          background: 'transparent',
        }}
      />
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-between items-center px-4 md:px-8 py-8 overflow-hidden z-10"
    >
      {/* Floating Mathematical Background Symbols */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <span className="math-float text-sm" style={{ left: '10%', top: '20%', '--float-x': '30px', '--float-y': '-60px', '--float-duration': '14s', '--float-opacity': 0.15, '--float-delay': '0s' }}>
          r = 0.982
        </span>
        <span className="math-float text-lg font-serif" style={{ left: '85%', top: '15%', '--float-x': '-40px', '--float-y': '-80px', '--float-duration': '16s', '--float-opacity': 0.1, '--float-delay': '1.5s' }}>
          &sigma; = &radic;[ &Sigma;(x-&mu;)&sup2; / N ]
        </span>
        <span className="math-float text-base" style={{ left: '80%', top: '75%', '--float-x': '-50px', '--float-y': '-70px', '--float-duration': '13s', '--float-opacity': 0.18, '--float-delay': '3s' }}>
          p &lt; 0.001
        </span>
        <span className="math-float text-xl font-bold" style={{ left: '15%', top: '80%', '--float-x': '40px', '--float-y': '-90px', '--float-duration': '15s', '--float-opacity': 0.12, '--float-delay': '0.5s' }}>
          &Sigma; x_i y_i
        </span>
        <span className="math-float text-sm italic" style={{ left: '45%', top: '10%', '--float-x': '15px', '--float-y': '-50px', '--float-duration': '12s', '--float-opacity': 0.15, '--float-delay': '4s' }}>
          f(x) = e^(-x&sup2;/2) / &radic;(2&pi;)
        </span>
        <span className="math-float text-lg" style={{ left: '90%', top: '40%', '--float-x': '-30px', '--float-y': '-75px', '--float-duration': '17s', '--float-opacity': 0.1, '--float-delay': '2s' }}>
          y = &beta;_0 + &beta;_1 x
        </span>
      </div>

      {/* Top header */}
      <div className="w-full max-w-6xl flex justify-between items-center z-20">
        <div className="flex items-center gap-3">
          <Logo size={44} />
          <span className="font-display font-black text-lg tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Do they <span style={{ color: 'var(--accent)' }}>Talk?</span>
          </span>
        </div>
        <button
          onClick={toggle}
          className="relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer"
          style={{ background: isDark ? 'var(--accent-dim)' : 'var(--accent)', border: '1px solid var(--border)' }}
          aria-label="Toggle theme"
        >
          <span
            className="absolute top-[3px] w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-[10px]"
            style={{
              left: isDark ? '4px' : 'calc(100% - 24px)',
              background: isDark ? '#1a1d2e' : '#fff',
              color: isDark ? '#a0a0b0' : '#f59e0b',
            }}
          >
            {isDark ? 'D' : 'L'}
          </span>
        </button>
      </div>

      {/* ============= VIEWPORT-DOMINATING IRIDESCENT SOAP BUBBLES ============= */}
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0 overflow-hidden">
        <div className="relative flex items-center justify-center w-full h-full">

          {/* Connecting wave */}
          <div
            className="absolute z-0 pointer-events-none flex items-center justify-center transition-all duration-75"
            style={{ width: `${separation}px`, height: '200px' }}
          >
            <svg width="100%" height="100%" viewBox={`0 0 ${separation} 200`} fill="none" className="absolute inset-0">
              <line x1="0" y1="100" x2={separation} y2="100"
                stroke={isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)'}
                strokeDasharray="4 4" strokeWidth="1.5" />
              <path d={getMathWavePath(separation, 200)} fill="none"
                stroke="url(#landingWaveGradient)" strokeWidth="3" strokeLinecap="round"
                className="filter drop-shadow-[0_0_12px_rgba(59,108,239,0.4)]" />
              {scatterPoints.map((pt, index) => {
                const px = pt.ratio * separation;
                const amplitude = Math.max(12, 40 - (separation / 700) * 22);
                const frequency = 2.5 + (700 / separation) * 2.5;
                const py = 100 + Math.sin(pt.ratio * Math.PI * frequency) * amplitude + pt.offset;
                return (
                  <circle key={index} cx={px} cy={py} r="3.5"
                    fill={isDark ? '#638cff' : '#3b6cef'}
                    className="opacity-60 animate-pulse"
                    style={{ animationDelay: `${index * 0.12}s` }} />
                );
              })}
              <defs>
                <linearGradient id="landingWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b6cef" />
                  <stop offset="35%" stopColor="#22d3ee" />
                  <stop offset="70%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* LEFT BUBBLE */}
          <div className="absolute transition-transform duration-75 select-none"
            style={{ transform: `translateX(-${separation / 2}px)` }}>
            {/* Ground shadow */}
            <div className="absolute rounded-full pointer-events-none transition-all duration-75"
              style={{
                width: '110%', height: '30%', bottom: '-18%', left: '-5%',
                background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(100,140,200,0.15)',
                filter: 'blur(30px)',
                transform: `translate(${sxL}px, ${syL}px) scaleY(0.5)`,
                zIndex: -1,
              }} />
            {renderBubble(false)}
          </div>

          {/* RIGHT BUBBLE */}
          <div className="absolute transition-transform duration-75 select-none"
            style={{ transform: `translateX(${separation / 2}px)` }}>
            {/* Ground shadow */}
            <div className="absolute rounded-full pointer-events-none transition-all duration-75"
              style={{
                width: '110%', height: '30%', bottom: '-18%', left: '-5%',
                background: isDark ? 'rgba(0,0,0,0.6)' : 'rgba(100,140,200,0.15)',
                filter: 'blur(30px)',
                transform: `translate(${sxR}px, ${syR}px) scaleY(0.5)`,
                zIndex: -1,
              }} />
            {renderBubble(true)}
          </div>

        </div>
      </div>

      {/* ============= HERO FOREGROUND CONTENT ============= */}
      <div className="flex flex-col items-center justify-center flex-1 max-w-3xl w-full text-center py-12 z-20 pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4.5 py-2 mb-6 rounded-full
            font-mono text-[10px] font-bold uppercase tracking-[0.25em] backdrop-blur-md"
          style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)', color: 'var(--accent)' }}
        >
          <span className="w-1.5 h-1.5 rounded-full live-badge" style={{ background: 'var(--accent)' }} />
          misleading data playground
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black leading-[0.95] tracking-tight mb-4 text-6xl md:text-[9.5rem] landing-title"
        >
          Do they Talk?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xs md:text-base max-w-lg mx-auto leading-relaxed font-light mb-10 px-4"
          style={{ color: 'var(--text-secondary)' }}
        >
          Where statistics meet high-end motion, and completely unrelated data streams align with suspicious perfection.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onClick={onExplore}
          className="explore-btn px-12 py-4.5 rounded-full font-display text-xs font-black tracking-widest uppercase cursor-pointer flex items-center gap-4 hover:scale-[1.03] active:scale-[0.98]"
          style={{ color: 'var(--text-primary)' }}
        >
          <span>Explore Topics</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.button>
      </div>

      {/* Bottom hint */}
      <div className="w-full text-center z-20 opacity-50">
        <p className="font-mono text-[9px] uppercase tracking-widest animate-pulse" style={{ color: 'var(--text-muted)' }}>
          Move cursor to shift light reflections across the bubbles
        </p>
      </div>
    </div>
  );
}
