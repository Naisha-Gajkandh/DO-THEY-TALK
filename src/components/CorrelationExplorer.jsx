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
  const hoverTimeoutRef = useRef(null);

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
      
      // Strict filter: r >= 0.87
      const corr = calculateCorrelation(dataA, dataB);
      if (!corr.valid || Math.abs(corr.r) < 0.87) {
        setError(`Correlation too weak (r=${Math.abs(corr.r).toFixed(2)}). Our model only reveals patterns with r >= 0.87.`);
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

    return () => { 
      cancelled = true; 
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, [category, fetchPair]);

  const handleSelectPair = (idx) => {
    if (!availablePairs[idx]) return;
    setActivePairIdx(idx);
    const p = availablePairs[idx];
    fetchPair(p.a, p.b);
  };

  // Hover triggers dataset change with a very tiny debounce to prevent redundant network spam while sliding cursor
  const handleCardHover = (idx) => {
    if (idx === activePairIdx) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    
    hoverTimeoutRef.current = setTimeout(() => {
      handleSelectPair(idx);
    }, 150); // 150ms gentle hover buffer
  };

  const handleRandom = () => {
    if (!availablePairs.length) return;
    const idx = Math.floor(Math.random() * availablePairs.length);
    handleSelectPair(idx);
  };

  if (!category) return null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 md:px-8 pb-12 relative min-h-screen">

      {/* Background Ambience */}
      <CategoryAmbience ambience={category.ambience} themeColor={category.themeColor} />
      
      {/* Side Decorators (Floating icons floating in empty zones) */}
      <SideDecorators categoryId={category.id} ambience={category.ambience} />

      {/* Modern Floating Navigation bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-4 relative z-10">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="btn-ghost px-3.5 py-2 text-xs flex items-center gap-1.5 font-display bg-white/5 backdrop-blur-sm cursor-pointer rounded-lg border border-white/10 hover:bg-white/10">
            <Icon name="arrowLeft" size={14} />
            Back
          </button>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2.5">
            <Icon name={category.icon} size={22} color={category.themeColor} />
            <h2 className="font-display text-xl font-black tracking-tight" style={{ color: 'var(--text-primary)' }}>
              {category.name}
            </h2>
            <span className="font-mono text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-accent-dim text-accent border border-accent-glow">
              {availablePairs.length} active anomalies
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={handleRandom} disabled={loading || discovering || availablePairs.length === 0}
            className="explore-btn text-xs font-bold px-4 py-2 flex items-center gap-2 rounded-lg cursor-pointer ml-auto">
            <Icon name="shuffle" size={12} /> Shuffle Pair
          </button>
        </div>
      </div>

      {/* =======================================================
          MAIN 2-COLUMN SIDEBAR & DATA GRID DASHBOARD
          ======================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 items-start">
        
        {/* SIDEBAR: SCROLLABLE LIST OF SPURIOUS CORRELATIONS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="card p-4 flex flex-col max-h-[72vh]">
            <div className="flex items-center justify-between border-b pb-3 mb-3" style={{ borderColor: 'var(--border)' }}>
              <span className="font-display text-xs font-black uppercase tracking-wider text-accent">
                Spurious Database
              </span>
              <span className="text-[10px] font-mono opacity-60">
                Hover to reveal data
              </span>
            </div>

            {/* Sidebar list items */}
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 sidebar-scrollbar" style={{ maxHeight: 'calc(72vh - 60px)' }}>
              {availablePairs.map((p, idx) => {
                const isActive = activePairIdx === idx;
                // Alternate card colors dynamically between silver, blue, green, and white shades
                const cardClass = idx % 2 === 0 ? 'neon-card-blue' : 'neon-card-green';
                
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => handleCardHover(idx)}
                    onClick={() => handleSelectPair(idx)}
                    className={`${cardClass} p-4 rounded-xl cursor-pointer relative overflow-hidden transition-all duration-300 ${
                      isActive ? 'border-accent shadow-[0_4px_20px_var(--accent-glow)] scale-[1.01]' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      borderWidth: '1px',
                      borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                      background: isActive ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                    }}
                  >
                    {/* Active dynamic glowing trail border */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-accent2/5 to-transparent pointer-events-none" />
                    )}

                    <div className="flex items-start justify-between gap-3 relative z-10">
                      <div className="flex-1 min-w-0">
                        {/* Title of Spurious Match */}
                        <h4 className="font-display text-xs font-bold leading-tight truncate mb-1" style={{ color: 'var(--text-primary)' }}>
                          {p.title}
                        </h4>
                        
                        {/* Tags or Dataset source references */}
                        <p className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                          Independent API streams
                        </p>
                      </div>

                      {/* Circular glowing mathematical r-coefficient indicator */}
                      <div className="flex flex-col items-center justify-center shrink-0">
                        <div
                          className="w-10 h-10 rounded-full border flex flex-col items-center justify-center text-[10px] font-black"
                          style={{
                            background: isActive ? 'var(--accent-dim)' : 'rgba(255,255,255,0.02)',
                            borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                            color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                            boxShadow: isActive ? '0 0 10px var(--accent-glow)' : 'none',
                          }}
                        >
                          <span className="text-[7px] font-normal leading-none uppercase opacity-60">r</span>
                          <span className="leading-none mt-0.5">{Math.abs(p.r).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Active Card Neon Accent Indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-full bg-accent" />
                    )}
                  </div>
                );
              })}

              {discovering && (
                <div className="flex items-center justify-center gap-2 p-6 text-xs font-mono text-muted animate-pulse">
                  <Icon name="refresh" className="animate-spin" size={14} />
                  Scanning public databases...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MAIN PANEL: INSTANT DETAILED VISUAL DATA REPORT */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {loading || discovering ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoadingSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="p-10 text-center bg-red-500/5 border border-red-500/15 rounded-2xl backdrop-blur-md">
                <p className="text-sm font-bold mb-2" style={{ color: 'var(--pink)' }}>{error}</p>
                {availablePairs.length > 0 && (
                  <button onClick={() => handleSelectPair(activePairIdx >= 0 ? activePairIdx : 0)}
                    className="btn-primary px-6 py-2.5 text-xs mt-4">Retry Data Stream</button>
                )}
              </motion.div>
            ) : result ? (
              <motion.div key="results" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4, ease: "easeOut" }}>
                
                {/* 1. Correlation Headline, Explanation & Score Ring */}
                <div className="card p-6 mb-6 overflow-hidden relative">
                  {/* Subtle motionsites grid border glows */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent pointer-events-none" />
                  <CorrelationScore result={result} explanation={explanation} headline={headline} />
                </div>

                {/* 2. Interactive Charts & Real Data */}
                <div className="grid grid-cols-1 gap-6">
                  {/* The Dual-Axis Graph Container */}
                  <div className="card p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full filter blur-3xl pointer-events-none" />
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
                      <h3 className="font-display text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
                        Statistical Trend Plot
                      </h3>
                    </div>
                    <DualAxisChart result={result} datasetA={dsA} datasetB={dsB} />
                  </div>

                </div>

              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

      </div>

      {/* 3. Full-Width Stats Row & Data Table Feed below the sidebar layout */}
      <AnimatePresence mode="wait">
        {!loading && !discovering && result && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 relative z-10 w-full"
          >
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <h4 className="font-display text-xs font-black uppercase tracking-widest text-accent">
                  Model Analytics
                </h4>
              </div>
              <StatsRow result={result} datasetA={dsA} datasetB={dsB} />
            </div>

            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-4 border-b pb-3" style={{ borderColor: 'var(--border)' }}>
                <div className="w-2 h-2 rounded-full bg-accent2 animate-pulse" />
                <h4 className="font-display text-xs font-black uppercase tracking-widest text-accent2">
                  Tabular Data Feed
                </h4>
              </div>
              <DataTable result={result} datasetA={dsA} datasetB={dsB} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
