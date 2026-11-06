"use client";

import { useEffect, useRef } from "react";

const CHARS =
  "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789<>/{}[]#*=+";

/**
 * Cheap matrix rain: 2D canvas, DPR 1, ~24fps, pauses when the tab is hidden.
 * `intense` brightens the rain (the `matrix` command); otherwise it stays a
 * dim backdrop so the terminal text remains readable.
 */
export default function MatrixRain({ intense = false, light = false }: { intense?: boolean; light?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const intenseRef = useRef(intense);
  intenseRef.current = intense;
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

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden || t - last < 42) return;
      last = t;
      const hot = intenseRef.current;
      const L = lightRef.current;
      ctx.fillStyle = L ? (hot ? "rgba(236,246,238,0.10)" : "rgba(236,246,238,0.16)") : hot ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.14)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${size}px monospace`;
      for (let i = 0; i < cols; i++) {
        const y = drops[i] * size;
        const ch = CHARS[(Math.random() * CHARS.length) | 0];
        // bright head + dimmer trail from the fade above
        ctx.fillStyle = L ? (hot ? "#04561b" : "rgba(6,90,33,0.7)") : hot ? "#b6ffc9" : "rgba(120,255,160,0.55)";
        if (y > 0) ctx.fillText(ch, i * size, y);
        ctx.fillStyle = L ? (hot ? "#0a8a2e" : "rgba(10,130,45,0.45)") : hot ? "#00ff41" : "rgba(0,255,65,0.35)";
        if (y > size) ctx.fillText(CHARS[(Math.random() * CHARS.length) | 0], i * size, y - size);
        if (y > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += hot ? 1 : 0.6;
      }
    };
    if (reduce) {
      // single static frame
      for (let k = 0; k < 60; k++) draw(k * 100);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      data-ascii="skip"
      className="fixed inset-0 z-0 h-full w-full"
      style={{ opacity: intense ? (light ? 0.8 : 0.9) : light ? 0.3 : 0.35, transition: "opacity .6s" }}
    />
  );
}
