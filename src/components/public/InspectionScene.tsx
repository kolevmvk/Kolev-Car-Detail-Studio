"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useState } from "react";
import { media } from "@/features/story/content";
import { KineticType } from "./KineticType";
import { StoryImage } from "./StoryImage";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

const headline = ["Nije starost.", "To je sloj po sloj", "svakodnevice."] as const;

export function InspectionScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useMountedReducedMotion();
  const [showCopy, setShowCopy] = useState(false);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const reveal = useTransform(
    scrollYProgress,
    [0.08, 0.72],
    ["inset(0 100% 0 0)", "inset(0 0% 0 0)"],
  );
  const beamX = useTransform(
    scrollYProgress,
    [0.06, 0.76],
    ["-24vw", "112vw"],
  );
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.18]);

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setShowCopy(progress > 0.34);
  });

  return (
    <section ref={ref} className="inspection" aria-labelledby="s3">
      <h2 id="s3" className="sr-only">
        Nije starost. To je sloj po sloj svakodnevice.
      </h2>

      <div className="inspection__sticky">
        <motion.div
          className="inspection__base"
          style={{ scale: reduce ? 1 : imageScale }}
        >
          <StoryImage
            src={media.inspectionHeadlight}
            alt="Detaljerka pregleda far sivog Golfa ručnim inspekcijskim svetlom."
            className="story-img inspection__image"
          />
        </motion.div>

        <motion.div
          className="inspection__revealed"
          style={{ clipPath: reduce ? "inset(0)" : reveal }}
          aria-hidden="true"
        >
          <StoryImage
            src={media.inspectionHeadlight}
            alt=""
            className="story-img inspection__image inspection__image--lit"
          />
        </motion.div>

        {!reduce && (
          <motion.span
            className="inspection__beam"
            style={{ x: beamX }}
            aria-hidden="true"
          />
        )}

        <span className="inspection__vignette" aria-hidden="true" />
        <span className="grain" aria-hidden="true" />

        <div className="inspection__technical" aria-hidden="true">
          <span>Pregled površine</span>
          <i />
          <span>01</span>
        </div>

        <div className="inspection__copy" data-active={showCopy || reduce}>
          <p className="inspection__label">Bočno svetlo · stvarno stanje</p>
          <KineticType
            className="inspection__headline"
            lines={headline}
            variant="odometer"
            key={showCopy || reduce ? "active" : "waiting"}
          />
          <p className="inspection__note">
            Tek kada svetlo pređe preko površine vidiš šta su godine ostavile.
          </p>
        </div>
      </div>
    </section>
  );
}
