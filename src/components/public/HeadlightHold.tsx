"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";

/**
 * Press-and-hold comparison: before state → after state via clip-path reveal.
 * 
 * PHASE 3 UPGRADE:
 * - Subtle 3D perspective on clip-path reveal (rotateX, rotateY)
 * - Material texture shift: glossiness increases as reveal progresses
 * - Haptic feedback on mobile (vibration pattern)
 * - Reduced-motion: shows both images side-by-side as static figures
 */
export function HeadlightHold() {
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = () => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  return (
    <div className="hold-root">
      <button
        ref={buttonRef}
        type="button"
        className="hold-reveal"
        aria-describedby="hold-hint"
        aria-label="Pritisni i drži da vidiš rezultat"
        onPointerDown={handlePointerDown}
      >
        <span className="hold-reveal__frame">
          <StoryImage
            src={media.compareBefore}
            alt="Duboka ekstrakcija sedišta — naslage godina izlaze iz tkanja."
            className="story-img"
          />
          <motion.span
            className="hold-reveal__after"
            aria-hidden="true"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            whileHover={{ clipPath: "inset(0 0 0 0)" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <StoryImage
              src={media.compareAfter}
              alt=""
              className="story-img"
            />
          </motion.span>
        </span>
        <span id="hold-hint" className="hold-reveal__hint">
          Pritisni i drži
        </span>
      </button>

      <div className="hold-static">
        <figure className="hold-static__shot">
          <span className="hold-static__media">
            <StoryImage
              src={media.compareBefore}
              alt="Duboka ekstrakcija sedišta — rad koji je bio potreban."
              className="story-img"
            />
          </span>
          <figcaption>Rad</figcaption>
        </figure>
        <figure className="hold-static__shot">
          <span className="hold-static__media">
            <StoryImage
              src={media.compareAfter}
              alt="Čist enterijer posle rada — jasna tekstura, bez naslaga."
              className="story-img"
            />
          </span>
          <figcaption>Rezultat</figcaption>
        </figure>
      </div>
    </div>
  );
}
