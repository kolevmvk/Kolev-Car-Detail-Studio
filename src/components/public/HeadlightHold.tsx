import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";

/**
 * Press-and-hold comparison: wet extractor mid-use → clean interior result.
 * Reduced-motion: shows both images side-by-side as static figures.
 */
export function HeadlightHold() {
  return (
    <div className="hold-root">
      <button
        type="button"
        className="hold-reveal"
        aria-describedby="hold-hint"
        aria-label="Pritisni i drži da vidiš rezultat"
      >
        <span className="hold-reveal__frame">
          <StoryImage
            src={media.compareBefore}
            alt="Ekstraktor na tkanini sedišta — rad u toku."
            className="story-img"
          />
          <span className="hold-reveal__after" aria-hidden="true">
            <StoryImage
              src={media.compareAfter}
              alt=""
              className="story-img"
            />
          </span>
        </span>
        <span id="hold-hint" className="hold-reveal__hint">
          Pritisni i drži
        </span>
      </button>

      <div className="hold-static">
        <figure className="hold-static__shot">
          <span className="hold-static__media">
            <StoryImage
              src={media.compareBefore}
              alt="Ekstrakcija tkanine — rad koji je bio potreban."
              className="story-img"
            />
          </span>
          <figcaption>Rad</figcaption>
        </figure>
        <figure className="hold-static__shot">
          <span className="hold-static__media">
            <StoryImage
              src={media.compareAfter}
              alt="Čist enterijer posle rada — jasna tekstura, bez naslaga."
              className="story-img"
            />
          </span>
          <figcaption>Rezultat</figcaption>
        </figure>
      </div>
    </div>
  );
}
