"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

export function ReturnScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useMountedReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1]);
  const lightX = useTransform(scrollYProgress, [0.08, 0.72], ["-28vw", "112vw"]);
  const copyOpacity = useTransform(scrollYProgress, [0.35, 0.58], [0, 1]);
  const copyY = useTransform(scrollYProgress, [0.35, 0.58], [28, 0]);

  return (
    <section ref={ref} className="return-scene" aria-labelledby="s7">
      <div className="return-scene__sticky">
        <motion.div
          className="return-scene__media"
          style={{ scale: reduce ? 1 : imageScale }}
        >
          <StoryImage
            src={media.returnCar}
            alt="Vlasnica se vraća sivom Golfu u poslednjem svetlu dana."
            className="story-img crop-golf-return"
          />
        </motion.div>

        <span className="return-scene__grade" aria-hidden="true" />
        {!reduce && (
          <motion.span
            className="return-scene__light"
            style={{ x: lightX }}
            aria-hidden="true"
          />
        )}

        <motion.div
          className="return-scene__copy"
          style={{
            opacity: reduce ? 1 : copyOpacity,
            y: reduce ? 0 : copyY,
          }}
        >
          <p className="scene__label">Povratak pogleda</p>
          <h2 id="s7" className="return-scene__headline">
            Isti auto.
            <br />
            Drugi utisak.
          </h2>
          <p className="return-scene__note">
            Ne vraćamo vreme. Vraćamo ono što je vreme sakrilo.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
