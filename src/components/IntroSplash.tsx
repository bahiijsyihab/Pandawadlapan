"use client";

import React, { useEffect, useState } from "react";
import { PandawaLogo } from "./PandawaLogo";

export function IntroSplash() {
  const [phase, setPhase] = useState<"enter" | "exit" | "done">("enter");

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const exitTimer = window.setTimeout(() => setPhase("exit"), 3600);
    const doneTimer = window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = prevOverflow;
    }, 4350);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  const handleSkip = () => {
    setPhase("exit");
    window.setTimeout(() => {
      setPhase("done");
      document.body.style.overflow = "";
    }, 650);
  };

  if (phase === "done") return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Pembuka PANDAWA"
      className={`fixed inset-0 z-[100] bg-obsidian text-white flex flex-col justify-between p-6 sm:p-10 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
        phase === "exit" ? "-translate-y-full pointer-events-none" : "translate-y-0"
      }`}
    >
      {/* Subtle architectural grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Top Row: Brand Stamp + Skip */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <PandawaLogo variant="compact" className="w-8 h-8" />
          <span className="text-xs font-medium tracking-widest text-white/70 uppercase">
            PANDAWA • Angkatan 8
          </span>
        </div>

        <button
          type="button"
          onClick={handleSkip}
          className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/55 hover:text-gold transition-colors px-3 py-1.5 rounded-lg border border-white/10 hover:border-gold/40"
        >
          Lewati →
        </button>
      </div>

      {/* Center Editorial Typography Sequence */}
      <div className="relative z-10 mx-auto max-w-4xl w-full text-center sm:text-left px-2">
        <div className="space-y-3 sm:space-y-4">
          {/* Line 1 */}
          <div className="overflow-hidden">
            <p
              className="font-display text-3xl sm:text-5xl lg:text-6xl text-white leading-[1.12] tracking-[-0.03em] animate-intro-line"
              style={{ animationDelay: "180ms" }}
            >
              Ciee yang abis ke Bandung
            </p>
          </div>

          {/* Line 2 */}
          <div className="overflow-hidden">
            <p
              className="font-serif italic text-3xl sm:text-5xl lg:text-6xl text-gold leading-[1.15] animate-intro-line"
              style={{ animationDelay: "850ms" }}
            >
              pada jedag jedug basis cihuyy
            </p>
          </div>

          {/* Hairline rule + Line 3 */}
          <div className="pt-4 sm:pt-6">
            <div
              className="h-px bg-white/15 w-full origin-left animate-intro-rule"
              style={{ animationDelay: "1500ms" }}
            />
            <div className="overflow-hidden pt-4 sm:pt-5 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <p
                className="font-display text-2xl sm:text-4xl lg:text-5xl text-white/95 tracking-[-0.03em] animate-intro-line"
                style={{ animationDelay: "1750ms" }}
              >
                Selamat datang.
              </p>
              <span
                className="font-mono text-xs tracking-[0.22em] text-white/50 uppercase animate-intro-line"
                style={{ animationDelay: "2100ms" }}
              >
                United in Trust, Stronger Together
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Hairline Progress Bar */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="h-[1px] w-full bg-white/10 overflow-hidden">
          <div className="h-full bg-gold origin-left animate-intro-progress" />
        </div>
      </div>
    </div>
  );
}
