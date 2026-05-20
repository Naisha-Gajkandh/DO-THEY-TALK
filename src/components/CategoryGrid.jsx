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
    <svg width="100" height="40" viewBox="0 0 98 40" className="opacity-40">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round" className="mini-graph-line" />
    </svg>
  );
}

const colorMap = {
  rose: { accent: '#f43f5e', bg: 'rgba(244,63,94,0.08)', border: 'rgba(244,63,94,0.25)' },
  violet: { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)' },
  amber: { accent: '#f59e0b', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
  cyan: { accent: '#06b6d4', bg: 'rgba(6,182,212,0.08)', border: 'rgba(6,182,212,0.25)' },
  emerald: { accent: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
  sky: { accent: '#0ea5e9', bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.25)' },
  pink: { accent: '#ec4899', bg: 'rgba(236,72,153,0.08)', border: 'rgba(236,72,153,0.25)' },
  red: { accent: '#ef4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
  green: { accent: '#22c55e', bg: 'rgba(34,197,94,0.08)', border: 'rgba(34,197,94,0.25)' },
  indigo: { accent: '#6366f1', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)' },
  purple: { accent: '#a855f7', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.25)' },
  slate: { accent: '#64748b', bg: 'rgba(100,116,139,0.08)', border: 'rgba(100,116,139,0.25)' },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.2 } },
};
const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export default function CategoryGrid({ onSelect }) {
  return (
    <section className="max-w-6xl mx-auto px-4 md:px-8 pb-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }} className="flex items-center gap-3 mb-6">
        <h2 className="font-display text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
          Explore Categories
        </h2>
        <span className="font-mono text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)' }}>
          {CATEGORIES.length} topics
        </span>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {CATEGORIES.map((cat, idx) => {
          const c = colorMap[cat.color] || colorMap.slate;
          const categoryNames = new Set([cat.name, ...(cat.dataCategories || [])]);
          const datasetCount = DATASET_REGISTRY.filter(dataset => categoryNames.has(dataset.category)).length;
          return (
            <motion.button key={cat.id} variants={item}
              whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(cat.id)}
              className="card relative text-left p-5 cursor-pointer overflow-hidden group">
              {/* Hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ background: `radial-gradient(circle at 50% 100%, ${c.bg}, transparent 70%)` }} />

              {/* Icon */}
              <div className="mb-3 relative z-10 w-9 h-9 flex items-center justify-center rounded-lg"
                style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                <Icon name={cat.icon} size={18} color={c.accent} />
              </div>

              {/* Name */}
              <div className="font-display text-sm font-bold mb-1 relative z-10" style={{ color: 'var(--text-primary)' }}>
                {cat.name}
              </div>

              {/* Tagline */}
              <div className="text-[11px] leading-snug mb-3 relative z-10" style={{ color: 'var(--text-muted)' }}>
                {cat.tagline}
              </div>

              {/* Mini graph */}
              <div className="relative z-10">
                <MiniGraph color={c.accent} seed={idx * 1.7} />
              </div>

              {/* Dataset count badge */}
              <div className="absolute top-4 right-4 text-[10px] font-mono font-medium px-2 py-0.5 rounded-full z-10"
                style={{ background: c.bg, color: c.accent, border: `1px solid ${c.border}` }}>
                {datasetCount}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
