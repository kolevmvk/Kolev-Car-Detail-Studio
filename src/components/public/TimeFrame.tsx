"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";

/**
 * SCENE 02 — VREME (Time).
 *
 * The same grey Golf dissolves from road/memory into parking lot/routine.
 * The car never changes — only its context does, communicating the slow
 * accumulation of ordinary time.
 *
 * Year markers appear one at a time in a single position (bottom-right),
 * like a documentary timestamp. They are atmosphere, not a timeline widget.
 *
 * Desktop: sticky pinned scene for 250vh of scrolling with Framer dissolve.
 * Mobile: two sequential 100/72dvh beats — no dissolve, no markers.
 * Reduced motion: static parking frame, no year markers.
 */
export function TimeScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Parking (later state) dissolves over the road (memory) as scroll progresses
  const interiorOpacity = useTransform(scrollYProgress, [0.12, 0.58], [0, 1]);

  // Year markers: one at a time, same position, like a documentary counter
  const y0op = useTransform(scrollYProgress, [0.0, 0.07, 0.2, 0.28], [0, 0.9, 0.9, 0]);
  const y1op = useTransform(scrollYProgress, [0.24, 0.31, 0.44, 0.52], [0, 0.9, 0.9, 0]);
  const y2op = useTransform(scrollYProgress, [0.48, 0.55, 0.68, 0.76], [0, 0.9, 0.9, 0]);
  const y3op = useTransform(scrollYProgress, [0.72, 0.8, 1.0, 1.0], [0, 0.9, 0.9, 0.9]);
  const yearOps = [y0op, y1op, y2op, y3op];

  // Copy fades in near end of dissolve
  const copyOp = useTransform(scrollYProgress, [0.68, 0.82], [0, 1]);
  const copyShift = useTransform(scrollYProgress, [0.68, 0.82], [20, 0]);

  return (
    <section ref={ref} className="scene scene--time" aria-labelledby="s-time">
      <div className="time__sticky">
        <div className="time__media">
          {/* Road / memory — the car when it still had presence */}
          <StoryImage
            src={media.timeExterior}
            alt="Sivi Golf na putu kroz brda — kakav je bio dok si ga još gledao."
            className="story-img crop-golf-time"
          />

          {/* Parking / routine — same car, time has passed */}
          <motion.div
            className="time__interior"
            style={{ opacity: reduce ? 1 : interiorOpacity }}
          >
            <StoryImage
              src={media.timeInterior}
              alt="Isti Golf parkiran — svakodnevica koja postepeno skriva sjaj."
              className="story-img crop-golf-time"
            />
          </motion.div>

          <span className="grain" aria-hidden="true" />

          {/* Documentary year counter — hidden on mobile */}
          {!reduce && ["2015", "2018", "2021", "2026"].map((year, i) => (
            <motion.span
              key={year}
              className="time__year"
              style={{ opacity: yearOps[i] }}
              aria-hidden="true"
            >
              {year}
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

      {/* Mobile: second sequential beat — same car, later moment */}
      <div className="time__mobile-beat" aria-hidden="true">
        <div className="time__media">
          <StoryImage
            src={media.timeInterior}
            alt=""
            className="story-img crop-golf-time"
          />
          <span className="grain" />
        </div>
      </div>
    </section>
  );
}
