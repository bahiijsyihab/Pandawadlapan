"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface ParallaxLayerProps {
  children: React.ReactNode;
  offsetY?: number;
  className?: string;
}

/**
 * Staggered foreground depth parallax layer.
 * Translates smoothly from [+offsetY] to [-offsetY] as the element travels through the viewport.
 */
export function ParallaxLayer({
  children,
  offsetY = 40,
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offsetY, -offsetY]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
