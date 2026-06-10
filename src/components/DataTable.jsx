import React from 'react';
import { motion } from 'framer-motion';

export default function DataTable({ result, datasetA, datasetB }) {
  if (!result || !result.valid) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.16 }}
      className="data-table-shell"
    >
      <div className="data-table-meta">
        <span>Raw aligned annual values</span>
        <strong>{result.dataPoints} rows</strong>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {['Year', `${datasetA?.name} (${datasetA?.unit})`, `${datasetB?.name} (${datasetB?.unit})`].map((heading, index) => (
                <th
                  key={heading}
                  className="font-mono text-[10px] font-semibold uppercase tracking-wider px-5 py-3 text-left whitespace-nowrap"
                  style={{
                    color: index === 1 ? 'var(--accent)' : index === 2 ? 'var(--accent2)' : 'var(--text-muted)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.years.map((year, index) => (
              <tr key={year} className="data-row">
                <td className="font-mono text-sm px-5 py-2.5" style={{ color: 'var(--text-secondary)' }}>{year}</td>
                <td className="font-mono text-sm font-medium px-5 py-2.5" style={{ color: 'var(--accent)' }}>
                  {typeof result.valuesA[index] === 'number' ? result.valuesA[index].toLocaleString() : result.valuesA[index]}
                </td>
                <td className="font-mono text-sm font-medium px-5 py-2.5" style={{ color: 'var(--accent2)' }}>
                  {typeof result.valuesB[index] === 'number' ? result.valuesB[index].toLocaleString() : result.valuesB[index]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
