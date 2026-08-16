"use client";

import Image from "next/image";

interface StoryVideoProps {
  src: string;
  poster: string;
  alt: string;
  className?: string;
}

/**
 * Autoplay muted looping process video.
 * Falls back to the poster image when prefers-reduced-motion is set —
 * handled via CSS so no JS media-query check is needed in the component.
 */
export function StoryVideo({ src, poster, alt, className = "story-img" }: StoryVideoProps) {
  return (
    <>
      {/* Motion: autoplay video */}
      <video
        className={`story-video ${className}`}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        aria-label={alt}
      >
        <source src={src} type="video/mp4" />
      </video>
      {/* No-motion: static poster image; toggled by CSS */}
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
