"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

/**
 * Wraps a full-bleed media block and drifts it at a different rate than the
 * page scrolls — real depth on every photo scene, not just the two WebGL
 * ones. The inner layer is oversized (bled beyond the frame) so the drift
 * never exposes an edge; `strength` (in %) controls how far it travels.
 */
export function Parallax({
  children,
  strength = 10,
}: {
  children: React.ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMountedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  const bleed = 100 + strength * 4;
  const topOffset = -(strength * 2);

  return (
    <div ref={ref} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <motion.div
        style={{
          position: "relative",
          height: `${bleed}%`,
          width: "100%",
          top: `${topOffset}%`,
          y: reduce ? 0 : y,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
