"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

const frames = [
  {
    src: media.ageRemovalFrames[0],
    beat: "Dolazak",
    alt: "Prljav crni Golf pred Kolev studijom, vlasnica izlazi iz auta.",
  },
  {
    src: media.ageRemovalFrames[1],
    beat: "Predaja ključa",
    alt: "Vlasnica predaje ključ pred studijom, auto još u kapima vode.",
  },
  {
    src: media.ageRemovalFrames[2],
    beat: "Stanje",
    alt: "Blatnjav Golf GTD pred otvorenim Kolev studijom u sumrak.",
  },
  {
    src: media.ageRemovalFrames[3],
    beat: "Godine silaze",
    alt: "Isti kadar: prljava prednja polovina i očišćena zadnja polovina Golfa.",
  },
  {
    src: media.ageRemovalFrames[4],
    beat: "Drugi sjaj",
    alt: "Očišćen Golf i vlasnica pred studijom posle detaljinga.",
  },
  {
    src: media.ageRemovalFrames[5],
    beat: "Povratak",
    alt: "Vlasnica u očišćenom Golfu, spremna da ode, pred Kolev studijom.",
  },
] as const;

export function AgeRemovalScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useMountedReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(
      frames.length - 1,
      Math.floor(progress * frames.length),
    );
    setActive(next);
  });

  function jumpToFrame(index: number) {
    const section = ref.current;
    if (!section) return;
    const start = window.scrollY + section.getBoundingClientRect().top;
    const distance = section.offsetHeight - window.innerHeight;
    const progress = (index + 0.18) / frames.length;
    window.scrollTo({
      top: start + distance * progress,
      behavior: "smooth",
    });
  }

  if (reduce) {
    return (
      <section className="age-removal-static" aria-labelledby="age-removal-title">
        <p className="scene__label">Kolev · povratak</p>
        <h2 id="age-removal-title" className="age-removal__headline">
          Skidamo godine
          <br />
          sa izgleda.
        </h2>
        <p className="age-removal__note">Ne sa papira.</p>
        <div className="age-removal-static__film">
          {frames.map((frame, index) => (
            <figure key={frame.src}>
              <div className="age-removal-static__media">
                <StoryImage
                  src={frame.src}
                  alt={frame.alt}
                  className="story-img age-removal__image"
                />
              </div>
              <figcaption>
                {String(index + 1).padStart(2, "0")} · {frame.beat}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    );
  }

  const current = frames[active];

  return (
    <section
      ref={ref}
      className="age-removal"
      aria-labelledby="age-removal-title"
      style={{ "--frame-count": frames.length } as React.CSSProperties}
    >
      <div className="age-removal__sticky">
        <div className="age-removal__stage">
          {frames.map((frame, index) => (
            <figure
              key={frame.src}
              className="age-removal__frame"
              data-active={index === active}
              aria-hidden={index !== active}
            >
              <StoryImage
                src={frame.src}
                alt={index === active ? frame.alt : ""}
                className="story-img age-removal__image"
                priority={index === 0}
                loading={
                  index === 0
                    ? undefined
                    : Math.abs(index - active) <= 1
                      ? "eager"
                      : "lazy"
                }
              />
            </figure>
          ))}
          <span className="age-removal__grade" aria-hidden="true" />
          <span className="grain" aria-hidden="true" />
        </div>

        <div className="age-removal__overlay">
          <div className="age-removal__years">
            <span>Trag vremena</span>
            <div>
              {frames.map((frame, index) => (
                <button
                  key={frame.src}
                  type="button"
                  data-active={index === active}
                  aria-label={`${frame.beat}, kadar ${index + 1} od ${frames.length}`}
                  aria-current={index === active ? "true" : undefined}
                  onClick={() => jumpToFrame(index)}
                >
                  {String(index + 1).padStart(2, "0")}
                </button>
              ))}
            </div>
          </div>

          <div className="age-removal__rail">
            <div className="age-removal__copy" aria-live="polite">
              <p className="scene__label">Kolev · povratak</p>
              <h2 id="age-removal-title" className="age-removal__headline">
                Skidamo godine
                <br />
                sa izgleda.
              </h2>
              <p className="age-removal__note">{current.beat}.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
