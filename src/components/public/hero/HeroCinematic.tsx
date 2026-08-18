"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { media } from "@/features/story/content";
import { CameraFrame } from "../CameraFrame";
import { StoryImage } from "../StoryImage";

const HeroCanvas = dynamic(() => import("./HeroCanvas").then((m) => m.HeroCanvas), {
  ssr: false,
});

type Mode = "pending" | "webgl" | "webgl-low" | "fallback";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

const QUERIES = [
  "(prefers-reduced-motion: reduce)",
  "(max-width: 640px)",
  "(pointer: coarse)",
] as const;

function subscribeToViewportSignals(callback: () => void) {
  const lists = QUERIES.map((q) => window.matchMedia(q));
  lists.forEach((mql) => mql.addEventListener("change", callback));
  return () => {
    lists.forEach((mql) => mql.removeEventListener("change", callback));
  };
}

function getHeroModeSnapshot(): Mode {
  const [reduce, narrow, coarse] = QUERIES.map((q) => window.matchMedia(q).matches);
  if (reduce || !supportsWebGL()) return "fallback";
  return narrow && coarse ? "webgl-low" : "webgl";
}

function getServerSnapshot(): Mode {
  return "pending";
}

/**
 * S01 — NEKAD, rebuilt as one interactive scroll-scrubbed scene instead of
 * a photo with a reveal effect. The hero photo is lit as a real object in a
 * CC0 workshop light environment (see HeroCanvas); GSAP ScrollTrigger drives
 * a single progress value that the WebGL camera, material and this DOM
 * overlay all read from, so scroll produces one continuous camera move
 * rather than several independently-timed effects.
 *
 * Falls back to the static photographic CameraFrame treatment when the
 * visitor prefers reduced motion, is on a very small/low-power device, or
 * when WebGL is unavailable — never a blank scene. Mode tracking uses
 * useSyncExternalStore (subscribed to matchMedia) rather than effect-driven
 * setState, so it stays correct across viewport/orientation changes and
 * hydrates safely.
 */
export function HeroCinematic() {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const mode = useSyncExternalStore(subscribeToViewportSignals, getHeroModeSnapshot, getServerSnapshot);

  useEffect(() => {
    if (mode !== "webgl" && mode !== "webgl-low") return;
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          progressRef.current = self.progress;

          if (overlayRef.current) {
            const fade = 1 - Math.min(self.progress / 0.55, 1);
            overlayRef.current.style.opacity = String(fade);
          }
          if (canvasWrapRef.current) {
            const exit = Math.max((self.progress - 0.82) / 0.18, 0);
            canvasWrapRef.current.style.opacity = String(1 - exit);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [mode]);

  const lowPower = mode === "webgl-low";

  return (
    <section ref={sectionRef} className="hero-cine" aria-labelledby="s1">
      <div className="hero-cine__stage">
        {mode === "webgl" || mode === "webgl-low" ? (
          <div ref={canvasWrapRef} className="hero-cine__canvas">
            <HeroCanvas photoSrc={media.openingHero} progressRef={progressRef} lowPower={lowPower} />
          </div>
        ) : (
          // "pending" (still detecting) and "fallback" both render the
          // static photographic treatment — never a blank first paint.
          <CameraFrame>
            <StoryImage
              src={media.openingHero}
              alt="Sivi Golf na putu kroz brda — auto kad je još bio centar pažnje."
              priority
              className="story-img crop-golf-opening"
            />
          </CameraFrame>
        )}

        <span className="grain hero-cine__grain" aria-hidden="true" />

        <div ref={overlayRef} className="hero-cine__overlay scene__copy scene__copy--low">
          <p className="scene__label">Studio · Negotin</p>
          <p id="s1" className="scene__headline hero-cine__headline">
            Sećaš se?
          </p>
        </div>

        <p className="hero-cine__mark" aria-hidden="true">
          Kolev
        </p>
      </div>
    </section>
  );
}
