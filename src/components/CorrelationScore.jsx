import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CorrelationScore({ result, story, datasetA, datasetB }) {
  if (!result || !result.valid) return null;

  const confidence = Math.round((result.confidence || 0) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="score-panel"
    >
      <div className="score-panel__beam" />

      <div className="score-panel__meta">
        <span>Pearson correlation coefficient</span>
        <span>{result.dataPoints} aligned years</span>
        <span>{result.direction} trend</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[0.72fr_0.28fr] gap-8 items-center">
        <div>
          <AnimatePresence mode="wait">
            <motion.div
              key={result.rPercent}
              initial={{ opacity: 0, scale: 0.72, filter: 'blur(16px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.72 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="score-value"
            >
              {result.rPercent}%
            </motion.div>
          </AnimatePresence>

          <motion.h2
            key={story?.headline || result.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-display font-black text-2xl md:text-4xl leading-tight mt-1 max-w-3xl"
            style={{ color: 'var(--text-primary)' }}
          >
            {story?.headline || result.label}
          </motion.h2>

          <div className="score-pair mt-5">
            <span>{datasetA?.name}</span>
            <strong>versus</strong>
            <span>{datasetB?.name}</span>
          </div>
        </div>

        <div className="score-dials">
          {[
            { label: 'r', value: result.r.toFixed(4) },
            { label: 'r squared', value: `${result.r2Percent}%` },
            { label: 'confidence', value: `${confidence}%` },
          ].map(item => (
            <div key={item.label} className="score-dial">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </div>

      {story?.explanation && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="score-note"
        >
          {story.explanation}
        </motion.p>
      )}
    </motion.div>
  );
}
