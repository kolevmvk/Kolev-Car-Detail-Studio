"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ScenePlaceholder } from "./ScenePlaceholder";

export function ChapterReturn() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-15% 0px" });
  const shouldReduce = useReducedMotion();

  const fadeIn = (delay: number) => ({
    hidden: { opacity: 0, y: shouldReduce ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduce ? 0 : 1,
        delay: shouldReduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  });

  return (
    <section
      ref={ref}
      className="chapter relative flex flex-col"
      style={{
        minHeight: "85dvh",
        background: "var(--color-surface-0)",
      }}
      aria-label="Povratak — isti auto, drugi utisak"
    >
      {/* Full-bleed scene — mirrors Act 1 but lighter (the reveal) */}
      <div className="absolute inset-0">
        <ScenePlaceholder
          variant="reveal"
          label="fotografija: auto, bok, pravo — posle restauracije"
          className="w-full h-full"
          aspectRatio="auto"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0d0d0d 0%, #0d0d0d60 35%, transparent 70%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content — bottom anchored, mirrors opening composition */}
      <div className="relative z-10 flex flex-col justify-end flex-1 px-5 pb-14 md:px-12 md:pb-20 lg:px-20">
        <div className="max-w-screen-lg">
          <motion.h2
            className="font-display font-semibold leading-none mb-6"
            style={{
              fontSize: "clamp(3rem, 10vw, 8rem)",
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary-dark)",
              maxWidth: "12ch",
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn(0.1)}
          >
            Isti auto.
            <br />
            <span style={{ color: "var(--color-accent)" }}>Drugi utisak.</span>
          </motion.h2>

          <motion.p
            className="font-sans font-light text-base md:text-lg"
            style={{
              color: "var(--color-text-muted)",
              maxWidth: "40ch",
              lineHeight: "1.6",
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={fadeIn(0.3)}
          >
            Ne vraćamo vreme. Vraćamo ono što je vreme sakrilo.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
