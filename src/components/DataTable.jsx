import React from 'react';
import { motion } from 'framer-motion';

export default function DataTable({ result, datasetA, datasetB }) {
  if (!result || !result.valid) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="card overflow-hidden mb-5">
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
        <h3 className="font-display text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Raw Data</h3>
        <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {result.dataPoints} rows
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {['Year', `${datasetA?.name} (${datasetA?.unit})`, `${datasetB?.name} (${datasetB?.unit})`].map((h, i) => (
                <th key={i} className="font-mono text-[10px] font-semibold uppercase tracking-wider px-5 py-3 text-left whitespace-nowrap"
                  style={{ color: i === 1 ? 'var(--accent)' : i === 2 ? 'var(--accent2)' : 'var(--text-muted)',
                    background: 'var(--bg-card)', borderBottom: '1px solid var(--border)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.years.map((year, i) => (
              <tr key={year} className="transition-colors" style={{ borderBottom: '1px solid var(--border)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <td className="font-mono text-sm px-5 py-2.5" style={{ color: 'var(--text-secondary)' }}>{year}</td>
                <td className="font-mono text-sm font-medium px-5 py-2.5" style={{ color: 'var(--accent)' }}>
                  {typeof result.valuesA[i] === 'number' ? result.valuesA[i].toLocaleString() : result.valuesA[i]}
                </td>
                <td className="font-mono text-sm font-medium px-5 py-2.5" style={{ color: 'var(--accent2)' }}>
                  {typeof result.valuesB[i] === 'number' ? result.valuesB[i].toLocaleString() : result.valuesB[i]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
