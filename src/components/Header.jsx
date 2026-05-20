import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Icon from './Icon';
import Logo from './Logo';

export default function Header({
  onLogoClick,
  onAboutClick,
  activePage = 'home',
  isHome = true,
}) {
  const { isDark, toggle } = useTheme();
  const navButtonStyle = (page) => ({
    color: activePage === page ? 'var(--accent)' : 'var(--text-secondary)',
    background: activePage === page ? 'var(--accent-dim)' : 'transparent',
    borderColor: activePage === page ? 'var(--border-hover)' : 'transparent',
  });

  return (
    <header className="relative pt-8 pb-6 px-4 md:px-8">
      {/* Top bar */}
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 mb-8">
        <button onClick={onLogoClick} className="flex items-center gap-3 group cursor-pointer">
          <Logo size={64} className="group-hover:scale-105 transition-transform duration-300" />
          <span className="font-display font-bold text-xl tracking-tight"
            style={{ color: 'var(--text-primary)' }}>
            Do they <span style={{ color: 'var(--accent)' }}>Talk?</span>
          </span>
        </button>

        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          {onAboutClick && (
            <button
              onClick={onAboutClick}
              className="px-3 py-1.5 rounded-full border text-sm font-medium transition-colors hover:text-[var(--accent)] cursor-pointer"
              style={navButtonStyle('about')}
            >
              About
            </button>
          )}
          {/* Theme toggle */}
          <button onClick={toggle}
            className="relative w-14 h-7 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              background: isDark ? 'var(--accent-dim)' : 'var(--accent)',
              border: '1px solid var(--border)',
            }}
            aria-label="Toggle theme"
          >
          <span className="absolute top-[3px] w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-[10px]"
            style={{
              left: isDark ? '4px' : 'calc(100% - 24px)',
              background: isDark ? '#1a1d2e' : '#fff',
              color: isDark ? '#a0a0b0' : '#f59e0b',
            }}>
            {isDark ? 'D' : 'L'}
          </span>
          </button>
        </div>
      </div>

      {/* Hero */}
      {isHome && (
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 mb-5 rounded-full
              font-mono text-[11px] font-medium uppercase tracking-[0.15em]"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--border-hover)', color: 'var(--accent)' }}>
            <span className="w-1.5 h-1.5 rounded-full live-badge" style={{ background: 'var(--accent)' }} />
            Correlation does not equal Causation
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold leading-[1.05] tracking-tight mb-4"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', color: 'var(--text-primary)' }}>
            Explore the World's Most{' '}
            <span style={{ color: 'var(--accent)' }}>Absurd</span>{' '}
            Correlations
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base md:text-lg max-w-xl mx-auto leading-relaxed font-light"
            style={{ color: 'var(--text-secondary)' }}>
            Pick a category. Discover hilarious data coincidences.
            <br className="hidden md:block" />
            Powered by <span style={{ color: 'var(--accent)' }} className="font-medium">live APIs</span> and questionable logic.
          </motion.p>
        </div>
      )}
    </header>
  );
}
