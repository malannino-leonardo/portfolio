"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789<>/{}[]#*=+";

/**
 * Matrix rain easter egg: 2D canvas, DPR 1, ~24fps, pauses when the tab is hidden.
 * Off by default; the `matrix` command toggles `active`. While inactive nothing
 * is drawn (the loop is not even scheduled) and the canvas fades out.
 */
export default function MatrixRain({ active = false, light = false }: { active?: boolean; light?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const lightRef = useRef(light);
  lightRef.current = light;

  // Repaint immediately on theme change so the old theme's trails never linger.
  useEffect(() => {
    const c = ref.current;
    const x = c?.getContext("2d");
    if (c && x) {
      x.fillStyle = light ? "#ecf6ee" : "#000";
      x.fillRect(0, 0, c.width, c.height);
    }
  }, [light]);

  useEffect(() => {
    if (!active) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const size = 16;
    let cols = 0;
    let drops: number[] = [];
    let raf = 0;
    let last = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      cols = Math.ceil(canvas.width / size);
      drops = Array.from({ length: cols }, () => Math.random() * -50);
      ctx.fillStyle = lightRef.current ? "#ecf6ee" : "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const step = () => {
      const L = lightRef.current;
      ctx.fillStyle = L ? "rgba(236,246,238,0.10)" : "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${size}px monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size;
        // bright head + dimmer trail from the fade above
        ctx.fillStyle = L ? "#04561b" : "#b6ffc9";
        if (y > 0) ctx.fillText(CHARS[(Math.random() * CHARS.length) | 0], i * size, y);
        ctx.fillStyle = L ? "#0a8a2e" : "#00ff41";
        if (y > size) ctx.fillText(CHARS[(Math.random() * CHARS.length) | 0], i * size, y - size);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    };

    if (reduce) {
      // single static frame
      for (let k = 0; k < 60; k++) step();
    } else {
      const draw = (t: number) => {
        raf = requestAnimationFrame(draw);
        if (document.hidden || t - last < 42) return;
        last = t;
        step();
      };
      raf = requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [active]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-ascii="skip"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{ opacity: active ? (light ? 0.8 : 0.9) : 0, transition: "opacity .6s" }}
    />
  );
}
