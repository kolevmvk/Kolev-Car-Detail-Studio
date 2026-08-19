"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { StoryImage } from "./StoryImage";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

const lifeChapters = [
  {
    year: "2014",
    owner: "Prvi ključ",
    title: "Držala ga je malo duže nego što je morala.",
    copy: "Prvi pogled preko ramena. Prvi trag dlana na volanu. Auto je mirisao na planove.",
    src: "/story/owner-arrival.webp",
    alt: "Vlasnica kraj sivog Golfa u poslednjem svetlu dana.",
    crop: "life-frame__image--first",
    layout: "acquisition",
  },
  {
    year: "2016",
    owner: "Poslovne godine",
    title: "Radni dan je često završavao na parkingu.",
    copy: "Sastanci, fascikle, kafa između dva grada. Kilometri su postali rutina.",
    src: "/story/owner-business-drive.webp",
    alt: "Vlasnica vozi Golf nakon poslovnog dana.",
    crop: "life-frame__image--business",
    layout: "business",
  },
  {
    year: "2018",
    owner: "Posle ponoći",
    title: "Jedne noći stakla su dugo ostala zamagljena.",
    copy: "Neke uspomene ne ostavljaju fotografiju. Samo tišinu u parkiranom autu.",
    src: "/story/night-couple.webp",
    alt: "Par kraj Golfa na obali posle ponoći.",
    crop: "life-frame__image--night",
    layout: "nocturne",
  },
  {
    year: "2022",
    owner: "Prvo porodično more",
    title: "Pozadi dvoje dece. Svuda pesak.",
    copy: "Mrvice u šavovima, so na patosnicama i pitanje: „Jesmo li stigli?”",
    src: "/story/family-road-trip.webp",
    alt: "Porodica pakuje isti Golf za putovanje.",
    crop: "life-frame__image--sea",
    layout: "family",
  },
  {
    year: "2024",
    owner: "Selidba",
    title: "Kutije do krova. Vrata koja se ne zatvaraju iz prve.",
    copy: "Jedan stan je stao u nekoliko vožnji. Tragovi su ostali u gepeku i tkanini.",
    src: "/story/moving-day.webp",
    alt: "Vlasnica prenosi kutiju kraj Golfa tokom selidbe.",
    crop: "life-frame__image--move",
    layout: "moving",
  },
] as const;

export function TimeScene() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useMountedReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    const next = Math.min(
      lifeChapters.length - 1,
      Math.floor(progress * lifeChapters.length),
    );
    setActive(next);
  });

  function jumpToChapter(index: number) {
    const section = ref.current;
    if (!section) return;
    const start = window.scrollY + section.getBoundingClientRect().top;
    const distance = section.offsetHeight - window.innerHeight;
    const progress = (index + 0.18) / lifeChapters.length;
    window.scrollTo({
      top: start + distance * progress,
      behavior: "smooth",
    });
  }

  if (reduce) {
    return (
      <section className="life-static" aria-labelledby="s-time">
        <div className="life-static__intro">
          <p className="scene__label">Kolev · vreme</p>
          <h2 id="s-time" className="scene__headline">Jedan auto. Mnogo života.</h2>
        </div>
        {lifeChapters.map((chapter) => (
          <article className="life-static__chapter" key={chapter.year}>
            <div className="life-static__media">
              <StoryImage src={chapter.src} alt={chapter.alt} className={`story-img ${chapter.crop}`} />
            </div>
            <p className="life-frame__meta">{chapter.year} · {chapter.owner}</p>
            <h3 className="life-frame__title">{chapter.title}</h3>
            <p className="life-frame__copy">{chapter.copy}</p>
          </article>
        ))}
      </section>
    );
  }

  return (
    <section
      ref={ref}
      className="life-scroll"
      aria-labelledby="s-time"
      style={{ "--life-count": lifeChapters.length } as React.CSSProperties}
    >
      <div className="life-scroll__sticky" data-layout={lifeChapters[active].layout}>
        <div className="life-scroll__frames">
          {lifeChapters.map((chapter, index) => (
            <figure
              className="life-frame"
              data-active={index === active}
              aria-hidden={index !== active}
              key={`${chapter.year}-${chapter.owner}`}
            >
              <StoryImage
                src={chapter.src}
                alt={index === active ? chapter.alt : ""}
                className={`story-img ${chapter.crop}`}
                priority={index === 0}
                unoptimized={chapter.layout === "nocturne"}
                loading={
                  index === 0
                    ? undefined
                    : Math.abs(index - active) <= 1
                      ? "eager"
                      : "lazy"
                }
              />
              <span className="life-frame__grade" aria-hidden="true" />
            </figure>
          ))}
          <span className="grain" aria-hidden="true" />
        </div>

        <span className="life-scroll__trace" aria-hidden="true" key={`trace-${active}`} />

        <div className="life-scroll__copy" aria-live="polite" key={active}>
          <p className="life-frame__meta">
            {lifeChapters[active].year} · {lifeChapters[active].owner}
          </p>
          <h2 id="s-time" className="life-frame__title">
            {lifeChapters[active].title}
          </h2>
          <p className="life-frame__copy">{lifeChapters[active].copy}</p>
        </div>

        <nav className="life-scroll__progress" aria-label="Godine u životu automobila">
          <span>{String(active + 1).padStart(2, "0")}</span>
          <div className="life-scroll__ticks">
            {lifeChapters.map((chapter, index) => (
              <button
                type="button"
                key={chapter.year}
                data-active={index <= active}
                aria-current={index === active ? "step" : undefined}
                aria-label={`${chapter.year}: ${chapter.owner}`}
                onClick={() => jumpToChapter(index)}
              >
                <i />
                <small>{chapter.year.slice(2)}</small>
              </button>
            ))}
          </div>
          <span>{String(lifeChapters.length).padStart(2, "0")}</span>
        </nav>
      </div>
    </section>
  );
}
