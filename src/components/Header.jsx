import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';

export default function Header({
  onLogoClick,
  onAboutClick,
  activePage = 'home',
  isHome = true,
}) {
  const { isDark, toggle } = useTheme();

  return (
    <header className="relative pt-6 pb-4 px-4 md:px-8 z-30">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-nav px-4 md:px-5 py-3 flex items-center justify-between gap-4"
        >
          <button onClick={onLogoClick} className="flex items-center gap-3 group cursor-pointer min-w-0">
            <Logo size={36} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="font-display font-black text-base tracking-tight hidden sm:block" style={{ color: 'var(--text-primary)' }}>
              Do They <span style={{ color: 'var(--accent)' }}>Talk?</span>
            </span>
          </button>

          <div className="nav-segments">
            <button
              onClick={onLogoClick}
              className={activePage === 'home' && isHome ? 'active' : ''}
            >
              Dashboard
            </button>
            {onAboutClick && (
              <button
                onClick={onAboutClick}
                className={activePage === 'about' ? 'active' : ''}
              >
                Methodology
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex live-data-chip">
              <span className="w-1.5 h-1.5 rounded-full live-badge" style={{ background: '#22c55e' }} />
              <span>Python pipeline</span>
            </div>

            <button onClick={toggle} className="theme-toggle" aria-label="Toggle theme">
              <span className="theme-toggle__thumb">
                {isDark ? <Moon size={13} /> : <Sun size={13} />}
              </span>
            </button>
          </div>
        </motion.div>
      </div>

      {isHome && (
        <div className="max-w-5xl mx-auto text-center mt-12 mb-7">
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="platform-badge mx-auto"
          >
            <span className="w-1.5 h-1.5 rounded-full live-badge" style={{ background: 'var(--accent)' }} />
            Correlation does not imply causation
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display font-black leading-[0.96] tracking-tight mt-6 mb-5 dashboard-title"
          >
            Explore the world's most absurd correlations
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Pick a domain, scan the anomaly engine, and watch unrelated data streams behave like they have been rehearsing.
          </motion.p>
        </div>
      )}
    </header>
  );
}
