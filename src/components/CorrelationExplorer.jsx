import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Database, Shuffle, Sparkles } from 'lucide-react';
import { getCategoryById } from '../data/categories';
import { getDatasetById } from '../data/registry';
import { calculateCorrelation } from '../engine/correlation';
import { discoverCorrelationsForCategory } from '../engine/discovery';
import { generateExplanationPayload } from '../engine/explanations';
import Icon from './Icon';
import CategoryAmbience from './CategoryAmbience';
import SideDecorators from './SideDecorators';
import CorrelationScore from './CorrelationScore';
import StatsRow from './StatsRow';
import DualAxisChart from './DualAxisChart';
import DataTable from './DataTable';
import LoadingSkeleton from './LoadingSkeleton';

function StorytellingReport({ result, datasetA, datasetB, story }) {
  if (!result || !datasetA || !datasetB) return null;

  const observations = story?.observations || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 }}
      className="story-grid mt-8"
    >
      <article className="story-panel story-panel--wide">
        <span className="eyebrow">Statistical relationship</span>
        <h3 className="font-display font-black text-2xl md:text-3xl mt-2 mb-4" style={{ color: 'var(--text-primary)' }}>
          The streams move together. The universe refuses to explain itself.
        </h3>
        <p>
          The Python model cleaned both annual series, interpolated missing years, normalized scale differences,
          and calculated a Pearson coefficient of <strong>{result.r.toFixed(4)}</strong>. That is strong enough
          to be visually compelling, but it is still only a pattern match.
        </p>
      </article>

      <article className="story-panel">
        <span className="eyebrow">Reality check</span>
        <h4>Correlation is not causation</h4>
        <p>
          {datasetA.name} does not automatically cause {datasetB.name}. The chart shows synchronized movement,
          not a mechanism, experiment, or causal proof.
        </p>
      </article>

      <article className="story-panel">
        <span className="eyebrow">Absurd explanation</span>
        <h4>Model conjecture</h4>
        <p>{story?.explanation}</p>
      </article>

      {observations.map((observation, index) => (
        <article key={observation} className="insight-box animated-insight">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em]" style={{ color: 'var(--accent)' }}>
            Observation {index + 1}
          </span>
          <p className="mt-2">{observation}</p>
        </article>
      ))}
    </motion.section>
  );
}

export default function CorrelationExplorer({ categoryId, onBack }) {
  const category = useMemo(() => getCategoryById(categoryId), [categoryId]);
  const [activePairIdx, setActivePairIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [story, setStory] = useState(null);
  const [dsA, setDsA] = useState(null);
  const [dsB, setDsB] = useState(null);
  const [availablePairs, setAvailablePairs] = useState([]);
  const hoverTimeoutRef = useRef(null);
  const requestRef = useRef(0);

  const fetchPair = useCallback(async (aId, bId) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;

    setLoading(true);
    setError(null);
    setResult(null);
    setStory(null);

    const a = getDatasetById(aId);
    const b = getDatasetById(bId);
    if (!a || !b) {
      setError('Dataset not found.');
      setLoading(false);
      return;
    }

    setDsA(a);
    setDsB(b);

    try {
      const [dataA, dataB] = await Promise.all([a.fetchFn(), b.fetchFn()]);
      if (!dataA.length || !dataB.length) {
        setError('No data returned from one of the selected streams.');
        setLoading(false);
        return;
      }

      const corr = await calculateCorrelation(dataA, dataB);
      if (requestRef.current !== requestId) return;

      if (!corr.valid || Math.abs(corr.r) < 0.87) {
        setError(`Correlation too weak (r=${Math.abs(corr.r).toFixed(2)}). The model only reveals patterns with r >= 0.87.`);
        setLoading(false);
        return;
      }

      const narrative = await generateExplanationPayload(a.name, b.name, corr.rPercent);
      if (requestRef.current !== requestId) return;

      setResult(corr);
      setStory(narrative);
    } catch (err) {
      if (requestRef.current === requestId) setError(err.message);
    } finally {
      if (requestRef.current === requestId) setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!category) return;
    let cancelled = false;

    setDiscovering(true);
    setError(null);
    setResult(null);
    setStory(null);
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

  const handleSelectPair = (index) => {
    if (!availablePairs[index]) return;
    setActivePairIdx(index);
    const pair = availablePairs[index];
    fetchPair(pair.a, pair.b);
  };

  const handleCardHover = (index) => {
    if (index === activePairIdx) return;
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => handleSelectPair(index), 150);
  };

  const handleRandom = () => {
    if (!availablePairs.length) return;
    const index = Math.floor(Math.random() * availablePairs.length);
    handleSelectPair(index);
  };

  if (!category) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 md:px-8 pb-12 relative min-h-screen"
    >
      <CategoryAmbience ambience={category.ambience} themeColor={category.themeColor} />
      <SideDecorators categoryId={category.id} ambience={category.ambience} />

      <div className="topic-hero relative z-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
          <div>
            <button onClick={onBack} className="btn-ghost px-3.5 py-2 text-xs flex items-center gap-2 font-display cursor-pointer mb-5">
              <ArrowLeft size={14} />
              Back
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="topic-hero-icon" style={{ '--topic-color': category.themeColor }}>
                <Icon name={category.icon} size={24} color={category.themeColor} />
              </div>
              <span className="platform-badge">
                <Sparkles size={12} />
                {availablePairs.length} active anomalies
              </span>
            </div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display font-black tracking-tight leading-[0.94] text-4xl md:text-6xl"
              style={{ color: 'var(--text-primary)' }}
            >
              {category.name}
            </motion.h1>
            <p className="mt-4 max-w-2xl text-sm md:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {category.description}
            </p>
          </div>

          <button
            onClick={handleRandom}
            disabled={loading || discovering || availablePairs.length === 0}
            className="btn-cta px-5 py-3 text-xs font-bold flex items-center gap-2 rounded-xl cursor-pointer self-start"
          >
            <Shuffle size={14} />
            Shuffle Pair
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 relative z-10 items-start mt-8">
        <aside className="lg:col-span-4 floating-sidebar">
          <div className="sidebar-shell">
            <div className="flex items-center justify-between border-b pb-3 mb-3" style={{ borderColor: 'var(--border)' }}>
              <span className="font-display text-xs font-black uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                Spurious Database
              </span>
              <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                Hover scan
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 sidebar-scrollbar" style={{ maxHeight: 'calc(76vh - 64px)' }}>
              {availablePairs.map((pair, index) => {
                const isActive = activePairIdx === index;
                return (
                  <button
                    key={`${pair.a}-${pair.b}`}
                    onMouseEnter={() => handleCardHover(index)}
                    onClick={() => handleSelectPair(index)}
                    className={`anomaly-row ${isActive ? 'active' : ''}`}
                    style={{ '--row-color': isActive ? category.themeColor : 'var(--accent)' }}
                  >
                    <div className="min-w-0">
                      <h4>{pair.title}</h4>
                      <p>Independent annual streams</p>
                    </div>
                    <div className="r-meter">
                      <span>r</span>
                      <strong>{Math.abs(pair.r).toFixed(2)}</strong>
                    </div>
                  </button>
                );
              })}

              {discovering && (
                <div className="flex items-center justify-center gap-2 p-6 text-xs font-mono animate-pulse" style={{ color: 'var(--text-muted)' }}>
                  <Database size={14} className="animate-pulse" />
                  Scanning public databases...
                </div>
              )}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-8 min-w-0">
          <AnimatePresence mode="wait">
            {loading || discovering ? (
              <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <LoadingSkeleton />
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="error-panel"
              >
                <p>{error}</p>
                {availablePairs.length > 0 && (
                  <button onClick={() => handleSelectPair(activePairIdx >= 0 ? activePairIdx : 0)} className="btn-primary px-6 py-2.5 text-xs mt-4">
                    Retry Data Stream
                  </button>
                )}
              </motion.div>
            ) : result ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              >
                <CorrelationScore result={result} story={story} datasetA={dsA} datasetB={dsB} />

                <div className="visualizer-shell mt-6">
                  <div className="visualizer-header">
                    <div>
                      <span className="eyebrow">Interactive visualizer</span>
                      <h3>Statistical Trend Plot</h3>
                    </div>
                    <span className="confidence-badge">
                      confidence {(result.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                  <DualAxisChart result={result} datasetA={dsA} datasetB={dsB} />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </section>
      </div>

      <AnimatePresence mode="wait">
        {!loading && !discovering && result && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.42, delay: 0.1 }}
            className="relative z-10"
          >
            <StorytellingReport result={result} datasetA={dsA} datasetB={dsB} story={story} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-8">
              <div className="panel-shell">
                <div className="panel-heading">
                  <span className="status-dot" />
                  <h4>Model Analytics</h4>
                </div>
                <StatsRow result={result} datasetA={dsA} datasetB={dsB} />
              </div>

              <div className="panel-shell">
                <div className="panel-heading panel-heading--alt">
                  <span className="status-dot" />
                  <h4>Tabular Data Feed</h4>
                </div>
                <DataTable result={result} datasetA={dsA} datasetB={dsB} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
