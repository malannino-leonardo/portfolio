"use client";

import React from "react";

export const PaperImperfections: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* ========================================================================= */}
      {/* 1. REALISTIC, DIVERSE PAPER CREASES & HANDLING WRINKLES                   */}
      {/* ========================================================================= */}
      <svg
        viewBox="0 0 800 1200"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <filter id="fold-soft-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id="fold-crisp-highlight" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1" />
          </filter>
          <filter id="fold-soft-highlight" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" />
          </filter>

          {/* Linear gradients for small edge pinch facets */}
          <linearGradient id="facet-gradient-right-small" x1="100%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
            <stop offset="55%" stopColor="#664d26" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#664d26" stopOpacity="0" />
          </linearGradient>

          <linearGradient id="facet-gradient-top-small" x1="90%" y1="0%" x2="100%" y2="10%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="55%" stopColor="#553d1a" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#553d1a" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* --- MARGIN FOLD 1: Compact Right-Edge Thumb Pinch (Enhanced Visibility) --- */}
        <g opacity="1.0">
          <polygon
            points="800,520 765,570 800,630 800,520"
            fill="url(#facet-gradient-right-small)"
          />
          <path
            d="M 800,520 L 765,570 L 800,630"
            fill="none"
            stroke="rgba(75, 48, 16, 0.20)"
            strokeWidth="4.5"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 800,519 L 764,569 L 800,629"
            fill="none"
            stroke="rgba(255, 255, 255, 0.88)"
            strokeWidth="2.0"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
          <path
            d="M 800,518 L 763,568 L 800,628"
            fill="none"
            stroke="rgba(255, 255, 255, 0.50)"
            strokeWidth="3.8"
            strokeLinejoin="round"
            filter="url(#fold-soft-highlight)"
          />
          <path
            d="M 765,570 L 788,600 L 800,612"
            fill="none"
            stroke="rgba(75, 48, 16, 0.14)"
            strokeWidth="3.2"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 765,569 L 787,599 L 799,611"
            fill="none"
            stroke="rgba(255, 255, 255, 0.72)"
            strokeWidth="1.6"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
        </g>

        {/* --- MARGIN FOLD 2: Compact Top-Right Corner Fold (Enhanced Visibility) --- */}
        <g opacity="0.95">
          <polygon
            points="740,0 775,45 800,90 800,0"
            fill="url(#facet-gradient-top-small)"
          />
          <path
            d="M 740,0 L 775,45 L 800,90"
            fill="none"
            stroke="rgba(75, 48, 16, 0.18)"
            strokeWidth="4.0"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 739,0 L 774,44 L 799,89"
            fill="none"
            stroke="rgba(255, 255, 255, 0.82)"
            strokeWidth="2.0"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
        </g>

        {/* --- MARGIN FOLD 3: Compact Bottom-Right Pinch (Enhanced Visibility) --- */}
        <g opacity="0.95">
          <path
            d="M 765,1200 L 782,1140 L 800,1100"
            fill="none"
            stroke="rgba(75, 48, 16, 0.18)"
            strokeWidth="4.0"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 764,1200 L 781,1139 L 799,1099"
            fill="none"
            stroke="rgba(255, 255, 255, 0.80)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
        </g>

        {/* --- MARGIN FOLD 4: Binder Hole Pull Tension (Enhanced Visibility) --- */}
        <g opacity="0.90">
          <path
            d="M 14,480 L 55,488 L 90,484"
            fill="none"
            stroke="rgba(75, 48, 16, 0.16)"
            strokeWidth="3.6"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 14,479 L 55,487 L 90,483"
            fill="none"
            stroke="rgba(255, 255, 255, 0.75)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
        </g>

        {/* ========================================================================= */}
        {/* BALANCED MID-SHEET WRINKLES (Perfect compromise of visibility & subtlety) */}
        {/* ========================================================================= */}

        {/* --- MID-SHEET 1: Diagonal Forked Crease (~35° angle) --- */}
        <g opacity="0.8">
          <path
            d="M 530,210 L 465,280 L 385,315"
            fill="none"
            stroke="rgba(80, 55, 20, 0.11)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 530,208 L 465,278 L 385,313"
            fill="none"
            stroke="rgba(255, 255, 255, 0.62)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
          {/* Branching fork */}
          <path
            d="M 465,280 L 430,250"
            fill="none"
            stroke="rgba(80, 55, 20, 0.08)"
            strokeWidth="2.8"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 465,278 L 430,248"
            fill="none"
            stroke="rgba(255, 255, 255, 0.52)"
            strokeWidth="1.4"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
        </g>

        {/* --- MID-SHEET 2: Angular Zigzag Buckling Wrinkle --- */}
        <g opacity="0.8">
          <path
            d="M 210,570 L 285,548 L 325,595 L 405,582"
            fill="none"
            stroke="rgba(80, 55, 20, 0.11)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 210,568 L 285,546 L 325,593 L 405,580"
            fill="none"
            stroke="rgba(255, 255, 255, 0.62)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
        </g>

        {/* --- MID-SHEET 3: Angular Transverse Handling Fold (Straight faceted segments) --- */}
        <g opacity="0.75">
          <path
            d="M 330,835 L 415,860 L 495,840 L 585,862"
            fill="none"
            stroke="rgba(80, 55, 20, 0.1)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 330,833 L 415,858 L 495,838 L 585,860"
            fill="none"
            stroke="rgba(255, 255, 255, 0.58)"
            strokeWidth="1.8"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
        </g>

        {/* --- MID-SHEET 4: Triangular Apex Pinch --- */}
        <g opacity="0.75">
          <path
            d="M 185,1015 L 255,975 L 315,1005"
            fill="none"
            stroke="rgba(80, 55, 20, 0.1)"
            strokeWidth="3.2"
            strokeLinejoin="round"
            filter="url(#fold-soft-shadow)"
          />
          <path
            d="M 185,1013 L 255,973 L 315,1003"
            fill="none"
            stroke="rgba(255, 255, 255, 0.58)"
            strokeWidth="1.6"
            strokeLinejoin="round"
            filter="url(#fold-crisp-highlight)"
          />
        </g>
      </svg>

      {/* ========================================================================= */}
      {/* 2. HIGHLY VISIBLE TACTILE PAPER GRAIN & FIBER TEXTURE                     */}
      {/* ========================================================================= */}
      <svg aria-hidden="true" className="absolute inset-0 w-full h-full opacity-[0.10] mix-blend-multiply">
        <filter id="heavy-paper-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.18  0 0 0 0 0.14  0 0 0 0 0.08  0 0 0 1 0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#heavy-paper-grain)" />
      </svg>

      <svg aria-hidden="true" className="absolute inset-0 w-full h-full opacity-[0.06] mix-blend-color-burn">
        <filter id="pulp-fiber-texture">
          <feTurbulence type="turbulence" baseFrequency="0.35" numOctaves="3" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pulp-fiber-texture)" />
      </svg>

      {/* ========================================================================= */}
      {/* 3. SOFT AMBIENT SURFACE LIGHTING                                          */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 opacity-35 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 88% 50%, rgba(140, 105, 55, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 15% 40%, rgba(140, 105, 55, 0.07) 0%, transparent 40%)
          `,
        }}
      />
    </div>
  );
};
