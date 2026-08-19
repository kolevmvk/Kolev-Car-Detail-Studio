"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

export function DetailingWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useMountedReducedMotion();
  const isInView = useInView(ref, { amount: 0.08 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 28%"],
  });

  const polishMask = useTransform(
    scrollYProgress,
    [0.08, 0.72],
    ["inset(0 0 0 100%)", "inset(0 0 0 0)"],
  );
  const lightX = useTransform(
    scrollYProgress,
    [0.05, 0.78],
    ["112vw", "-20vw"],
  );
  const cutScale = useTransform(scrollYProgress, [0.12, 0.68], [0, 1]);
  const polisherX = useTransform(
    scrollYProgress,
    [0.02, 0.82],
    ["88vw", "-34vw"],
  );
  const polisherY = useTransform(scrollYProgress, [0.02, 0.42, 0.82], [18, -6, 14]);
  const polisherOpacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.72, 0.88],
    [0, 1, 1, 0],
  );
  const flashOpacity = useTransform(
    scrollYProgress,
    [0.62, 0.72, 0.79, 0.9],
    [0, 0, 0.95, 0],
  );
  const flashScale = useTransform(scrollYProgress, [0.72, 0.84], [1.015, 1]);

  return (
    <div
      ref={ref}
      className="detailing-wordmark"
          data-active={isInView}
      role="img"
      aria-label="Kolev Car Detailing"
    >
      <span className="detailing-wordmark__matte" aria-hidden="true">
        KOLEV
      </span>
      <motion.span
        className="detailing-wordmark__polished"
        style={{ clipPath: reduce ? "inset(0)" : polishMask }}
        aria-hidden="true"
      >
        KOLEV
      </motion.span>
      {!reduce && (
        <motion.span
          className="detailing-wordmark__flash"
          style={{ opacity: flashOpacity, scale: flashScale }}
          aria-hidden="true"
        >
          KOLEV
        </motion.span>
      )}
      {!reduce && (
        <>
          <motion.span
            className="detailing-wordmark__inspection"
            style={{ x: lightX }}
            aria-hidden="true"
          />
          <motion.span
            className="detailing-wordmark__polisher"
            style={{ x: polisherX, y: polisherY, opacity: polisherOpacity }}
            aria-hidden="true"
          >
            <Image
              src="/story/polisher-transparent.webp"
              alt=""
              fill
              sizes="(max-width: 767px) 52vw, 25vw"
              className="detailing-wordmark__polisher-image"
            />
          </motion.span>
        </>
      )}
      <motion.span
        className="detailing-wordmark__surface-cut"
        style={{ scaleX: reduce ? 1 : cutScale }}
        aria-hidden="true"
      />
      <span className="detailing-wordmark__signature" aria-hidden="true">
        Car detailing studio · Negotin
      </span>
    </div>
  );
}
