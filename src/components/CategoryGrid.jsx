import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import CATEGORIES from '../data/categories';
import DATASET_REGISTRY from '../data/registry';
import Icon from './Icon';

const colorMap = {
  rose: { accent: '#f43f5e', bg: 'rgba(244,63,94,0.10)', border: 'rgba(244,63,94,0.28)', glow: 'rgba(244,63,94,0.28)' },
  violet: { accent: '#8b5cf6', bg: 'rgba(139,92,246,0.10)', border: 'rgba(139,92,246,0.26)', glow: 'rgba(139,92,246,0.25)' },
  amber: { accent: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.28)', glow: 'rgba(245,158,11,0.26)' },
  cyan: { accent: '#06b6d4', bg: 'rgba(6,182,212,0.10)', border: 'rgba(6,182,212,0.27)', glow: 'rgba(6,182,212,0.26)' },
  emerald: { accent: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.26)', glow: 'rgba(16,185,129,0.24)' },
  sky: { accent: '#0ea5e9', bg: 'rgba(14,165,233,0.10)', border: 'rgba(14,165,233,0.26)', glow: 'rgba(14,165,233,0.24)' },
  pink: { accent: '#ec4899', bg: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.26)', glow: 'rgba(236,72,153,0.24)' },
  orange: { accent: '#fb923c', bg: 'rgba(251,146,60,0.10)', border: 'rgba(251,146,60,0.28)', glow: 'rgba(251,146,60,0.26)' },
  indigo: { accent: '#6366f1', bg: 'rgba(99,102,241,0.10)', border: 'rgba(99,102,241,0.26)', glow: 'rgba(99,102,241,0.22)' },
  purple: { accent: '#a855f7', bg: 'rgba(168,85,247,0.10)', border: 'rgba(168,85,247,0.26)', glow: 'rgba(168,85,247,0.24)' },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

function MiniGraph({ color, seed = 0 }) {
  const points = Array.from({ length: 10 }, (_, i) => {
    const y = 26 + Math.sin(i * 1.15 + seed) * 13 + Math.cos(i * 0.61 + seed * 1.7) * 7;
    return `${i * 12},${Math.max(4, Math.min(48, y))}`;
  }).join(' ');

  return (
    <svg width="130" height="54" viewBox="0 0 108 54" className="mini-graph" aria-hidden="true">
      <defs>
        <linearGradient id={`miniGrad-${seed}`} x1="0" x2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={`url(#miniGrad-${seed})`}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mini-graph-line"
      />
      {points.split(' ').slice(1, 9, 2).map((point, index) => {
        const [x, y] = point.split(',');
        return <circle key={point} cx={x} cy={y} r={index === 2 ? 2.4 : 1.7} fill={color} opacity="0.85" />;
      })}
    </svg>
  );
}

function TopicVisual({ visual, color }) {
  return (
    <div className={`topic-visual topic-visual--${visual}`} style={{ '--topic-color': color }}>
      <div className="topic-visual__grid" />
      <div className="topic-visual__core" />
      <div className="topic-visual__trace topic-visual__trace--a" />
      <div className="topic-visual__trace topic-visual__trace--b" />
    </div>
  );
}

function getDatasetCount(category) {
  if (category.includeAll) return DATASET_REGISTRY.length;
  const categoryNames = new Set([category.name, ...(category.dataCategories || [])]);
  return DATASET_REGISTRY.filter(dataset => categoryNames.has(dataset.category)).length;
}

function getMasonrySpan(index) {
  if (index === 0) return 'lg:col-span-2 lg:row-span-2 min-h-[390px]';
  if (index === 4) return 'lg:col-span-2 min-h-[250px]';
  if (index === 9) return 'lg:col-span-2 min-h-[250px]';
  return 'min-h-[300px]';
}

export default function CategoryGrid({ onSelect }) {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pb-14">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.42 }}
        className="dashboard-section-heading"
      >
        <div>
          <span className="eyebrow">Correlation Atlas</span>
          <h2 className="font-display font-black text-2xl md:text-3xl tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Choose a signal field
          </h2>
        </div>
        <span className="confidence-badge">
          {CATEGORIES.length} topic systems
        </span>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-5 md:gap-6 grid-flow-row-dense"
      >
        {CATEGORIES.map((category, index) => {
          const palette = colorMap[category.color] || colorMap.cyan;
          const datasetCount = getDatasetCount(category);
          const correlationStrength = 87 + ((index * 7) % 12);
          const confidence = 78 + ((index * 11) % 18);

          return (
            <motion.button
              key={category.id}
              variants={item}
              whileHover={{ y: -8, scale: 1.015, rotateX: 1.5, rotateY: -1.5 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => onSelect(category.id)}
              className={`${getMasonrySpan(index)} premium-topic-card text-left p-5 md:p-6 cursor-pointer group`}
              style={{
                '--topic-color': palette.accent,
                '--topic-bg': palette.bg,
                '--topic-border': palette.border,
                '--topic-glow': palette.glow,
              }}
            >
              <div className="topic-card__shine" />
              <TopicVisual visual={category.visual} color={palette.accent} />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div
                  className="topic-icon"
                  style={{ background: palette.bg, borderColor: palette.border }}
                >
                  <Icon name={category.icon} size={21} color={palette.accent} />
                </div>
                <div className="topic-count">
                  {datasetCount} streams
                </div>
              </div>

              <div className="relative z-10 mt-auto pt-8">
                <h3 className="font-display font-black tracking-tight leading-tight text-xl md:text-2xl mb-2" style={{ color: 'var(--text-primary)' }}>
                  {category.name}
                </h3>
                <p className="text-xs md:text-sm leading-relaxed max-w-sm" style={{ color: 'var(--text-secondary)' }}>
                  {category.description}
                </p>
              </div>

              <div className="relative z-10 mt-6 flex items-end justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="topic-pill">{confidence}% confidence</span>
                    <span className="topic-pill">{correlationStrength}% strength</span>
                  </div>
                  <MiniGraph color={palette.accent} seed={index + 1} />
                </div>
                <span className="topic-launch">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </section>
  );
}
