import React from 'react';

export default function Footer() {
  return (
    <footer className="text-center py-8 px-4" style={{ borderTop: '1px solid var(--border)' }}>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        Data from{' '}
        <a href="https://data.worldbank.org/" target="_blank" rel="noopener noreferrer"
          className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>World Bank</a>
        {' | '}
        <a href="https://api.nasa.gov/" target="_blank" rel="noopener noreferrer"
          className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>NASA</a>
        {' | '}
        <a href="https://www.frankfurter.app/" target="_blank" rel="noopener noreferrer"
          className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>Frankfurter</a>
        {' | '}
        <span className="font-medium" style={{ color: 'var(--accent)' }}>Independent public-source snapshots</span>
        <br />
        <span className="font-medium" style={{ color: 'var(--pink)' }}>
          The model cleans, aligns, and calculates every visible score locally.
        </span>
      </p>
    </footer>
  );
}
