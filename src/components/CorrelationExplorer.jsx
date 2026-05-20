import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCategoryById } from '../data/categories';
import { getDatasetById } from '../data/registry';
import { calculateCorrelation } from '../engine/correlation';
import { discoverCorrelationsForCategory } from '../engine/discovery';
import { generateExplanation, generateHeadline } from '../engine/explanations';
import Icon from './Icon';
import CategoryAmbience from './CategoryAmbience';
import SideDecorators from './SideDecorators';
import CorrelationScore from './CorrelationScore';
import StatsRow from './StatsRow';
import DualAxisChart from './DualAxisChart';
import DataTable from './DataTable';
import LoadingSkeleton from './LoadingSkeleton';

export default function CorrelationExplorer({ categoryId, onBack }) {
  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const [activePairIdx, setActivePairIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [explanation, setExplanation] = useState('');
  const [headline, setHeadline] = useState('');
  const [dsA, setDsA] = useState(null);
  const [dsB, setDsB] = useState(null);
  const [availablePairs, setAvailablePairs] = useState([]);
  const resultsRef = useRef(null);

  const fetchPair = useCallback(async (aId, bId) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const a = getDatasetById(aId);
    const b = getDatasetById(bId);
    if (!a || !b) { setError('Dataset not found.'); setLoading(false); return; }
    setDsA(a); setDsB(b);
    try {
      const [dataA, dataB] = await Promise.all([a.fetchFn(), b.fetchFn()]);
      if (!dataA.length || !dataB.length) { setError('No data returned.'); setLoading(false); return; }
      
      // Strict ML model filter: r >= 0.87
      const corr = calculateCorrelation(dataA, dataB);
      if (!corr.valid || Math.abs(corr.r) < 0.87) {
        setError(`Correlation too weak (r=${Math.abs(corr.r).toFixed(2)}). Our ML model only reveals patterns with r >= 0.87.`);
        setLoading(false);
        return;
      }
      
      setResult(corr);
      setExplanation(generateExplanation(a.name, b.name));
      setHeadline(generateHeadline(a.name, b.name, corr.rPercent));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!category) return;
    let cancelled = false;

    setDiscovering(true);
    setError(null);
    setResult(null);
    setAvailablePairs([]);
    setActivePairIdx(0);

    // This is the "ML Model" discovery scan
    discoverCorrelationsForCategory(category)
      .then(pairs => {
        if (cancelled) return;
        setAvailablePairs(pairs);
        if (pairs.length > 0) {
          fetchPair(pairs[0].a, pairs[0].b);
        } else {
          setError('No independent source pairs in this topic currently pass the strict r >= 0.87 model filter.');
        }
      })
      .catch(err => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setDiscovering(false);
      });

    return () => { cancelled = true; };
  }, [category, fetchPair]);

  const handleSelectPair = (idx) => {
    if (!availablePairs[idx]) return;
    setActivePairIdx(idx);
    const p = availablePairs[idx];
    fetchPair(p.a, p.b);
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleRandom = () => {
    if (!availablePairs.length) return;
    const idx = Math.floor(Math.random() * availablePairs.length);
    handleSelectPair(idx);
  };

  if (!category) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-6xl mx-auto px-4 md:px-8 pb-12 relative min-h-screen">

      {/* Background Ambience */}
      <CategoryAmbience ambience={category.ambience} themeColor={category.themeColor} />
      
      {/* Field-Specific Side Decorators (Visible in blank areas) */}
      <SideDecorators categoryId={category.id} ambience={category.ambience} />

      {/* Floating Header (No translucent box) */}
      <div className="flex items-center gap-4 mb-8 pt-4 relative z-10">
        <button onClick={onBack} className="btn-ghost px-3 py-2 text-sm flex items-center gap-1.5 font-display bg-white/5 backdrop-blur-sm">
          <Icon name="arrowLeft" size={16} />
          Back
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Icon name={category.icon} size={24} color={category.themeColor} />
            <h2 className="font-display text-2xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {category.name}
            </h2>
          </div>
          <p className="text-xs mt-1 font-medium tracking-wide uppercase opacity-70" style={{ color: 'var(--text-muted)' }}>
            {category.tagline || category.description}
          </p>
        </div>
      </div>

      {/* Correlation pair pills */}
      <div className="flex flex-wrap gap-2 mb-8 relative z-10">
        {availablePairs.map((p, idx) => (
          <button key={idx} onClick={() => handleSelectPair(idx)} disabled={loading}
            className="text-xs font-bold px-4 py-2.5 rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50"
            style={{
              background: activePairIdx === idx ? 'var(--accent)' : 'rgba(255,255,255,0.03)',
              color: activePairIdx === idx ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${activePairIdx === idx ? 'var(--accent)' : 'rgba(255,255,255,0.08)'}`,
              boxShadow: activePairIdx === idx ? '0 8px 24px var(--accent-glow)' : 'none',
              transform: activePairIdx === idx ? 'scale(1.05)' : 'scale(1)',
            }}>
            {p.title} · r={Math.abs(p.r).toFixed(2)}
          </button>
        ))}
        {discovering && (
          <div className="flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-muted animate-pulse">
            <Icon name="refresh" className="animate-spin" size={12} />
            Scanning...
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 mb-10 relative z-10">
        <button onClick={handleRandom} disabled={loading || discovering || availablePairs.length === 0}
          className="btn-primary px-6 py-3 text-sm font-bold flex items-center gap-2 rounded-xl">
          <Icon name="shuffle" size={16} /> Discovery Mode
        </button>
      </div>

      {/* Results (The actual "Data Storytelling" part) */}
      <div className="relative z-10 max-w-4xl" ref={resultsRef}>
        <AnimatePresence mode="wait">
          {loading || discovering ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LoadingSkeleton />
            </motion.div>
          ) : error ? (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="p-10 text-center bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-md">
              <p className="text-base font-bold mb-2" style={{ color: 'var(--pink)' }}>{error}</p>
              {availablePairs.length > 0 && (
                <button onClick={() => handleSelectPair(activePairIdx >= 0 ? activePairIdx : 0)}
                  className="btn-primary px-6 py-2 text-sm mt-4">Retry Search</button>
              )}
            </motion.div>
          ) : result ? (
            <motion.div key="results" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5, ease: "circOut" }}>
              <CorrelationScore result={result} explanation={explanation} headline={headline} />
              
              <div className="grid grid-cols-1 gap-6 mt-8">
                 <DualAxisChart result={result} datasetA={dsA} datasetB={dsB} />
                 <StatsRow result={result} datasetA={dsA} datasetB={dsB} />
                 <DataTable result={result} datasetA={dsA} datasetB={dsB} />
              </div>

              {/* Browse Nudge */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-12 text-center pb-12">
                 <button onClick={onBack} className="btn-ghost px-8 py-3 text-sm font-bold bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all">
                    Explore More Categories
                 </button>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
