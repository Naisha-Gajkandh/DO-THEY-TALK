import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTheme } from './contexts/ThemeContext';
import ParticleBackground from './components/ParticleBackground';
import Header from './components/Header';
import CategoryGrid from './components/CategoryGrid';
import CorrelationExplorer from './components/CorrelationExplorer';
import About from './components/About';
import Footer from './components/Footer';
import Icon from './components/Icon';
import LandingPage from './components/LandingPage';

// Premium high-fidelity cinematic glass scale-and-blur transition configuration
const pageBlurVariants = {
  initial: { opacity: 0, scale: 0.97, filter: 'blur(10px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 1.03, filter: 'blur(10px)' }
};

const pageTransitionConfig = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1]
};

export default function App() {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activePage, setActivePage] = useState('home');
  const [showLanding, setShowLanding] = useState(true);

  const handleLogoClick = () => {
    setSelectedCategory(null);
    setActivePage('home');
    setShowLanding(true);
  };

  const handleAboutClick = () => {
    setSelectedCategory(null);
    setActivePage('about');
    setShowLanding(false);
  };

  const handleCategorySelect = (categoryId) => {
    setActivePage('home');
    setSelectedCategory(categoryId);
    setShowLanding(false);
  };

  return (
    <>
      <ParticleBackground />

      {/* Background orbs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="bg-orb absolute -top-[10%] -left-[5%] w-[500px] h-[500px]"
          style={{ background: isDark
            ? 'radial-gradient(circle, rgba(99,140,255,0.12), transparent 70%)'
            : 'radial-gradient(circle, rgba(59,108,239,0.06), transparent 70%)'
          }} />
        <div className="bg-orb absolute -bottom-[10%] -right-[5%] w-[400px] h-[400px]"
          style={{ background: isDark
            ? 'radial-gradient(circle, rgba(34,211,238,0.08), transparent 70%)'
            : 'radial-gradient(circle, rgba(14,138,160,0.04), transparent 70%)',
            animationDelay: '-7s',
          }} />
      </div>

      {/* Graph paper background (light mode only) */}
      <div className="fixed inset-0 z-0 pointer-events-none graph-paper-bg" />

      <AnimatePresence mode="wait">
        {showLanding ? (
          <motion.div
            key="landing"
            variants={pageBlurVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransitionConfig}
            className="relative z-10 w-full"
          >
            <LandingPage onExplore={() => setShowLanding(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="app-main"
            variants={pageBlurVariants}
            initial="initial"
            animate="animate"
            transition={pageTransitionConfig}
            className="relative z-10 min-h-screen flex flex-col w-full"
          >
            <Header
              onLogoClick={handleLogoClick}
              onAboutClick={handleAboutClick}
              activePage={activePage}
              isHome={!selectedCategory && activePage === 'home'}
            />

            <main className="flex-1">
              <AnimatePresence mode="wait">
                {activePage !== 'home' ? (
                  <motion.div 
                    key={activePage}
                    variants={pageBlurVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransitionConfig}
                  >
                    <About onBack={handleLogoClick} />
                  </motion.div>
                ) : selectedCategory ? (
                  <motion.div 
                    key="explorer"
                    variants={pageBlurVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransitionConfig}
                  >
                    <CorrelationExplorer
                      categoryId={selectedCategory}
                      onBack={() => setSelectedCategory(null)}
                    />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="home"
                    variants={pageBlurVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={pageTransitionConfig}
                  >

                    {/* Quick action bar */}
                    <div className="max-w-6xl mx-auto px-4 md:px-8 mb-6">
                      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.25 }}
                        className="card p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div>
                          <div className="font-display text-sm font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>
                            Feeling Lucky?
                          </div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            Jump straight into a random absurd correlation
                          </div>
                        </div>
                        <button onClick={() => {
                            const cats = [
                              'google-searches', 'planets', 'stocks', 'memes',
                              'weird', 'crime', 'death', 'baby-names', 'elections',
                              'youtube', 'occupations', 'sports', 'weather',
                              'environment', 'energy', 'films', 'food', 'education',
                            ];
                            handleCategorySelect(cats[Math.floor(Math.random() * cats.length)]);
                          }}
                          className="btn-primary px-6 py-2.5 text-sm font-display whitespace-nowrap flex items-center gap-2">
                          <Icon name="zap" size={14} color="#fff" /> Surprise Me
                        </button>
                      </motion.div>
                    </div>

                    <CategoryGrid onSelect={handleCategorySelect} />

                    {/* Bottom nudge */}
                    <div className="max-w-6xl mx-auto px-4 md:px-8 pb-8">
                      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }} className="card p-6 text-center">
                        <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                          Did you know?
                        </p>
                        <p className="text-xs max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
                          With enough data, you can "prove" almost anything correlates with anything else.
                          That's why <span className="font-medium" style={{ color: 'var(--accent)' }}>correlation does not equal causation</span> is
                          the most important rule in statistics.
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </main>

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
