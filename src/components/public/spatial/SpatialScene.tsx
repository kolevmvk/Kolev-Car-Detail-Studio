"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { CameraFrame } from "../CameraFrame";
import { StoryImage } from "../StoryImage";
import { useSpatialMode } from "./useSpatialMode";

const SpatialCanvas = dynamic(() => import("./SpatialCanvas").then((m) => m.SpatialCanvas), {
  ssr: false,
});

type SpatialSceneProps = {
  id: string;
  className: string;
  bgSrc: string;
  carSrc: string;
  mirrorText: string;
  yawRange?: [number, number];
  fogColor?: string;
  fallbackSrc: string;
  fallbackAlt: string;
  fallbackCropClass: string;
  label: string;
  headline: React.ReactNode;
  headlineClassName?: string;
};

/**
 * Shared engine behind every full-spatial scene on the public site (hero,
 * return). The car is a real, physically-shaded object standing on a mirror
 * floor inside a lit 3D volume with its own background plate and fog — the
 * camera genuinely arcs around it on scroll (plus a light pointer-driven
 * tilt on desktop), so parallax and reflection are real, not simulated on a
 * flat plane. GSAP ScrollTrigger drives one progress value shared by the
 * camera rig, material and DOM overlay.
 *
 * Falls back to the static photographic CameraFrame treatment for reduced
 * motion, no WebGL, or low-power mobile — never a blank scene.
 */
export function SpatialScene({
  id,
  className,
  bgSrc,
  carSrc,
  mirrorText,
  yawRange,
  fogColor,
  fallbackSrc,
  fallbackAlt,
  fallbackCropClass,
  label,
  headline,
  headlineClassName,
}: SpatialSceneProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const mode = useSpatialMode();
  const [active, setActive] = useState(false);

  // Pause the WebGL render loop while the scene is far off-screen — two
  // reflective 3D scenes both rendering every frame regardless of scroll
  // position is wasted GPU work and measurably hurts scroll performance.
  useEffect(() => {
    if (mode !== "webgl" && mode !== "webgl-low") return;
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), {
      rootMargin: "35% 0px",
    });
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [mode]);

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
    <section ref={sectionRef} className={`spatial ${className}`} aria-labelledby={id}>
      <div className="spatial__stage">
        {mode === "webgl" || mode === "webgl-low" ? (
          <div ref={canvasWrapRef} className="spatial__canvas">
            <SpatialCanvas
              bgSrc={bgSrc}
              carSrc={carSrc}
              mirrorText={mirrorText}
              progressRef={progressRef}
              lowPower={lowPower}
              yawRange={yawRange}
              fogColor={fogColor}
              active={active}
            />
          </div>
        ) : (
          <CameraFrame>
            <StoryImage src={fallbackSrc} alt={fallbackAlt} priority className={`story-img ${fallbackCropClass}`} />
          </CameraFrame>
        )}

        <span className="grain spatial__grain" aria-hidden="true" />

        <div ref={overlayRef} className="spatial__overlay scene__copy scene__copy--low">
          <p className="scene__label">{label}</p>
          <p id={id} className={`scene__headline ${headlineClassName ?? ""}`}>
            {headline}
          </p>
        </div>
      </div>
    </section>
  );
}
