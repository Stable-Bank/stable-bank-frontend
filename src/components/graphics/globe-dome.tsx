"use client";

import React, { useEffect, useRef } from "react";

interface GlobeDomeProps {
  className?: string;
}

export default function GlobeDome({ className = "" }: GlobeDomeProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;
    let targetTiltX = 0.35;
    let currentTiltX = 0.35;
    let isHovered = false;

    // Handle high DPI displays
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      targetTiltX = 0.35 + x * 0.15;
    };

    const onMouseEnter = () => {
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
      targetTiltX = 0.35;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseenter", onMouseEnter);
    canvas.addEventListener("mouseleave", onMouseLeave);

    // Render loop
    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      // Smooth tilt
      currentTiltX += (targetTiltX - currentTiltX) * 0.05;
      rotation += isHovered ? 0.008 : 0.004;

      const centerX = width / 2;
      const centerY = height * 0.72;
      const radius = Math.min(width * 0.42, 170);

      // 1. Draw subtle background coordinate blueprint grid
      ctx.strokeStyle = "rgba(70, 73, 214, 0.07)";
      ctx.lineWidth = 1;
      const gridSize = 20;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Draw 3D Hemisphere Dome Points and Latitudinal Curves
      const numLatitudes = 16;
      const numPointsPerLat = 48;

      for (let i = 0; i <= numLatitudes; i++) {
        const phi = (i / numLatitudes) * (Math.PI / 2); // 0 (top) to PI/2 (base)
        const latRadius = radius * Math.sin(phi);
        const yPos = -radius * Math.cos(phi);

        // Latitude ring base ellipse
        ctx.beginPath();
        for (let j = 0; j <= numPointsPerLat; j++) {
          const theta = (j / numPointsPerLat) * Math.PI * 2 + rotation;
          
          // 3D rotation projection
          const x3d = latRadius * Math.cos(theta);
          const z3d = latRadius * Math.sin(theta);
          
          // Isometric projection with tilt
          const projX = centerX + x3d;
          const projY = centerY + yPos * Math.cos(currentTiltX) + z3d * Math.sin(currentTiltX);

          // Alpha fade for depth
          const depthAlpha = ((z3d / radius) + 1) / 2; // 0 (back) to 1 (front)
          const baseAlpha = Math.max(0.15, Math.min(0.9, 0.2 + depthAlpha * 0.75));

          // Draw small coordinate particle dot
          const dotSize = 0.8 + depthAlpha * 0.9;
          
          // Color: Electric Cyan / Royal Indigo / Volt Accent
          if ((i + j) % 9 === 0) {
            // Glowing node point
            ctx.fillStyle = `rgba(176, 190, 25, ${baseAlpha * 1.2})`; // Volt Lime accent
            ctx.fillRect(projX - dotSize, projY - dotSize, dotSize * 2, dotSize * 2);
          } else if ((i + j) % 4 === 0) {
            ctx.fillStyle = `rgba(59, 130, 246, ${baseAlpha})`; // Bright Blue
            ctx.fillRect(projX - dotSize * 0.7, projY - dotSize * 0.7, dotSize * 1.4, dotSize * 1.4);
          } else {
            ctx.fillStyle = `rgba(70, 73, 214, ${baseAlpha * 0.85})`; // Royal Indigo
            ctx.fillRect(projX - dotSize * 0.5, projY - dotSize * 0.5, dotSize, dotSize);
          }
        }
      }

      // 3. Draw Longitude Arc Ribs
      const numLongitudes = 12;
      for (let l = 0; l < numLongitudes; l++) {
        const theta = (l / numLongitudes) * Math.PI * 2 + rotation;
        
        ctx.beginPath();
        let started = false;
        
        for (let i = 0; i <= numLatitudes; i++) {
          const phi = (i / numLatitudes) * (Math.PI / 2);
          const latRadius = radius * Math.sin(phi);
          const yPos = -radius * Math.cos(phi);

          const x3d = latRadius * Math.cos(theta);
          const z3d = latRadius * Math.sin(theta);

          const projX = centerX + x3d;
          const projY = centerY + yPos * Math.cos(currentTiltX) + z3d * Math.sin(currentTiltX);

          if (!started) {
            ctx.moveTo(projX, projY);
            started = true;
          } else {
            ctx.lineTo(projX, projY);
          }
        }

        const arcAlpha = Math.max(0.04, 0.1 + ((Math.sin(theta) + 1) / 2) * 0.15);
        ctx.strokeStyle = `rgba(59, 130, 246, ${arcAlpha})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // 4. Base equator boundary ring
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radius, radius * Math.sin(currentTiltX), 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(70, 73, 214, 0.25)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseenter", onMouseEnter);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`relative w-full h-[220px] sm:h-[250px] overflow-hidden rounded-2xl bg-gradient-to-b from-[#F3F7FF] via-[#F8FAFF] to-white border border-blue-100/80 shadow-inner flex items-center justify-center ${className}`}>
      {/* Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#EEF8A8]/30 rounded-full blur-xl pointer-events-none" />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair relative z-10"
      />
    </div>
  );
}
