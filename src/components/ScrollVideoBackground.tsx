"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [percent, setPercent] = useState(0);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  // Layer 1 (Background — Slowest): subtle zoom 1.0 -> 1.15 & slow vertical drift 0% -> 15%
  const bgScale = useTransform(smoothProgress, [0, 1], [1.0, 1.15]);
  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);

  // Layer 2 (Midground Ambient — Medium): -20% vertical parallax speed
  const midY = useTransform(smoothProgress, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setPercent(Math.round(v * 100));
    });
    return () => unsub();
  }, [scrollYProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let current = 0;
    let target = 0;
    let rafId = 0;

    const updateTarget = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      target = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    };

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }

      // Smooth linear interpolation (lerp) scrubbing from 0% top to 100% footer
      current += (target - current) * 0.08;
      const desiredTime = current * video.duration;

      if (Math.abs(video.currentTime - desiredTime) > 0.015) {
        video.currentTime = desiredTime;
      }
    };

    updateTarget();
    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, []);

  return (
    <>
      {/* LAYER 1: Background Scroll-Driven Video (Slowest Parallax: scale 1.0->1.15, y 0%->15%) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-obsidian overflow-hidden"
      >
        <motion.div
          style={{ scale: bgScale, y: bgY }}
          className="w-full h-full will-change-transform origin-center"
        >
          <video
            ref={videoRef}
            src="/bg-scroll.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover pointer-events-none"
          />
        </motion.div>
      </div>

      {/* Subtle Dark Radial + Linear Legibility Overlay */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(22, 10, 44, 0.50) 0%, rgba(12, 6, 26, 0.82) 100%), linear-gradient(180deg, rgba(16, 7, 32, 0.42) 0%, rgba(16, 7, 32, 0.64) 55%, rgba(12, 5, 24, 0.86) 100%)",
        }}
      />

      {/* LAYER 2: Midground Ambient Depth Layer (Medium Parallax: -20% vertical drift) */}
      <motion.div
        aria-hidden="true"
        style={{ y: midY }}
        className="fixed inset-x-0 -top-[10vh] h-[135vh] z-[2] pointer-events-none overflow-hidden will-change-transform"
      >
        {/* Subtle geometric architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
        {/* Floating blurred ambient glow orbs */}
        <div
          className="absolute top-[12%] left-[8%] w-[420px] h-[420px] rounded-full blur-[120px] opacity-25"
          style={{ background: "radial-gradient(circle, #5B21B6 0%, transparent 70%)" }}
        />
        <div
          className="absolute top-[48%] right-[6%] w-[380px] h-[380px] rounded-full blur-[120px] opacity-20"
          style={{ background: "radial-gradient(circle, #F7D046 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-[8%] left-[30%] w-[440px] h-[440px] rounded-full blur-[130px] opacity-20"
          style={{ background: "radial-gradient(circle, #7B92F8 0%, transparent 70%)" }}
        />
      </motion.div>

      {/* Minimal Vertical Scroll-Progress Indicator Bar on Screen Edge */}
      <aside
        aria-label="Progres gulir halaman"
        className="hidden sm:flex fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2.5 pointer-events-none select-none"
      >
        <div className="relative w-[2px] h-32 rounded-full bg-white/15 overflow-hidden">
          <motion.div
            style={{ scaleY: smoothProgress }}
            className="w-full h-full bg-gold origin-top shadow-[0_0_10px_#F7D046]"
          />
        </div>
        <span className="font-mono text-[10px] tracking-widest text-white/55 tabular-nums">
          {String(percent).padStart(2, "0")}%
        </span>
      </aside>
    </>
  );
}
