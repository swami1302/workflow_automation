"use client";

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const MouseTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  
  // Only enable trail on marketing/public pages
  const allowedPaths = ['/', '/features', '/about'];
  const isEnabled = allowedPaths.includes(pathname);

  useEffect(() => {
    if (!isEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const points: { x: number; y: number; age: number }[] = [];
    const maxAge = 40;

    const handleMouseMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY, age: 0 });
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw the trail
      if (points.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length; i++) {
          const p = points[i];
          const opacity = 1 - p.age / maxAge;
          ctx.strokeStyle = `rgba(255, 69, 0, ${opacity * 0.5})`;
          ctx.lineWidth = opacity * 4;
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
        }
      }

      // Update points
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].age++;
        if (points[i].age > maxAge) {
          points.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isEnabled, pathname]);

  if (!isEnabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ position: 'fixed', top: 0, left: 0 }}
    />
  );
};
