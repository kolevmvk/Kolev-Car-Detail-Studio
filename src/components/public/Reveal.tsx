"use client";

import { motion } from "framer-motion";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

/**
 * Masked type reveal — the block rises into view from behind an overflow
 * clip, re-triggering every time it crosses into view (either scroll
 * direction), so the page keeps feeling alive on repeat visits/scroll-back,
 * not just on first descent. "Text entering only after visual evidence is
 * understood" per docs/MOTION.md: used on copy-only beats, never on the
 * spatial WebGL scenes (their overlay is already driven by GSAP scroll
 * progress) or TimeScene (already has its own scrollYProgress transform).
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useMountedReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={`reveal-mask ${className ?? ""}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        whileInView={{ y: "0%", opacity: 1 }}
        viewport={{ once: false, margin: "-10% 0px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
