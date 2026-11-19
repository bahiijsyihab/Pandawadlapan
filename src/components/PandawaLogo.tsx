"use client";

import React from "react";

export type LogoLayer = "triangle" | "branches" | "monogram" | null;

interface PandawaLogoProps {
  className?: string;
  activeLayer?: LogoLayer;
  variant?: "full" | "compact" | "monochrome";
}

/**
 * Official PANDAWA geometric ribbon paths (exact 60° equilateral inverted triangle):
 * - Piece A: Top horizontal bar + Right descending arm + Inner V chevron
 * - Piece B: Lower-left diagonal leg forming the main bottom apex
 */
const PIECE_A =
  "M 36,64 L 324,64 L 215,253 L 143,128 L 185,128 L 214,178 L 258,102 L 58,102 Z";
const PIECE_B = "M 73,128 L 117,128 L 202,275 L 180,313 Z";

export function PandawaLogo({
  className = "w-10 h-10",
  activeLayer = null,
  variant = "full",
}: PandawaLogoProps) {
  const isDimmed = (layer: Exclude<LogoLayer, null>) =>
    activeLayer !== null && activeLayer !== layer;
  const isHighlighted = (layer: Exclude<LogoLayer, null>) =>
    activeLayer === layer;

  if (variant === "compact") {
    return (
      <svg
        viewBox="0 0 360 360"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        aria-label="Logo Resmi PANDAWA"
      >
        <defs>
          <linearGradient id="pd-ribbon-a-sm" x1="36" y1="64" x2="324" y2="260" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="62%" stopColor="#F3EEFF" />
            <stop offset="100%" stopColor="#F7D046" />
          </linearGradient>
          <linearGradient id="pd-ribbon-b-sm" x1="73" y1="128" x2="202" y2="313" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="70%" stopColor="#E9D5FF" />
            <stop offset="100%" stopColor="#C58BF2" />
          </linearGradient>
        </defs>
        <path
          d={PIECE_A}
          fill="url(#pd-ribbon-a-sm)"
          stroke="#F7D046"
          strokeOpacity="0.45"
          strokeWidth="3"
          strokeLinejoin="miter"
        />
        <path
          d={PIECE_B}
          fill="url(#pd-ribbon-b-sm)"
          stroke="#FFFFFF"
          strokeOpacity="0.35"
          strokeWidth="2.5"
          strokeLinejoin="miter"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 360 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Logo Interaktif Resmi PANDAWA Pasukan Angkatan 8 MA"
    >
      <defs>
        <linearGradient id="pd-gold-frame" x1="28" y1="54" x2="332" y2="326" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF2BF" />
          <stop offset="50%" stopColor="#F7D046" />
          <stop offset="100%" stopColor="#C99A1A" />
        </linearGradient>
        <linearGradient id="pd-ribbon-a" x1="36" y1="64" x2="324" y2="253" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="52%" stopColor="#F5F3FF" />
          <stop offset="100%" stopColor="#FBE38A" />
        </linearGradient>
        <linearGradient id="pd-ribbon-b" x1="73" y1="128" x2="180" y2="313" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="65%" stopColor="#EDE9FE" />
          <stop offset="100%" stopColor="#C58BF2" />
        </linearGradient>
        <linearGradient id="pd-gold-fill" x1="36" y1="64" x2="324" y2="313" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF3C4" />
          <stop offset="50%" stopColor="#F7D046" />
          <stop offset="100%" stopColor="#D4A017" />
        </linearGradient>
        <linearGradient id="pd-channel" x1="60" y1="115" x2="250" y2="265" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#5CE1E6" />
          <stop offset="55%" stopColor="#7B92F8" />
          <stop offset="100%" stopColor="#F7D046" />
        </linearGradient>
        <filter id="pd-glow-gold" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="pd-glow-aqua" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* LAYER 1: Bentuk Segitiga Terbalik (Outer Architectural Prism Aura) */}
      <g
        style={{
          transition: "opacity 320ms ease, transform 320ms ease",
          opacity: isDimmed("triangle") ? 0.2 : 1,
          transformOrigin: "180px 180px",
          transform: isHighlighted("triangle") ? "scale(1.035)" : "scale(1)",
        }}
        filter={isHighlighted("triangle") ? "url(#pd-glow-gold)" : undefined}
      >
        <polygon
          points="180,334 18,54 342,54"
          fill="rgba(91, 33, 182, 0.22)"
          stroke="url(#pd-gold-frame)"
          strokeOpacity={isHighlighted("triangle") ? 0.95 : 0.35}
          strokeWidth={isHighlighted("triangle") ? 3.5 : 1.6}
          strokeLinejoin="round"
        />
        {/* Corner precision ticks */}
        <circle cx="18" cy="54" r={isHighlighted("triangle") ? 4.5 : 2.8} fill="#F7D046" />
        <circle cx="342" cy="54" r={isHighlighted("triangle") ? 4.5 : 2.8} fill="#F7D046" />
        <circle cx="180" cy="334" r={isHighlighted("triangle") ? 5 : 3} fill="#F7D046" />
      </g>

      {/* LAYER 2: Garis Bercabang-cabang (Precision Negative-Space Channels) */}
      <g
        style={{
          transition: "opacity 320ms ease, transform 320ms ease",
          opacity: isDimmed("branches") ? 0.16 : isHighlighted("branches") ? 1 : 0.55,
          transformOrigin: "180px 175px",
          transform: isHighlighted("branches") ? "scale(1.02)" : "scale(1)",
        }}
        filter={isHighlighted("branches") ? "url(#pd-glow-aqua)" : undefined}
      >
        <g
          stroke="url(#pd-channel)"
          strokeWidth={isHighlighted("branches") ? 3.4 : 1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Horizontal branching channel between top bar and lower limbs */}
          <path d="M 64,115 L 238,115" />
          {/* Diagonal branching channel separating Piece B and Piece A */}
          <path d="M 130,115 L 210,254" />
          {/* Inner-V converging branch */}
          <path d="M 214,115 L 214,158" />
        </g>
        {[
          [64, 115],
          [130, 115],
          [214, 115],
          [238, 115],
          [210, 254],
        ].map(([cx, cy], idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={isHighlighted("branches") ? 4.2 : 2.4}
            fill={idx % 2 === 0 ? "#5CE1E6" : "#F7D046"}
          />
        ))}
      </g>

      {/* LAYER 3: Official Interlocking PANDAWA Monogram Ribbons (P & D) */}
      <g
        style={{
          transition: "opacity 320ms ease, transform 320ms ease",
          opacity: isDimmed("monogram") ? 0.35 : 1,
          transformOrigin: "180px 180px",
          transform: isHighlighted("monogram") ? "scale(1.04)" : "scale(1)",
        }}
        filter={isHighlighted("monogram") ? "url(#pd-glow-gold)" : undefined}
      >
        {/* Subtle 3D drop shadow layer */}
        <g transform="translate(0, 6)" opacity="0.32">
          <path d={PIECE_A} fill="#160A2C" />
          <path d={PIECE_B} fill="#160A2C" />
        </g>

        {/* Piece A: Top + Right Arm + Inner V */}
        <path
          d={PIECE_A}
          fill={isHighlighted("monogram") ? "url(#pd-gold-fill)" : "url(#pd-ribbon-a)"}
          stroke={isHighlighted("monogram") ? "#FFF5CC" : "#F7D046"}
          strokeOpacity={isHighlighted("monogram") ? 0.95 : 0.45}
          strokeWidth="2"
          strokeLinejoin="miter"
        />

        {/* Piece B: Left Diagonal Stem to Main Apex */}
        <path
          d={PIECE_B}
          fill={isHighlighted("monogram") ? "url(#pd-gold-fill)" : "url(#pd-ribbon-b)"}
          stroke="#FFFFFF"
          strokeOpacity={isHighlighted("monogram") ? 0.9 : 0.45}
          strokeWidth="2"
          strokeLinejoin="miter"
        />

        {/* Subtle Apple-style specular glass top highlight */}
        <path
          d="M 41,68 L 316,68 L 311,76 L 46,76 Z"
          fill="#FFFFFF"
          fillOpacity="0.45"
        />
      </g>
    </svg>
  );
}
