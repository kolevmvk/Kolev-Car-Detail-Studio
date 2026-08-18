"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

/**
 * Slow scroll-linked dolly-in on a full-bleed scene media block.
 * No sticky pin — the scene keeps its natural height, the frame just
 * scales gently (1 → 1.08) across the time it spends on screen.
 */
export function CameraFrame({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMountedReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <motion.div
      ref={ref}
      className="scene__media"
      style={{ scale: reduce ? 1 : scale }}
    >
      {children}
    </motion.div>
  );
}
