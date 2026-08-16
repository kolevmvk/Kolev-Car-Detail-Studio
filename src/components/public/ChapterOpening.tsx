"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ScenePlaceholder } from "./ScenePlaceholder";

export function ChapterOpening() {
  const shouldReduce = useReducedMotion();

  const textIn = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 32 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduce ? 0 : 1,
        delay: shouldReduce ? 0 : 0.3 + i * 0.15,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    }),
  };

  return (
    <section
      className="chapter relative flex flex-col"
      style={{
        minHeight: "100dvh",
        background: "var(--color-surface-0)",
      }}
      aria-label="Uvod — kada je bio nov"
    >
      {/* Full-bleed scene — car in near-darkness */}
      <div className="absolute inset-0">
        <ScenePlaceholder
          variant="dark"
          label="fotografija: auto, bok, pravo — čist"
          className="w-full h-full"
          aspectRatio="auto"
        />
        {/* Gradient veil so text sits cleanly over the image */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, #0d0d0d 0%, #0d0d0d80 40%, transparent 75%)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Content — bottom anchored for maximum composition impact */}
      <div className="relative z-10 flex flex-col justify-end flex-1 px-5 pb-12 md:px-12 md:pb-16 lg:px-20 lg:pb-20">
        <div className="max-w-screen-lg">
          <motion.p
            className="font-mono text-xs tracking-widest uppercase mb-6 opacity-50"
            style={{ color: "var(--color-text-primary-dark)" }}
            initial="hidden"
            animate="visible"
            custom={0}
            variants={textIn}
          >
            Kolev Car Detailing — Negotin
          </motion.p>

          <h1
            className="font-display font-semibold leading-none mb-8"
            style={{
              fontSize: "clamp(2.75rem, 9vw, 7.5rem)",
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary-dark)",
            }}
          >
            {["Sećaš se kako", "je izgledao", "kada si ga", "stvarno gledao?"].map(
              (line, i) => (
                <motion.span
                  key={i}
                  className="block"
                  initial="hidden"
                  animate="visible"
                  custom={i + 1}
                  variants={textIn}
                >
                  {line}
                </motion.span>
              ),
            )}
          </h1>

          <motion.p
            className="font-sans font-light text-base md:text-lg max-w-sm"
            style={{ color: "var(--color-text-muted)" }}
            initial="hidden"
            animate="visible"
            custom={5}
            variants={textIn}
          >
            Nije uvek izgledao umorno.
          </motion.p>
        </div>

        {/* Scroll cue — no animation, pure CSS */}
        <motion.div
          className="absolute bottom-8 right-6 md:right-12 lg:right-20 flex flex-col items-center gap-2"
          initial="hidden"
          animate="visible"
          custom={6}
          variants={textIn}
          aria-hidden="true"
        >
          <div
            className="w-px h-10"
            style={{ background: "var(--color-text-muted)", opacity: 0.4 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
