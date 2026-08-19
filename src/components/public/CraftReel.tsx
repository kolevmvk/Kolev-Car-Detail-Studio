"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { media, video } from "@/features/story/content";
import { StoryVideo } from "./StoryVideo";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

const SWIPE_PX = 42;

const clips = [
  {
    id: "foam",
    src: video.foamWashVertical,
    poster: media.entryProcess,
    crop: "crop-entry-foam",
    label: "ulaz",
    alt: "Pena prelazi preko karoserije — ulazak iz životne priče u proces rada.",
    lines: ["Auto ulazi.", "Posao ostaje."],
    weight: 1,
  },
  {
    id: "polish",
    src: video.polishProcess,
    poster: media.craftVideoPoster,
    crop: "crop-polish",
    label: "korekcija laka",
    alt: "Rotaciona korekcija laka — jastučić na laku, bez rezova.",
    lines: ["Korekcija laka."],
    weight: 1.55,
  },
  {
    id: "interior",
    src: video.interiorProcess,
    poster: media.craftInteriorPoster,
    crop: "",
    label: "enterijer",
    alt: "Ručni rad na unutrašnjosti — četkica, krpa, detalj.",
    lines: ["Enterijer."],
    weight: 1,
  },
] as const;

const TOTAL_WEIGHT = clips.reduce((sum, clip) => sum + clip.weight, 0);

function indexFromProgress(progress: number) {
  const scaled = Math.min(0.999, Math.max(0, progress)) * TOTAL_WEIGHT;
  let cursor = 0;
  for (let index = 0; index < clips.length; index += 1) {
    cursor += clips[index].weight;
    if (scaled < cursor) return index;
  }
  return clips.length - 1;
}

export function CraftReel() {
  const reduce = useMountedReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const pointerX = useRef<number | null>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduce) return;
    setActive(indexFromProgress(progress));
  });

  const jumpToFrame = useCallback((index: number) => {
    const section = ref.current;
    if (!section) return;
    const next = ((index % clips.length) + clips.length) % clips.length;
    const start = window.scrollY + section.getBoundingClientRect().top;
    const distance = section.offsetHeight - window.innerHeight;
    let before = 0;
    for (let i = 0; i < next; i += 1) before += clips[i].weight;
    const progress = (before + clips[next].weight * 0.18) / TOTAL_WEIGHT;
    window.scrollTo({
      top: start + distance * progress,
      behavior: "smooth",
    });
    setActive(next);
  }, []);

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    pointerX.current = event.clientX;
  }

  function onPointerUp(event: React.PointerEvent<HTMLElement>) {
    const start = pointerX.current;
    pointerX.current = null;
    if (start == null) return;
    const delta = event.clientX - start;
    if (delta <= -SWIPE_PX) jumpToFrame(active + 1);
    else if (delta >= SWIPE_PX) jumpToFrame(active - 1);
  }

  const current = clips[active];

  if (reduce) {
    return (
      <section className="craft-reel craft-reel--static" aria-labelledby="s4">
        {clips.map((clip, index) => (
          <figure key={clip.id} className="craft-reel__still">
            <StoryVideo
              src={clip.src}
              poster={clip.poster}
              alt={clip.alt}
              className={`story-video ${clip.crop}`.trim()}
              playing={false}
            />
            <figcaption>
              {index === 0 ? (
                <>
                  <span className="scene__label">Kolev · zanat</span>
                  <strong id={index === 0 ? "s4" : undefined}>
                    {clip.lines.join(" ")}
                  </strong>
                </>
              ) : (
                clip.label
              )}
            </figcaption>
          </figure>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="craft-reel"
      aria-labelledby="s4"
      data-clip={current.id}
      style={{ "--reel-length": TOTAL_WEIGHT } as React.CSSProperties}
    >
      <div
        className="craft-reel__sticky"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointerX.current = null;
        }}
      >
        <div className="craft-reel__stage">
          {clips.map((clip, index) => (
            <div
              key={clip.id}
              className="craft-reel__clip"
              data-kind={clip.id}
              data-active={index === active}
              aria-hidden={index !== active}
            >
              <StoryVideo
                src={clip.src}
                poster={clip.poster}
                alt={index === active ? clip.alt : ""}
                className={`story-video ${clip.crop}`.trim()}
                playing={index === active}
              />
            </div>
          ))}
          <span className="craft-reel__grade" aria-hidden="true" />
        </div>

        <div className="craft-reel__overlay">
          <p className="scene__label">Kolev · zanat</p>
          <p id="s4" className="scene__headline">
            {current.lines.map((line, index) => (
              <span key={line}>
                {index > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
          <div className="craft-reel__index" role="tablist" aria-label="Kadrovi procesa">
            {clips.map((clip, index) => (
              <button
                key={clip.id}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`${clip.label}, kadar ${index + 1} od ${clips.length}`}
                data-active={index === active}
                onClick={() => jumpToFrame(index)}
              >
                <i aria-hidden="true" />
                <span>{clip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
