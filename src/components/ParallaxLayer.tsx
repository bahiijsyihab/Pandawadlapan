"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxLayerProps {
  children: React.ReactNode;
  offsetY?: number;
  className?: string;
}

/**
 * Lightweight staggered foreground depth parallax.
 * Automatically disables vertical transform on mobile (< 1024px) for locked 60fps touch scrolling.
 */
export function ParallaxLayer({
  children,
  offsetY = 32,
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const check = () => setEnabled(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offsetY, -offsetY]);

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
