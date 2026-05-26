import React from 'react';
import { motion } from 'framer-motion';
import CATEGORIES from '../data/categories';
import DATASET_REGISTRY from '../data/registry';
import Icon from './Icon';

function MiniGraph({ color, seed = 0 }) {
  const pts = Array.from({ length: 8 }, (_, i) => {
    const y = 20 + Math.sin(i * 1.2 + seed) * 12 + Math.cos(i * 0.7 + seed * 2) * 8;
    return `${i * 14},${y}`;
  }).join(' ');
  return (
    <svg width="100" height="40" viewBox="0 0 98 40" className="opacity-40 filter drop-shadow-[0_0_8px_var(--glow)]">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="mini-graph-line" />
    </svg>
  );
}

const colorMap = {
  rose: { accent: '#f43f5e', bg: 'rgba(244,63,94,0.06)', border: 'rgba(244,63,94,0.2)', glow: 'rgba(244,63,94,0.15)' },
  violet: { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.06)', border: 'rgba(139,92,246,0.2)', glow: 'rgba(139,92,246,0.15)' },
  amber: { accent: '#f59e0b', bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', glow: 'rgba(245,158,11,0.15)' },
  cyan: { accent: '#06b6d4', bg: 'rgba(6,182,212,0.06)', border: 'rgba(6,182,212,0.2)', glow: 'rgba(6,182,212,0.15)' },
  emerald: { accent: '#10b981', bg: 'rgba(16,185,129,0.06)', border: 'rgba(16,185,129,0.2)', glow: 'rgba(16,185,129,0.15)' },
  sky: { accent: '#0ea5e9', bg: 'rgba(14,165,233,0.06)', border: 'rgba(14,165,233,0.2)', glow: 'rgba(14,165,233,0.15)' },
  pink: { accent: '#ec4899', bg: 'rgba(236,72,153,0.06)', border: 'rgba(236,72,153,0.2)', glow: 'rgba(236,72,153,0.15)' },
  red: { accent: '#ef4444', bg: 'rgba(239,68,68,0.06)', border: 'rgba(239,68,68,0.2)', glow: 'rgba(239,68,68,0.15)' },
  green: { accent: '#22c55e', bg: 'rgba(34,197,94,0.06)', border: 'rgba(34,197,94,0.2)', glow: 'rgba(34,197,94,0.15)' },
  indigo: { accent: '#6366f1', bg: 'rgba(99,102,241,0.06)', border: 'rgba(99,102,241,0.2)', glow: 'rgba(99,102,241,0.15)' },
  purple: { accent: '#a855f7', bg: 'rgba(168,85,247,0.06)', border: 'rgba(168,85,247,0.2)', glow: 'rgba(168,85,247,0.15)' },
  slate: { accent: '#64748b', bg: 'rgba(100,116,139,0.06)', border: 'rgba(100,116,139,0.2)', glow: 'rgba(100,116,139,0.15)' },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
};

// Helper for beautiful editorial masonry flow
const getMasonrySpan = (idx) => {
  if (idx === 0) return 'col-span-2 row-span-2 md:col-span-2 md:row-span-2 min-h-[220px]'; // Spurious Classics
  if (idx === 3) return 'col-span-1 row-span-2 min-h-[220px]'; // Tall stocks block
  if (idx === 7) return 'col-span-2 row-span-1 md:col-span-2 min-h-[120px]'; // Wide death block
  if (idx === 10) return 'col-span-1 row-span-2 min-h-[220px]'; // Tall elections block
  if (idx === 14) return 'col-span-2 row-span-1 md:col-span-2 min-h-[120px]'; // Wide environment block
  return 'col-span-1 row-span-1 min-h-[140px]';
};

export default function CategoryGrid({ onSelect }) {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 pb-12">
      {/* Category header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }} className="flex items-center gap-3 mb-8">
        <div className="w-1 h-6 bg-accent rounded-full" />
        <h2 className="font-display text-lg font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
          Explore Topics
        </h2>
        <span className="font-mono text-[9px] uppercase tracking-widest px-3 py-1 rounded-full bg-accent-dim text-accent border border-accent-glow">
          {CATEGORIES.length} data domains
        </span>
      </motion.div>

      {/* Asymmetric dense grid flow */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 grid-flow-row-dense"
      >
        {CATEGORIES.map((cat, idx) => {
          const c = colorMap[cat.color] || colorMap.slate;
          const categoryNames = new Set([cat.name, ...(cat.dataCategories || [])]);
          const datasetCount = DATASET_REGISTRY.filter(dataset => categoryNames.has(dataset.category)).length;
          
          const isFeatured = idx === 0 || idx === 3 || idx === 7 || idx === 10 || idx === 14;
          const spanClass = getMasonrySpan(idx);

          return (
            <motion.button
              key={cat.id}
              variants={item}
              whileHover={{ y: -5, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelect(cat.id)}
              className={`${spanClass} card relative text-left p-6 cursor-pointer overflow-hidden group flex flex-col justify-between`}
              style={{
                '--glow': c.accent,
                borderColor: 'var(--border)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              {/* Premium Glossy Glass glare curve overlay inside card */}
              <div className="absolute inset-[1px] rounded-[15px] bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity" />
              
              {/* Radial background hover neon glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 100%, ${c.glow}, transparent 70%)`,
                }}
              />

              {/* Glowing decorative border trail */}
              <div className="absolute inset-0 border border-transparent group-hover:border-accent/20 transition-all duration-300 rounded-2xl pointer-events-none" />

              {/* Upper row: icon & count */}
              <div className="flex items-center justify-between relative z-10 w-full mb-3">
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  style={{
                    background: c.bg,
                    border: `1px solid ${c.border}`,
                    boxShadow: `0 0 15px ${c.bg}`,
                  }}
                >
                  <Icon name={cat.icon} size={20} color={c.accent} />
                </div>
                
                {/* Count badge */}
                <div
                  className="text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    background: c.bg,
                    color: c.accent,
                    border: `1px solid ${c.border}`,
                  }}
                >
                  {datasetCount} streams
                </div>
              </div>

              {/* Middle row: content (expanded dynamically for featured items) */}
              <div className="relative z-10 flex-1 flex flex-col justify-center">
                <h3
                  className={`font-display font-black tracking-tight leading-tight mb-1 group-hover:text-accent transition-colors ${
                    isFeatured ? 'text-base md:text-lg' : 'text-sm'
                  }`}
                  style={{ color: 'var(--text-primary)' }}
                >
                  {cat.name}
                </h3>
                
                <p className="text-[10px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  {cat.description || cat.tagline}
                </p>
              </div>

              {/* Lower row: mini-graph */}
              <div className="relative z-10 w-full flex items-end justify-between">
                <div className="shrink-0">
                  <MiniGraph color={c.accent} seed={idx * 1.7} />
                </div>
                
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[9px] font-mono font-bold text-accent">
                  <span>Explore</span>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
