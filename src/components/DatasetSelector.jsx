import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import DATASET_REGISTRY, { getCategories } from '../data/registry';
import Icon from './Icon';

/**
 * Dataset selector with categorized dropdowns.
 */
export default function DatasetSelector({
  idA,
  idB,
  onChangeA,
  onChangeB,
  onCompare,
  onRandom,
  loading,
}) {
  const categories = useMemo(() => getCategories(), []);

  const groupedDatasets = useMemo(() => {
    const groups = {};
    categories.forEach(cat => {
      groups[cat] = DATASET_REGISTRY.filter(d => d.category === cat);
    });
    return groups;
  }, [categories]);

  const selectStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card p-6 mb-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <Icon name="activity" size={16} color="var(--accent)" />
        <span
          className="font-display text-xs font-semibold uppercase tracking-widest"
          style={{ color: 'var(--text-secondary)' }}
        >
          Choose Datasets to Compare
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="select-a"
            className="block text-xs font-mono uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--accent)' }}
          >
            Variable A
          </label>
          <select
            id="select-a"
            value={idA}
            onChange={e => onChangeA(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl font-medium text-sm appearance-none cursor-pointer outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={selectStyle}
          >
            {categories.map(cat => (
              <optgroup label={cat} key={cat}>
                {groupedDatasets[cat].map(d => (
                  <option key={d.id} value={d.id} disabled={d.id === idB}>
                    {d.name} {d.isLive ? '(Live)' : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="select-b"
            className="block text-xs font-mono uppercase tracking-wider mb-1.5"
            style={{ color: 'var(--accent2)' }}
          >
            Variable B
          </label>
          <select
            id="select-b"
            value={idB}
            onChange={e => onChangeB(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl font-medium text-sm appearance-none cursor-pointer outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            style={selectStyle}
          >
            {categories.map(cat => (
              <optgroup label={cat} key={cat}>
                {groupedDatasets[cat].map(d => (
                  <option key={d.id} value={d.id} disabled={d.id === idA}>
                    {d.name} {d.isLive ? '(Live)' : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          id="compare-button"
          onClick={onCompare}
          disabled={loading}
          className="flex-1 min-w-[140px] px-6 py-3 rounded-xl font-display font-semibold text-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'var(--accent)', color: '#fff', boxShadow: '0 4px 16px var(--accent-glow)' }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Fetching...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Icon name="zap" size={14} color="#fff" />
              Compare
            </span>
          )}
        </button>

        <button
          id="random-button"
          onClick={onRandom}
          disabled={loading}
          className="flex-1 min-w-[140px] px-6 py-3 rounded-xl font-display font-semibold text-sm active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <Icon name="shuffle" size={14} />
            Random Correlation
          </span>
        </button>
      </div>
    </motion.div>
  );
}
