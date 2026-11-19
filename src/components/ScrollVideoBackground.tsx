"use client";

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const percentRef = useRef<HTMLSpanElement | null>(null);

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.002,
  });

  // Subtle GPU-friendly background scale & midground drift
  const bgScale = useTransform(smoothProgress, [0, 1], [1.0, 1.12]);
  const midY = useTransform(smoothProgress, [0, 1], ["0%", "-16%"]);

  // Zero React re-renders: update percentage text directly via ref
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (percentRef.current) {
        percentRef.current.textContent = `${String(Math.round(v * 100)).padStart(2, "0")}%`;
      }
    });
    return () => unsub();
  }, [scrollYProgress]);

  // Only start RAF video-scrubbing loop if /bg-scroll.mp4 actually loads
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let current = 0;
    let target = 0;
    let rafId = 0;
    let active = false;

    const updateTarget = () => {
      const doc = document.documentElement;
      const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
      target = Math.max(0, Math.min(1, window.scrollY / maxScroll));
    };

    const tick = () => {
      if (!active) return;
      rafId = requestAnimationFrame(tick);
      if (video.readyState < 1 || !Number.isFinite(video.duration) || video.duration <= 0) {
        return;
      }
      current += (target - current) * 0.08;
      const desiredTime = current * video.duration;
      if (Math.abs(video.currentTime - desiredTime) > 0.02) {
        video.currentTime = desiredTime;
      }
    };

    const startLoop = () => {
      if (active) return;
      active = true;
      updateTarget();
      rafId = requestAnimationFrame(tick);
    };

    video.addEventListener("loadedmetadata", startLoop);
    if (video.readyState >= 1) startLoop();

    window.addEventListener("scroll", updateTarget, { passive: true });
    window.addEventListener("resize", updateTarget);

    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      video.removeEventListener("loadedmetadata", startLoop);
      window.removeEventListener("scroll", updateTarget);
      window.removeEventListener("resize", updateTarget);
    };
  }, []);

  return (
    <>
      {/* LAYER 1: Background Scroll-Driven Video */}
      <div
        aria-hidden="true"
        className="fixed inset-0 w-full h-full z-0 pointer-events-none bg-obsidian overflow-hidden"
      >
        <motion.div
          style={{ scale: bgScale }}
          className="w-full h-full will-change-transform origin-center"
        >
          <video
            ref={videoRef}
            src="/bg-scroll.mp4"
            muted
            playsInline
            preload="metadata"
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
            "radial-gradient(ellipse 85% 65% at 50% 35%, rgba(22, 10, 44, 0.50) 0%, rgba(12, 6, 26, 0.84) 100%), linear-gradient(180deg, rgba(16, 7, 32, 0.42) 0%, rgba(16, 7, 32, 0.65) 55%, rgba(12, 5, 24, 0.88) 100%)",
        }}
      />

      {/* LAYER 2: Lightweight Midground Ambient Layer (Pure Radial Gradients — ZERO CSS filter:blur!) */}
      <motion.div
        aria-hidden="true"
        style={{ y: midY }}
        className="hidden sm:block fixed inset-x-0 -top-[8vh] h-[125vh] z-[2] pointer-events-none overflow-hidden will-change-transform"
      >
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.45) 1px, transparent 1px)",
            backgroundSize: "96px 96px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(460px circle at 14% 18%, rgba(91, 33, 182, 0.24), transparent 70%), radial-gradient(420px circle at 88% 52%, rgba(247, 208, 70, 0.14), transparent 70%), radial-gradient(480px circle at 35% 86%, rgba(123, 146, 248, 0.16), transparent 70%)",
          }}
        />
      </motion.div>

      {/* Minimal Vertical Scroll-Progress Indicator Bar */}
      <aside
        aria-label="Progres gulir halaman"
        className="hidden sm:flex fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-center gap-2.5 pointer-events-none select-none"
      >
        <div className="relative w-[2px] h-32 rounded-full bg-white/15 overflow-hidden">
          <motion.div
            style={{ scaleY: smoothProgress }}
            className="w-full h-full bg-gold origin-top"
          />
        </div>
        <span
          ref={percentRef}
          className="font-mono text-[10px] tracking-widest text-white/55 tabular-nums"
        >
          00%
        </span>
      </aside>
    </>
  );
}
