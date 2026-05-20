import React from 'react';
import { motion } from 'framer-motion';

export default function StatsRow({ result, datasetA, datasetB }) {
  if (!result || !result.valid) return null;
  const yearRange = `${result.years[0]} - ${result.years[result.years.length - 1]}`;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          { value: result.dataPoints, label: 'Data Points' },
          { value: yearRange, label: 'Time Range' },
          { value: result.direction === 'positive' ? 'Positive' : 'Negative', label: 'Direction' },
        ].map((s, i) => (
          <div key={i} className="card px-4 py-4 text-center hover:-translate-y-0.5 transition-transform">
            <div className="font-mono text-lg font-semibold" style={{ color: 'var(--accent)' }}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {[
          { ds: datasetA, label: 'Variable A', borderColor: 'var(--accent)' },
          { ds: datasetB, label: 'Variable B', borderColor: 'var(--accent2)' },
        ].map(({ ds, label, borderColor }) => (
          <div key={label} className="card px-5 py-4 hover:-translate-y-0.5 transition-transform"
            style={{ borderLeft: `3px solid ${borderColor}` }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {label}
            </div>
            <div className="font-display text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {ds?.name}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Source: {ds?.source}
              {ds?.isLive && (
                <span className="ml-2 inline-flex items-center gap-1" style={{ color: '#22c55e' }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                  Live
                </span>
              )}
            </div>
          </div>
        ))}
      </motion.div>
    </>
  );
}
