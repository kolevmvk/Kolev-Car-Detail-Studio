"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";

/**
 * Scroll-linked dissolve: exterior work → interior work.
 * Communicates that both surfaces accumulate grime with time and use.
 * Mobile: two sequential frames, each with its own copy beat.
 * Reduced motion: shows the interior frame statically.
 */
export function TimeFrame() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const wornOpacity = useTransform(scrollYProgress, [0.12, 0.62], [0, 1]);

  return (
    <section ref={ref} className="time" aria-labelledby="act-time">
      <div className="time__sticky">
        <div className="time__media">
          <StoryImage
            src={media.timeExterior}
            alt="Rotaciona mašina na bočnoj ploči — spoljašnjost dobija pažnju."
            className="story-img time__new"
          />
          <motion.div
            className="time__worn-layer"
            style={{ opacity: reduce ? 1 : wornOpacity }}
          >
            <StoryImage
              src={media.timeInterior}
              alt="Brisanje plastike unutar auta — ni enterijer nije čekao."
              className="story-img"
            />
          </motion.div>
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="time__copy">
          <p id="act-time" className="display display--sm">
            Nije se promenilo odjednom.
          </p>
          <p className="lede">Samo si prestao da primećuješ.</p>
        </div>
      </div>
      <div className="time__mobile-next">
        <div className="frame__media">
          <StoryImage
            src={media.timeInterior}
            alt="Unutrašnjost auta se briše — ni enterijer nije čekao."
            className="story-img"
          />
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="frame__caption">
          <p className="lede">Iznutra i spolja. Oboje čeka.</p>
        </div>
      </div>
    </section>
  );
}
