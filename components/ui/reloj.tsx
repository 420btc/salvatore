'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

interface WatchInternalsProps {
  size?: number;
  className?: string;
}

const WatchInternals: React.FC<WatchInternalsProps> = ({
  size = 400,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  const drawGear = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    teeth: number,
    rotation: number,
    color: string = '#2a2a2a'
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    
    const innerRadius = radius * 0.7;
    const toothHeight = radius * 0.3;
    
    ctx.beginPath();
    for (let i = 0; i < teeth; i++) {
      const angle = (i / teeth) * Math.PI * 2;
      const nextAngle = ((i + 1) / teeth) * Math.PI * 2;
      
      // Outer tooth
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      const x2 = Math.cos(angle + (nextAngle - angle) * 0.3) * (radius + toothHeight);
      const y2 = Math.sin(angle + (nextAngle - angle) * 0.3) * (radius + toothHeight);
      const x3 = Math.cos(angle + (nextAngle - angle) * 0.7) * (radius + toothHeight);
      const y3 = Math.sin(angle + (nextAngle - angle) * 0.7) * (radius + toothHeight);
      const x4 = Math.cos(nextAngle) * radius;
      const y4 = Math.sin(nextAngle) * radius;
      
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
      
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
    }
    ctx.closePath();
    
    // Gradient for metallic effect
    const gradient = ctx.createRadialGradient(0, 0, innerRadius, 0, 0, radius + toothHeight);
    gradient.addColorStop(0, '#4a4a4a');
    gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, '#1a1a1a');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Inner circle
    ctx.beginPath();
    ctx.arc(0, 0, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    
    // Center hole
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a0a';
    ctx.fill();
    
    ctx.restore();
  }, []);

  const drawSpring = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    coils: number,
    compression: number
  ) => {
    ctx.save();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const actualHeight = height * compression;
    const coilHeight = actualHeight / coils;
    
    for (let i = 0; i <= coils * 20; i++) {
      const t = i / (coils * 20);
      const springX = x + Math.sin(t * coils * Math.PI * 2) * width / 2;
      const springY = y + t * actualHeight;
      
      if (i === 0) ctx.moveTo(springX, springY);
      else ctx.lineTo(springX, springY);
    }
    
    ctx.stroke();
    ctx.restore();
  }, []);

  const drawJewel = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    color: string = '#ff4444'
  ) => {
    ctx.save();
    ctx.translate(x, y);
    
    // Jewel facets
    const facets = 8;
    ctx.beginPath();
    for (let i = 0; i < facets; i++) {
      const angle = (i / facets) * Math.PI * 2;
      const x1 = Math.cos(angle) * radius;
      const y1 = Math.sin(angle) * radius;
      
      if (i === 0) ctx.moveTo(x1, y1);
      else ctx.lineTo(x1, y1);
    }
    ctx.closePath();
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, color + '88');
    gradient.addColorStop(1, color + '22');
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Highlight
    ctx.beginPath();
    ctx.arc(-radius * 0.3, -radius * 0.3, radius * 0.4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
    
    ctx.restore();
  }, []);

  const drawEscapement = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number
  ) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Escape wheel
    const radius = 25;
    const teeth = 15;
    
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      const x1 = Math.cos(a) * radius;
      const y1 = Math.sin(a) * radius;
      const x2 = Math.cos(a) * (radius + 8);
      const y2 = Math.sin(a) * (radius + 8);
      
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
    
    ctx.stroke();
    
    // Center
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#2a2a2a';
    ctx.fill();
    
    // Pallet fork
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-40, -5);
    ctx.lineTo(40, 5);
    ctx.stroke();
    
    ctx.restore();
  }, []);

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = size / 2;
    const centerY = size / 2;
    
    // Clear canvas with dark background
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, size, size);
    
    // Time-based rotations
    const seconds = currentTime.getSeconds();
    const minutes = currentTime.getMinutes();
    const hours = currentTime.getHours() % 12;
    const milliseconds = currentTime.getMilliseconds();
    
    const secondAngle = ((seconds + milliseconds / 1000) / 60) * Math.PI * 2;
    const minuteAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2;
    const hourAngle = ((hours + minutes / 60) / 12) * Math.PI * 2;
    
    // Main gear train
    drawGear(ctx, centerX, centerY, 60, 12, hourAngle * 12, '#3a3a3a'); // Hour wheel
    drawGear(ctx, centerX + 80, centerY - 40, 40, 8, -minuteAngle * 8, '#4a4a4a'); // Minute wheel
    drawGear(ctx, centerX - 70, centerY + 50, 35, 10, secondAngle * 10, '#5a5a5a'); // Second wheel
    
    // Additional gears for complexity
    drawGear(ctx, centerX + 120, centerY + 80, 30, 6, -secondAngle * 6, '#444');
    drawGear(ctx, centerX - 100, centerY - 80, 25, 8, secondAngle * 4, '#555');
    drawGear(ctx, centerX + 40, centerY + 120, 20, 5, -minuteAngle * 15, '#666');
    
    // Mainspring barrel
    ctx.save();
    ctx.translate(centerX - 120, centerY);
    ctx.beginPath();
    ctx.arc(0, 0, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#2a2a2a';
    ctx.fill();
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Spring coils inside barrel
    for (let i = 1; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(0, 0, i * 7, 0, Math.PI * 2);
      ctx.strokeStyle = '#666';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
    
    // Balance wheel
    ctx.save();
    ctx.translate(centerX + 130, centerY - 100);
    ctx.rotate(Math.sin(secondAngle * 8) * 0.3); // Oscillating motion
    
    // Balance wheel rim
    ctx.beginPath();
    ctx.arc(0, 0, 35, 0, Math.PI * 2);
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Spokes
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 35, Math.sin(angle) * 35);
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    // Center hub
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.restore();
    
    // Hairspring
    ctx.save();
    ctx.translate(centerX + 130, centerY - 100);
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    for (let i = 0; i < 100; i++) {
      const t = i / 100;
      const spiralRadius = t * 20 + 5;
      const spiralAngle = t * Math.PI * 8 + Math.sin(secondAngle * 8) * 0.1;
      const x = Math.cos(spiralAngle) * spiralRadius;
      const y = Math.sin(spiralAngle) * spiralRadius;
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
    
    // Escapement
    drawEscapement(ctx, centerX + 80, centerY + 40, secondAngle * 15);
    
    // Jewels
    drawJewel(ctx, centerX - 40, centerY - 40, 6, '#ff4444');
    drawJewel(ctx, centerX + 60, centerY - 80, 5, '#4444ff');
    drawJewel(ctx, centerX - 80, centerY + 20, 4, '#44ff44');
    drawJewel(ctx, centerX + 100, centerY + 60, 5, '#ff44ff');
    
    // Springs
    const springCompression = 0.7 + Math.sin(secondAngle * 4) * 0.2;
    drawSpring(ctx, centerX - 150, centerY + 80, 20, 60, 8, springCompression);
    drawSpring(ctx, centerX + 160, centerY + 20, 15, 40, 6, springCompression);
    
    // Screws and details
    const screwPositions = [
      [centerX - 160, centerY - 120],
      [centerX + 160, centerY - 120],
      [centerX - 160, centerY + 140],
      [centerX + 160, centerY + 140]
    ];
    
    screwPositions.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#333';
      ctx.fill();
      
      // Screw slot
      ctx.beginPath();
      ctx.moveTo(x - 3, y);
      ctx.lineTo(x + 3, y);
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    
    // Bridges and plates
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    // Main plate outline
    ctx.beginPath();
    ctx.roundRect(centerX - 170, centerY - 140, 340, 280, 20);
    ctx.stroke();
    
    // Bridge outlines
    ctx.beginPath();
    ctx.roundRect(centerX - 50, centerY - 100, 100, 80, 10);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.roundRect(centerX + 60, centerY + 20, 80, 60, 8);
    ctx.stroke();
    
    ctx.setLineDash([]);
    
    // Engraving-style text
    ctx.fillStyle = '#666';
    ctx.font = '10px serif';
    ctx.textAlign = 'center';
    ctx.fillText('SWISS MADE', centerX, centerY + 160);
    ctx.fillText('21 JEWELS', centerX, centerY + 175);
    
  }, [currentTime, size, drawGear, drawSpring, drawJewel, drawEscapement]);

  const animate = useCallback(() => {
    setCurrentTime(new Date());
    render();
    animationRef.current = requestAnimationFrame(animate);
  }, [render]);

  useEffect(() => {
    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate]);

  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 30% 30%, rgba(40,40,40,0.9) 0%, rgba(10,10,10,0.95) 100%)',
        border: '8px solid #d97706',
        boxShadow: isHovered 
          ? 'inset 0 0 50px rgba(0,0,0,0.8), 0 0 30px rgba(217, 119, 6, 0.6)'
          : 'inset 0 0 30px rgba(0,0,0,0.6), 0 0 20px rgba(217, 119, 6, 0.4)',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {/* Glass reflection effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          borderRadius: '50%',
        }}
      />
      
      {/* Inner bezel */}
      <div
        className="absolute inset-2 pointer-events-none"
        style={{
          borderRadius: '50%',
          border: '2px solid #92400e',
          boxShadow: 'inset 0 0 10px rgba(217, 119, 6, 0.3)',
        }}
      />
      
      {/* Movement canvas */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
      
      {/* Time display */}
      <motion.div
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'rgba(0,0,0,0.8)',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
      >
        {currentTime.toLocaleTimeString()}
      </motion.div>
    </div>
  );
};

export default function WatchInternalsDemo() {
  return (
    <div className="flex items-center justify-center">
      <WatchInternals size={300} />
    </div>
  );
}
