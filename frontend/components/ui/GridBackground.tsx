"use client";

import React from 'react';

export const GridBackground = () => {
  return (
    <div 
      className="fixed inset-0 z-[-1] pointer-events-none" 
      style={{ 
        backgroundImage: `linear-gradient(#f1f5f9 1px, transparent 1px), linear-gradient(90deg, #f1f5f9 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse at center, black, transparent 90%)'
      }} 
    />
  );
};
