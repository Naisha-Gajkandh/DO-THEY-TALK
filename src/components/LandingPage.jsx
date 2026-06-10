import React, { Suspense, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Info, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

const Globe3D = React.lazy(() => import('./Globe3D'));

function applyMagnet(event) {
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  event.currentTarget.style.setProperty('--mx', x.toFixed(3));
  event.currentTarget.style.setProperty('--my', y.toFixed(3));
}

function resetMagnet(event) {
  event.currentTarget.style.setProperty('--mx', '0');
  event.currentTarget.style.setProperty('--my', '0');
}

export default function LandingPage({ onExplore, onMethodology }) {
  const { isDark, toggle } = useTheme();

  const handleMethodology = useCallback(() => {
    if (onMethodology) onMethodology();
  }, [onMethodology]);

  return (
    <div className="relative w-full min-h-screen flex flex-col overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 cinematic-grid" />
        <div className="absolute inset-0 data-scanlines" />
        <div
          className="ambient-light-field absolute w-[720px] h-[720px]"
          style={{
            top: '-18%',
            left: '-12%',
            background: isDark
              ? 'radial-gradient(circle, rgba(249,115,22,0.16), transparent 72%)'
              : 'radial-gradient(circle, rgba(59,108,239,0.08), transparent 72%)',
          }}
        />
        <div
          className="ambient-light-field absolute w-[620px] h-[620px]"
          style={{
            bottom: '-20%',
            right: '-12%',
            background: isDark
              ? 'radial-gradient(circle, rgba(56,189,248,0.11), transparent 74%)'
              : 'radial-gradient(circle, rgba(14,138,160,0.06), transparent 74%)',
            animationDelay: '-8s',
          }}
        />

        {isDark && (
          <>
            <div className="light-beam" style={{ left: '18%', top: 0 }} />
            <div className="light-beam" style={{ left: '76%', top: 0, animationDelay: '1.5s' }} />
          </>
        )}

        <div className="absolute inset-0 opacity-25">
          <span className="math-float text-sm" style={{ left: '8%', top: '18%', '--float-x': '30px', '--float-y': '-60px', '--float-duration': '14s', '--float-opacity': '0.15', color: 'var(--text-muted)' }}>
            r = 0.982
          </span>
          <span className="math-float text-base" style={{ left: '86%', top: '14%', '--float-x': '-40px', '--float-y': '-70px', '--float-duration': '16s', '--float-opacity': '0.10', '--float-delay': '2s', color: 'var(--text-muted)' }}>
            sigma = sqrt(sum(x-mu)^2 / N)
          </span>
          <span className="math-float text-base" style={{ left: '74%', top: '78%', '--float-x': '-50px', '--float-y': '-70px', '--float-duration': '13s', '--float-opacity': '0.18', '--float-delay': '3s', color: 'var(--text-muted)' }}>
            p &lt; 0.001
          </span>
          <span className="math-float text-lg font-bold" style={{ left: '12%', top: '82%', '--float-x': '40px', '--float-y': '-90px', '--float-duration': '15s', '--float-opacity': '0.12', '--float-delay': '1s', color: 'var(--text-muted)' }}>
            sum x_i y_i
          </span>
        </div>
      </div>

      <nav className="relative z-30 w-full px-5 md:px-10 pt-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Logo size={40} />
            <span className="font-display font-black text-base tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Do They <span style={{ color: 'var(--accent)' }}>Talk?</span>
            </span>
          </div>

          <button
            onClick={toggle}
            className="theme-toggle"
            aria-label="Toggle theme"
          >
            <span className="theme-toggle__thumb">
              {isDark ? <Moon size={13} /> : <Sun size={13} />}
            </span>
          </button>
        </div>
      </nav>

      <div className="relative z-20 flex-1 flex items-center">
        <div className="max-w-7xl mx-auto w-full px-5 md:px-10 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.92fr_1.08fr] gap-8 lg:gap-2 items-center min-h-[72vh]">
            <div className="flex flex-col justify-center lg:pr-8">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="platform-badge"
              >
                <span className="w-1.5 h-1.5 rounded-full live-badge" style={{ background: 'var(--accent)' }} />
                Statistical Storytelling Platform
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-display font-black leading-[0.88] mb-6 landing-title"
              >
                Do They
                <br />
                Talk?
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-base md:text-xl max-w-xl leading-relaxed font-light mb-10"
                style={{ color: 'var(--text-secondary)' }}
              >
                Exploring bizarre statistical relationships hidden inside real-world data.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="flex flex-wrap gap-4"
              >
                <button
                  onClick={onExplore}
                  onPointerMove={applyMagnet}
                  onPointerLeave={resetMagnet}
                  className="btn-cta magnetic-btn px-9 py-4 text-sm tracking-widest uppercase flex items-center gap-3"
                  id="explore-correlations-btn"
                >
                  <span>Explore Correlations</span>
                  <ArrowRight size={17} strokeWidth={2.5} />
                </button>

                <button
                  onClick={handleMethodology}
                  onPointerMove={applyMagnet}
                  onPointerLeave={resetMagnet}
                  className="btn-glass magnetic-btn px-8 py-4 text-sm tracking-widest uppercase flex items-center gap-3"
                  id="view-methodology-btn"
                >
                  <Info size={16} strokeWidth={2.2} />
                  <span>View Methodology</span>
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="grid grid-cols-3 gap-4 max-w-lg mt-12"
              >
                {[
                  { value: '50+', label: 'Data Streams' },
                  { value: 'r >= 0.87', label: 'Threshold' },
                  { value: 'Python', label: 'Model Core' },
                ].map(stat => (
                  <div key={stat.label} className="hero-stat">
                    <div className="font-mono text-base md:text-lg font-bold" style={{ color: 'var(--accent)' }}>
                      {stat.value}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full aspect-square max-w-[720px] mx-auto lg:mx-0 lg:ml-auto globe-stage"
            >
              <div className="absolute inset-[-8%] rounded-full pointer-events-none globe-halo" />
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full border-2 animate-pulse flex items-center justify-center" style={{ borderColor: 'var(--accent-glow)' }}>
                      <div className="w-24 h-24 rounded-full border animate-spin" style={{ borderTopColor: 'var(--accent)', borderColor: 'var(--border)' }} />
                    </div>
                  </div>
                }
              >
                <Globe3D />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.48 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="relative z-20 w-full text-center pb-7"
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-px h-8 opacity-50" style={{ background: 'linear-gradient(180deg, transparent, var(--accent))' }} />
          <p className="font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: 'var(--text-muted)' }}>
            Scroll to explore / Interactive data globe
          </p>
        </div>
      </motion.div>
    </div>
  );
}
