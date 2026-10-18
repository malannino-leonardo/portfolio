"use client";

import React, { useRef, useEffect } from "react";
import { useMousePosition } from "@/utils/mouse";
import { cn } from "@/lib/utils";
import { usePerformance } from "@/hooks/use-performance";

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  hasSpikes: boolean;
  dx: number;
  dy: number;
  parallaxFactor: number;
}

export default function Particles({
  className = "",
  quantity = 1600,
  staticity = 45,
  ease = 35,
  refresh = false,
}: ParticlesProps) {
  const { isLowPowerMode } = usePerformance();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);

  const starsRef = useRef<Star[]>([]);
  const galaxyBackdropCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const mousePosition = useMousePosition();
  const mouse = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseTarget = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, 2) : 1;

  const effectiveQuantity = isLowPowerMode ? 700 : quantity;

  useEffect(() => {
    if (canvasRef.current) {
      context.current = canvasRef.current.getContext("2d");
    }
    initCanvas();
    let animationFrameId: number;

    const render = (time: number) => {
      animate(time);
      animationFrameId = window.requestAnimationFrame(render);
    };

    animationFrameId = window.requestAnimationFrame(render);

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [isLowPowerMode, effectiveQuantity, refresh]);

  useEffect(() => {
    onMouseMove();
  }, [mousePosition.x, mousePosition.y]);

  const onMouseMove = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const { w, h } = canvasSize.current;
      const x = mousePosition.x - rect.left - w / 2;
      const y = mousePosition.y - rect.top - h / 2;
      const inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
      if (inside) {
        mouseTarget.current.x = x;
        mouseTarget.current.y = y;
      }
    }
  };

  const createGalaxyBackdrop = (w: number, h: number) => {
    const offscreen = document.createElement("canvas");
    offscreen.width = w;
    offscreen.height = h;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return null;

    // 1. Ultra-deep pitch cosmic void
    offCtx.fillStyle = "#010206";
    offCtx.fillRect(0, 0, w, h);

    const cx = w * 0.5;
    const cy = h * 0.5;

    // 2. Diffuse Galactic Core Glow (warm silver, neutral cream, faint violet halo)
    // Core bulge
    const coreBulge = offCtx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.28);
    coreBulge.addColorStop(0, "rgba(235, 230, 240, 0.40)");
    coreBulge.addColorStop(0.15, "rgba(210, 195, 215, 0.32)");
    coreBulge.addColorStop(0.35, "rgba(130, 120, 150, 0.18)");
    coreBulge.addColorStop(0.65, "rgba(45, 40, 65, 0.08)");
    coreBulge.addColorStop(1, "rgba(0, 0, 0, 0)");

    offCtx.save();
    offCtx.translate(cx, cy);
    offCtx.scale(1.9, 0.85);
    offCtx.fillStyle = coreBulge;
    offCtx.beginPath();
    offCtx.arc(0, 0, h * 0.28, 0, Math.PI * 2);
    offCtx.fill();
    offCtx.restore();

    // 3. Horizontal Milky Way Disc Band (spanning the full width)
    const discGlow = offCtx.createLinearGradient(0, cy - h * 0.16, 0, cy + h * 0.16);
    discGlow.addColorStop(0, "rgba(0, 0, 0, 0)");
    discGlow.addColorStop(0.25, "rgba(80, 75, 105, 0.09)");
    discGlow.addColorStop(0.45, "rgba(180, 175, 200, 0.22)");
    discGlow.addColorStop(0.50, "rgba(215, 210, 230, 0.28)");
    discGlow.addColorStop(0.55, "rgba(175, 170, 195, 0.22)");
    discGlow.addColorStop(0.75, "rgba(70, 65, 95, 0.08)");
    discGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

    offCtx.fillStyle = discGlow;
    offCtx.fillRect(0, cy - h * 0.16, w, h * 0.32);

    // Fade disc towards screen borders horizontally
    const hMask = offCtx.createLinearGradient(0, 0, w, 0);
    hMask.addColorStop(0, "rgba(1, 2, 6, 0.65)");
    hMask.addColorStop(0.18, "rgba(1, 2, 6, 0.0)");
    hMask.addColorStop(0.82, "rgba(1, 2, 6, 0.0)");
    hMask.addColorStop(1, "rgba(1, 2, 6, 0.65)");
    offCtx.fillStyle = hMask;
    offCtx.fillRect(0, 0, w, h);

    // 4. Photorealistic Dark Dust Rifts (Dark Horse / Great Rift silhouette)
    // Dark nebula absorbs the light in complex filaments through the core
    const dustCount = isLowPowerMode ? 45 : 110;
    for (let i = 0; i < dustCount; i++) {
      // Clustered along center with organic branching
      const offsetX = cx + (Math.random() - 0.5) * (w * 0.58);
      const distFromCenter = Math.abs(offsetX - cx) / (w * 0.29);
      const verticalSpread = (h * 0.065) * (1 - distFromCenter * 0.4);
      const offsetY = cy + (Math.random() - 0.5) * verticalSpread;

      const radX = 18 + Math.random() * 55;
      const radY = 4 + Math.random() * 16;
      const rot = (Math.random() - 0.5) * 0.35;

      const alpha = 0.22 + Math.random() * 0.42;

      const dustGrad = offCtx.createRadialGradient(offsetX, offsetY, 0, offsetX, offsetY, radX);
      dustGrad.addColorStop(0, `rgba(1, 2, 6, ${alpha})`);
      dustGrad.addColorStop(0.55, `rgba(8, 7, 10, ${alpha * 0.7})`);
      dustGrad.addColorStop(1, "rgba(1, 2, 6, 0)");

      offCtx.save();
      offCtx.translate(offsetX, offsetY);
      offCtx.rotate(rot);
      offCtx.scale(1, radY / radX);
      offCtx.fillStyle = dustGrad;
      offCtx.beginPath();
      offCtx.arc(0, 0, radX, 0, Math.PI * 2);
      offCtx.fill();
      offCtx.restore();
    }

    // 5. Magellanic Clouds (LMC & SMC satellite galaxies on lower right)
    // LMC (Large Magellanic Cloud)
    const lmcX = cx + w * 0.29;
    const lmcY = cy + h * 0.21;
    const lmcGrad = offCtx.createRadialGradient(lmcX, lmcY, 0, lmcX, lmcY, 38);
    lmcGrad.addColorStop(0, "rgba(190, 195, 215, 0.28)");
    lmcGrad.addColorStop(0.4, "rgba(130, 135, 160, 0.14)");
    lmcGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    offCtx.save();
    offCtx.translate(lmcX, lmcY);
    offCtx.scale(1.2, 0.9);
    offCtx.fillStyle = lmcGrad;
    offCtx.beginPath();
    offCtx.arc(0, 0, 38, 0, Math.PI * 2);
    offCtx.fill();
    offCtx.restore();

    // SMC (Small Magellanic Cloud)
    const smcX = cx + w * 0.21;
    const smcY = cy + h * 0.26;
    const smcGrad = offCtx.createRadialGradient(smcX, smcY, 0, smcX, smcY, 22);
    smcGrad.addColorStop(0, "rgba(180, 185, 210, 0.22)");
    smcGrad.addColorStop(0.5, "rgba(120, 125, 150, 0.10)");
    smcGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

    offCtx.save();
    offCtx.translate(smcX, smcY);
    offCtx.scale(1.1, 0.8);
    offCtx.fillStyle = smcGrad;
    offCtx.beginPath();
    offCtx.arc(0, 0, 22, 0, Math.PI * 2);
    offCtx.fill();
    offCtx.restore();

    // 6. Dense Procedural Micro-Star Dust layer baked into backdrop for performance
    const microStarCount = isLowPowerMode ? 1400 : 3800;
    for (let i = 0; i < microStarCount; i++) {
      let sx: number;
      let sy: number;

      // Heavy concentration in the central disc
      if (Math.random() < 0.72) {
        sx = Math.random() * w;
        const norm = (Math.random() - 0.5) + (Math.random() - 0.5) + (Math.random() - 0.5);
        sy = cy + norm * (h * 0.08);
      } else {
        sx = Math.random() * w;
        sy = Math.random() * h;
      }

      if (sy < 0 || sy > h) continue;

      const alpha = 0.18 + Math.random() * 0.65;
      const size = 0.4 + Math.random() * 0.65;

      const cRand = Math.random();
      let colorStr = "255, 255, 255";
      if (cRand < 0.25) colorStr = "215, 230, 255";
      else if (cRand < 0.45) colorStr = "245, 235, 220";

      offCtx.fillStyle = `rgba(${colorStr}, ${alpha})`;
      offCtx.beginPath();
      offCtx.arc(sx, sy, size, 0, Math.PI * 2);
      offCtx.fill();
    }

    return offscreen;
  };

  const initCanvas = () => {
    if (!canvasContainerRef.current || !canvasRef.current || !context.current) return;

    const w = canvasContainerRef.current.offsetWidth;
    const h = canvasContainerRef.current.offsetHeight;

    canvasSize.current.w = w;
    canvasSize.current.h = h;

    canvasRef.current.width = w * dpr;
    canvasRef.current.height = h * dpr;
    canvasRef.current.style.width = `${w}px`;
    canvasRef.current.style.height = `${h}px`;

    galaxyBackdropCanvasRef.current = createGalaxyBackdrop(w, h);

    // Active foreground/midground twinkling stars
    const stars: Star[] = [];
    const count = effectiveQuantity;
    const cy = h * 0.5;

    for (let i = 0; i < count; i++) {
      let x = Math.random() * w;
      let y: number;

      // 60% bias along the galactic plane
      if (Math.random() < 0.60) {
        const norm = (Math.random() - 0.5) + (Math.random() - 0.5);
        y = cy + norm * (h * 0.14);
        if (y < 0 || y > h) y = Math.random() * h;
      } else {
        y = Math.random() * h;
      }

      const sizeRand = Math.random();
      let size = 0.5 + Math.random() * 0.8;
      let hasSpikes = false;

      // Prominent bright anchor stars like in the reference image
      if (sizeRand > 0.992) {
        size = 1.9 + Math.random() * 1.3;
        hasSpikes = !isLowPowerMode;
      } else if (sizeRand > 0.94) {
        size = 1.2 + Math.random() * 0.6;
      }

      const colorRoll = Math.random();
      let color = "rgba(255, 255, 255, "; // crisp silver white
      if (colorRoll < 0.25) {
        color = "rgba(200, 225, 255, "; // subtle celestial ice-blue
      } else if (colorRoll < 0.40) {
        color = "rgba(255, 235, 215, "; // soft warm starlight
      } else if (colorRoll < 0.50) {
        color = "rgba(225, 215, 245, "; // pale violet
      }

      stars.push({
        x,
        y,
        size,
        baseAlpha: 0.35 + Math.random() * 0.65,
        twinkleSpeed: 0.0012 + Math.random() * 0.0035,
        twinklePhase: Math.random() * Math.PI * 2,
        color,
        hasSpikes,
        dx: (Math.random() - 0.5) * 0.04,
        dy: (Math.random() - 0.5) * 0.04,
        parallaxFactor: 0.2 + Math.random() * 0.75,
      });
    }

    starsRef.current = stars;
  };

  const animate = (time: number) => {
    const ctx = context.current;
    if (!ctx) return;

    const { w, h } = canvasSize.current;
    if (w === 0 || h === 0) return;

    // Smooth mouse parallax interpolation
    mouse.current.x += (mouseTarget.current.x - mouse.current.x) / ease;
    mouse.current.y += (mouseTarget.current.y - mouse.current.y) / ease;

    ctx.save();
    ctx.scale(dpr, dpr);

    // 1. Draw procedural Galactic Panorama backdrop
    if (galaxyBackdropCanvasRef.current) {
      const pX = -(mouse.current.x / staticity) * 0.14;
      const pY = -(mouse.current.y / staticity) * 0.14;
      ctx.drawImage(galaxyBackdropCanvasRef.current, pX, pY, w, h);
    } else {
      ctx.fillStyle = "#010206";
      ctx.fillRect(0, 0, w, h);
    }

    // 2. Draw twinkling stars
    const stars = starsRef.current;
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];

      const sineVal = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      const curAlpha = Math.max(0.12, Math.min(1, star.baseAlpha + sineVal * 0.26));

      const posX = star.x + (mouse.current.x / staticity) * star.parallaxFactor;
      const posY = star.y + (mouse.current.y / staticity) * star.parallaxFactor;

      star.x += star.dx;
      star.y += star.dy;

      if (star.x < 0) star.x = w;
      if (star.x > w) star.x = 0;
      if (star.y < 0) star.y = h;
      if (star.y > h) star.y = 0;

      // Glow halo for prominent stars
      if (star.size > 1.3) {
        const glowRad = star.size * 3.8;
        const glowGrad = ctx.createRadialGradient(posX, posY, 0, posX, posY, glowRad);
        glowGrad.addColorStop(0, star.color + (curAlpha * 0.55) + ")");
        glowGrad.addColorStop(1, star.color + "0)");
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(posX, posY, glowRad, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4-point diffraction spikes for anchor stars (like bright Sirius/Vega in the reference)
      if (star.hasSpikes && curAlpha > 0.45) {
        ctx.strokeStyle = star.color + (curAlpha * 0.5) + ")";
        ctx.lineWidth = 0.7;
        const spikeLen = star.size * 5.2;

        ctx.beginPath();
        ctx.moveTo(posX - spikeLen, posY);
        ctx.lineTo(posX + spikeLen, posY);
        ctx.moveTo(posX, posY - spikeLen);
        ctx.lineTo(posX, posY + spikeLen);
        ctx.stroke();
      }

      // Star core
      ctx.fillStyle = star.color + curAlpha + ")";
      ctx.beginPath();
      ctx.arc(posX, posY, star.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };

  return (
    <div
      className={cn(className, "w-full h-full bg-[#010206]")}
      ref={canvasContainerRef}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
