import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="card p-8 text-center">
        <div className="h-3 w-48 rounded mx-auto mb-4 skeleton-shimmer" />
        <div className="h-20 w-56 rounded-lg mx-auto mb-3 skeleton-shimmer" />
        <div className="h-5 w-40 rounded mx-auto mb-2 skeleton-shimmer" />
        <div className="h-3 w-64 rounded mx-auto skeleton-shimmer" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="card px-4 py-5">
            <div className="h-5 w-16 rounded mx-auto mb-2 skeleton-shimmer" />
            <div className="h-3 w-20 rounded mx-auto skeleton-shimmer" />
          </div>
        ))}
      </div>
      <div className="card p-6">
        <div className="h-4 w-40 rounded mb-5 skeleton-shimmer" />
        <div className="h-[320px] rounded-lg flex items-center justify-center skeleton-shimmer">
          <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-sm font-mono">Fetching live data...</span>
          </div>
        </div>
      </div>
    </div>
  );
}
