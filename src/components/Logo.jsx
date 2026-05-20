import React from 'react';
import logoImg from '../logo.png';

/**
 * Brand Logo Component
 * Renders the exact PNG logo image uploaded by the user.
 */
export default function Logo({ size = 56, className = '' }) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{
        width: size,
        height: size,
        transition: 'transform 0.3s ease',
      }}
    >
      <img
        src={logoImg}
        alt="DO THEY TALK logo"
        className="w-full h-full object-contain transition-all duration-300"
      />
    </div>
  );
}
