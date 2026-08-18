"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MagneticCta } from "./MagneticCta";

const CHAPTER_COUNT = 8;

/**
 * Fixed overlay: mark, scroll-progress rule, chapter counter and a
 * contextual booking link — all read-only chrome, no hover-only meaning.
 *
 * The progress rule and chapter counter are homepage-only (they describe
 * position within the one-car story, meaningless on /booking). The
 * booking link stays hidden until the visitor has moved past the opening
 * scene, so it never competes with the first cinematic frame but still
 * satisfies "booking reachable within 1-2 taps" once the story has begun.
 */
export function SiteChrome() {
  const pathname = usePathname();
  const isStory = pathname === "/";

  const { scrollYProgress } = useScroll();
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [chapter, setChapter] = useState(1);
  const [pastHero, setPastHero] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setChapter(Math.min(CHAPTER_COUNT, Math.floor(p * CHAPTER_COUNT) + 1));
    setPastHero(p > 0.06);
  });

  return (
    <header className="site-chrome">
      <a className="skip-link" href="#booking-entry">
        Preskoči na termine
      </a>

      {isStory && (
        <motion.span
          className="site-chrome__progress"
          style={{ scaleX: barScale }}
          aria-hidden="true"
        />
      )}

      <div className="site-chrome__row">
        <Link className="site-chrome__mark" href="/">
          Kolev
        </Link>
        <span className="site-chrome__place">Negotin</span>
      </div>

      {isStory && (
        <p className="site-chrome__chapter" aria-hidden="true">
          {String(chapter).padStart(2, "0")} / {String(CHAPTER_COUNT).padStart(2, "0")}
        </p>
      )}

      {isStory && (
        <MagneticCta href="/booking" className="site-chrome__cta" data-visible={pastHero}>
          Termin
        </MagneticCta>
      )}
    </header>
  );
}
