import React from 'react';
import { motion } from 'framer-motion';

export default function StatsRow({ result, datasetA, datasetB }) {
  if (!result || !result.valid) return null;
  const yearRange = `${result.years[0]} - ${result.years[result.years.length - 1]}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5"
      >
        {[
          { value: result.dataPoints, label: 'Data Points' },
          { value: yearRange, label: 'Time Range' },
          { value: result.direction === 'positive' ? 'Positive' : 'Negative', label: 'Direction' },
        ].map(stat => (
          <div key={stat.label} className="metric-tile">
            <div className="font-mono text-lg font-semibold" style={{ color: 'var(--accent)' }}>{stat.value}</div>
            <div className="text-[10px] uppercase tracking-widest mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.12 }}
        className="grid grid-cols-1 gap-3"
      >
        {[
          { dataset: datasetA, label: 'Variable A', color: 'var(--accent)' },
          { dataset: datasetB, label: 'Variable B', color: 'var(--accent2)' },
        ].map(({ dataset, label, color }) => (
          <div key={label} className="dataset-tile" style={{ '--tile-color': color }}>
            <div className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {label}
            </div>
            <div className="font-display text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
              {dataset?.name}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Source: {dataset?.source}
              {dataset?.isLive && (
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
