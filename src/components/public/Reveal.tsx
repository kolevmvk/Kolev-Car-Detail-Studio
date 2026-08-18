"use client";

import { motion } from "framer-motion";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

/**
 * Masked type reveal — the block rises into view from behind an overflow
 * clip, once, on scroll-in. "Text entering only after visual evidence is
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
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
