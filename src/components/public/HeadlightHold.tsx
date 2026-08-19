"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";

/**
 * Press-and-hold editorial visualization using a generated, matched camera
 * position. It demonstrates the interaction without claiming a customer case.
 */
export function HeadlightHold() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [revealing, setRevealing] = useState(false);

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    setRevealing(true);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([10, 20, 10]);
    }
  };

  const stopReveal = () => setRevealing(false);

  return (
    <div className="hold-root">
      <button
        ref={buttonRef}
        type="button"
        className="hold-reveal"
        aria-describedby="hold-hint"
        aria-label="Pritisni i drži da vidiš rezultat restauracije fara"
        onPointerDown={handlePointerDown}
        onPointerUp={stopReveal}
        onPointerCancel={stopReveal}
        onKeyDown={(event) => {
          if (event.key === " " || event.key === "Enter") setRevealing(true);
        }}
        onKeyUp={(event) => {
          if (event.key === " " || event.key === "Enter") stopReveal();
        }}
        data-revealing={revealing}
      >
        <span className="hold-reveal__frame">
          <StoryImage
            src={media.compareBefore}
            alt="Zamućen far pre restauracije."
            className="story-img"
            loading="eager"
            unoptimized
          />
          <span className="hold-reveal__state hold-reveal__state--before" aria-hidden="true">
            Stanje
          </span>
          <motion.span
            className="hold-reveal__after"
            aria-hidden="true"
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{
              clipPath: revealing ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
            }}
            transition={{
              duration: revealing ? 0.72 : 0.46,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <StoryImage
              src={media.compareAfter}
              alt=""
              className="story-img"
              loading="eager"
              unoptimized
            />
            <span className="hold-reveal__state hold-reveal__state--after">
              Rezultat
            </span>
          </motion.span>
          <span className="hold-reveal__edge" aria-hidden="true" />
        </span>
        <span id="hold-hint" className="hold-reveal__hint">
          {revealing ? "Pusti · vrati stanje" : "Drži · vidi rezultat"}
        </span>
      </button>

      <div className="hold-static">
        <figure className="hold-static__shot">
          <span className="hold-static__media">
            <StoryImage
              src={media.compareBefore}
              alt="Zamućen far pre restauracije."
              className="story-img"
            />
          </span>
          <figcaption>Stanje</figcaption>
        </figure>
        <figure className="hold-static__shot">
          <span className="hold-static__media">
            <StoryImage
              src={media.compareAfter}
              alt="Far posle restauracije."
              className="story-img"
            />
          </span>
          <figcaption>Rezultat</figcaption>
        </figure>
      </div>
    </div>
  );
}
