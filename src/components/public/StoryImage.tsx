import Image from "next/image";

type StoryImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
  quality?: number;
};

export function StoryImage({
  src,
  alt,
  priority = false,
  sizes = "(max-width: 430px) 100vw, 100vw",
  className,
  quality = 72,
}: StoryImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      quality={quality}
      className={className ?? "story-img"}
    />
  );
}
