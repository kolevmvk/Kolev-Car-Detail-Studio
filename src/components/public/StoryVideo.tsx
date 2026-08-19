"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

let activeStoryVideo: HTMLVideoElement | null = null;

interface StoryVideoProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  /** When false, stay paused even if the element is on screen. */
  playing?: boolean;
}

/**
 * Autoplay muted looping process video.
 * Falls back to the poster image when prefers-reduced-motion is set —
 * handled via CSS so no JS media-query check is needed in the component.
 */
export function StoryVideo({
  src,
  poster,
  alt,
  className = "story-img",
  playing = true,
}: StoryVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = () => {
      if (!playing || document.hidden) {
        video.pause();
        if (activeStoryVideo === video) activeStoryVideo = null;
        return;
      }
      if (activeStoryVideo && activeStoryVideo !== video) {
        activeStoryVideo.pause();
      }
      activeStoryVideo = video;
      void video.play().catch(() => undefined);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          video.pause();
          if (activeStoryVideo === video) activeStoryVideo = null;
        }
      },
      { threshold: 0.18 },
    );

    const handleVisibility = () => {
      if (document.hidden) {
        video.pause();
        if (activeStoryVideo === video) activeStoryVideo = null;
      } else if (playing) {
        tryPlay();
      }
    };

    observer.observe(video);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      video.pause();
      if (activeStoryVideo === video) activeStoryVideo = null;
    };
  }, [playing]);

  return (
    <>
      <video
        ref={videoRef}
        className={`story-video ${className}`}
        muted
        loop
        playsInline
        preload={playing ? "auto" : "metadata"}
        poster={poster}
        aria-label={alt}
      >
        <source src={src} type="video/mp4" />
      </video>
      <Image
        src={poster}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        quality={72}
        className={`story-video-poster ${className}`}
        aria-hidden="true"
      />
    </>
  );
}
