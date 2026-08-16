"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";

const YEARS = [
  { label: "2015", cls: "time__year--tl" },
  { label: "2018", cls: "time__year--tr" },
  { label: "2021", cls: "time__year--bl" },
  { label: "2026", cls: "time__year--br" },
] as const;

/**
 * SCENE 02 — VREME (Time).
 *
 * Scroll-linked dissolve: exterior work fades into interior work.
 * Year markers appear/disappear as the user scrolls through the scene,
 * communicating time passing without a timeline component.
 *
 * Desktop: sticky pinned scene for 250vh of scrolling.
 * Mobile: two sequential 72dvh beats (exterior then interior).
 * Reduced motion: static interior frame, no markers.
 */
export function TimeScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const interiorOpacity = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);

  const y0op = useTransform(scrollYProgress, [0.0, 0.08, 0.22, 0.3], [0, 1, 1, 0]);
  const y1op = useTransform(scrollYProgress, [0.25, 0.33, 0.47, 0.55], [0, 1, 1, 0]);
  const y2op = useTransform(scrollYProgress, [0.5, 0.58, 0.7, 0.78], [0, 1, 1, 0]);
  const y3op = useTransform(scrollYProgress, [0.73, 0.82, 1.0, 1.0], [0, 1, 1, 1]);
  const yearOps = [y0op, y1op, y2op, y3op];

  const copyOp = useTransform(scrollYProgress, [0.68, 0.82], [0, 1]);
  const copyShift = useTransform(scrollYProgress, [0.68, 0.82], [20, 0]);

  return (
    <section ref={ref} className="scene scene--time" aria-labelledby="s-time">
      {/* Sticky layer: pinned on desktop, natural height on mobile */}
      <div className="time__sticky">
        <div className="time__media">
          <StoryImage
            src={media.timeExterior}
            alt="Sivi Golf na putu kroz brda — kakav je bio dok si ga još gledao."
            className="story-img crop-golf-opening"
          />

          <motion.div
            className="time__interior"
            style={{ opacity: reduce ? 1 : interiorOpacity }}
          >
            <StoryImage
              src={media.timeInterior}
              alt="Isti Golf parkiran — svakodnevica koja postepeno skriva sjaj."
              className="story-img crop-golf-parked"
            />
          </motion.div>

          <span className="grain" aria-hidden="true" />

          {/* Year markers — communicates time passing without a timeline */}
          {!reduce &&
            YEARS.map(({ label, cls }, i) => (
              <motion.span
                key={label}
                className={`time__year ${cls}`}
                style={{ opacity: yearOps[i] }}
                aria-hidden="true"
              >
                {label}
              </motion.span>
            ))}
        </div>

        <motion.div
          className="time__copy"
          style={{
            opacity: reduce ? 1 : copyOp,
            y: reduce ? 0 : copyShift,
          }}
        >
          <p id="s-time" className="scene__headline">
            Nije se promenio
            <br />
            odjednom.
          </p>
          <p className="scene__note">Samo si prestao da primećuješ.</p>
        </motion.div>
      </div>

      {/* Mobile-only second beat: interior frame */}
      <div className="time__mobile-beat" aria-hidden="true">
        <div className="time__media">
          <StoryImage
            src={media.timeInterior}
            alt=""
            className="story-img crop-golf-parked"
          />
          <span className="grain" />
        </div>
        <div className="time__copy">
          <p className="scene__note">Iznutra i spolja. Oboje čeka.</p>
        </div>
      </div>
    </section>
  );
}
