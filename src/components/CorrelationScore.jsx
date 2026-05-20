import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CorrelationScore({ result, explanation, headline }) {
  if (!result || !result.valid) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }} className="card p-8 mb-5 text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-[3px] rounded-b"
        style={{ background: 'linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent)' }} />

      <div className="font-mono text-[10px] uppercase tracking-[0.2em] mb-2" style={{ color: 'var(--text-muted)' }}>
        Pearson Correlation Coefficient
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={result.rPercent}
          initial={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="font-display font-black leading-none mb-1"
          style={{
            fontSize: 'clamp(3rem, 10vw, 5.5rem)',
            background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
          {result.rPercent}%
        </motion.div>
      </AnimatePresence>

      <motion.div key={result.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-display text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {result.label}
      </motion.div>

      <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
        <span className="font-medium" style={{ color: 'var(--accent)' }}>r = {result.r.toFixed(4)}</span>
        {' | '}r^2 = {result.r2Percent}%
        {' | '}{result.dataPoints} points
        {' | '}{result.direction} trend
      </div>

      {headline && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="font-display text-sm font-medium italic mb-3 max-w-xl mx-auto"
          style={{ color: 'var(--pink)' }}>
          "{headline}"
        </motion.div>
      )}

      {explanation && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          className="text-xs max-w-lg mx-auto leading-relaxed italic pt-3 mt-3"
          style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}>
          <span style={{ color: 'var(--text-secondary)' }}>Model note:</span> {explanation}
        </motion.div>
      )}

      <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-80 h-40 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'var(--accent-dim)' }} />
    </motion.div>
  );
}
