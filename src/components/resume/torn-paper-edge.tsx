"use client";

import React, { useMemo } from "react";

type HoleType = "intact" | "slit-thin" | "slit-angled" | "open-notch" | "open-wide" | "chad";

interface HoleConfig {
  id: number;
  type: HoleType;
  chadPoints?: string;
}

// 18 deterministic hole configurations accurately replicating real spiral notebook paper
const HOLE_CONFIGS: HoleConfig[] = [
  { id: 0, type: "open-notch" }, // Top hole ripped open
  { id: 1, type: "intact" },
  { id: 2, type: "intact" },
  { id: 3, type: "slit-angled" }, // Angled rip breaking the circle
  { id: 4, type: "intact" },
  { id: 5, type: "intact" },
  { id: 6, type: "slit-thin" }, // Straight slit breaking the circle
  { id: 7, type: "intact" },
  { id: 8, type: "chad", chadPoints: "M 3,9 L 8,6.5 L 7,11 Z" }, // Slit with dangling paper tooth
  { id: 9, type: "intact" },
  { id: 10, type: "open-wide" }, // Deep notch where outer bridge was torn away
  { id: 11, type: "open-notch" },
  { id: 12, type: "intact" },
  { id: 13, type: "slit-angled" },
  { id: 14, type: "intact" },
  { id: 15, type: "slit-thin" },
  { id: 16, type: "intact" },
  { id: 17, type: "open-notch" }, // Bottom hole ripped open
];

export const BinderHolesStrip: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute left-0 top-0 bottom-0 w-8 sm:w-10 flex flex-col justify-between py-6 sm:py-8 pointer-events-none select-none z-10"
    >
      {HOLE_CONFIGS.map((hole) => (
        <div key={hole.id} className="relative w-full h-7 sm:h-8 flex items-center">
          <svg
            viewBox="0 0 28 26"
            className="w-full h-full overflow-visible"
            preserveAspectRatio="xMinYMid meet"
          >
            <defs>
              <filter id={`hole-shadow-${hole.id}`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.4" />
              </filter>
            </defs>

            {/* 1. INTACT HOLE: Clean unbroken circle */}
            {hole.type === "intact" && (
              <circle
                cx="14"
                cy="13"
                r="7.5"
                className="fill-background stroke-[#cbbe9f] transition-colors"
                strokeWidth="0.85"
                filter={`url(#hole-shadow-${hole.id})`}
              />
            )}

            {/* 2. STRAIGHT SLIT TEAR: Breaks the circle open with continuous tear lines */}
            {hole.type === "slit-thin" && (
              <g>
                {/* Exposed raw pulp fiber line on upper tear rim */}
                <path d="M 0,11.5 L 5,11 L 8.5,10.2" stroke="#fffdf0" strokeWidth="1.3" fill="none" opacity="0.9" />
                {/* Continuous broken cutout (no full circle line) */}
                <path
                  d="M 0,11.5 L 5,11 L 8.5,10.2 A 7.5 7.5 0 1 1 8.5,15.8 L 5,15 L 0,14.5 Z"
                  className="fill-background stroke-[#cbbe9f] transition-colors"
                  strokeWidth="0.85"
                  filter={`url(#hole-shadow-${hole.id})`}
                />
              </g>
            )}

            {/* 3. ANGLED SLIT TEAR: Diagonal rip cleanly opening the hole circumference */}
            {hole.type === "slit-angled" && (
              <g>
                <path d="M 0,8.5 L 4.5,10 L 8,11" stroke="#fffdf0" strokeWidth="1.3" fill="none" opacity="0.9" />
                <path
                  d="M 0,8.5 L 4.5,10 L 8,11 A 7.5 7.5 0 1 1 9.5,17.2 L 5,15 L 0,13.5 Z"
                  className="fill-background stroke-[#cbbe9f] transition-colors"
                  strokeWidth="0.85"
                  filter={`url(#hole-shadow-${hole.id})`}
                />
              </g>
            )}

            {/* 4. OPEN U-NOTCH: Outer paper bridge ripped completely away */}
            {hole.type === "open-notch" && (
              <g>
                <path d="M 0,6 Q 4.5,6.8 9,7.8 A 7.5 7.5 0 1 1 9,18.2 Q 4.5,19.2 0,20" stroke="#fffdf0" strokeWidth="1.4" fill="none" opacity="0.9" />
                <path
                  d="M 0,6 Q 4.5,6.8 9,7.8 A 7.5 7.5 0 1 1 9,18.2 Q 4.5,19.2 0,20 Z"
                  className="fill-background stroke-[#cbbe9f] transition-colors"
                  strokeWidth="0.85"
                  filter={`url(#hole-shadow-${hole.id})`}
                />
              </g>
            )}

            {/* 5. DEEP WIDE NOTCH: Heavy spiral tear */}
            {hole.type === "open-wide" && (
              <g>
                <path d="M 0,4 L 6,5.8 L 10.5,7.2 A 7.8 7.8 0 1 1 10.5,18.8 L 6,20.2 L 0,22" stroke="#fffdf0" strokeWidth="1.5" fill="none" opacity="0.9" />
                <path
                  d="M 0,4 L 6,5.8 L 10.5,7.2 A 7.8 7.8 0 1 1 10.5,18.8 L 6,20.2 L 0,22 Z"
                  className="fill-background stroke-[#cbbe9f] transition-colors"
                  strokeWidth="0.9"
                  filter={`url(#hole-shadow-${hole.id})`}
                />
              </g>
            )}

            {/* 6. SLIT WITH DANGLING PAPER CHAD: Open tear + loose paper tag */}
            {hole.type === "chad" && (
              <g>
                <path d="M 0,11 L 4.5,10.5 L 8.2,10.2" stroke="#fffdf0" strokeWidth="1.3" fill="none" opacity="0.9" />
                <path
                  d="M 0,11 L 4.5,10.5 L 8.2,10.2 A 7.5 7.5 0 1 1 8.2,15.8 L 4.5,15.5 L 0,15 Z"
                  className="fill-background stroke-[#cbbe9f] transition-colors"
                  strokeWidth="0.85"
                  filter={`url(#hole-shadow-${hole.id})`}
                />
                {hole.chadPoints && (
                  <path
                    d={hole.chadPoints}
                    fill="#ede4cc"
                    stroke="#c4b697"
                    strokeWidth="0.7"
                    className="drop-shadow-xs"
                  />
                )}
              </g>
            )}
          </svg>
        </div>
      ))}
    </div>
  );
};

// Generate a deterministic, multi-frequency randomized polygon clip-path for the left edge of the paper
export function useRippedPaperClipPath() {
  return useMemo(() => {
    let seed = 45678;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    const totalSteps = 100;
    const leftPoints: string[] = [];

    for (let i = 0; i <= totalSteps; i++) {
      const pct = (i / totalSteps) * 100;
      const macro = Math.sin(i * 0.1) * 2.0;
      const micro = (random() - 0.5) * 2.8;
      const x = Math.max(0.5, Math.min(6, 3.0 + macro + micro));
      leftPoints.push(`${x.toFixed(1)}px ${pct.toFixed(2)}%`);
    }

    const reversedLeft = [...leftPoints].reverse();
    return `polygon(100% 0%, 100% 100%, ${reversedLeft.join(", ")})`;
  }, []);
}
