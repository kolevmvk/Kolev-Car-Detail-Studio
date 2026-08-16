import { media } from "@/features/story/content";
import { StoryImage } from "./StoryImage";

export function HeadlightHold() {
  return (
    <div className="hold-root">
      <button
        type="button"
        className="hold-reveal"
        aria-describedby="hold-hint"
        aria-label="Pritisni i drži da vidiš restaurirani far"
      >
        <span className="hold-reveal__frame">
            <StoryImage
              src={media.headlightOxidized}
              alt=""
              className="story-img crop-lamp"
            />
            <span className="hold-reveal__after" aria-hidden="true">
              <StoryImage src={media.headlightClear} alt="" className="story-img crop-lamp" />
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
              src={media.headlightOxidized}
              alt="Far pre rada: oksidisani, žuti polikarbonat."
              className="story-img crop-lamp"
            />
          </span>
          <figcaption>Pre</figcaption>
        </figure>
        <figure className="hold-static__shot">
          <span className="hold-static__media">
            <StoryImage
              src={media.headlightClear}
              alt="Far posle restauracije: optički čist polikarbonat."
              className="story-img crop-lamp"
            />
          </span>
          <figcaption>Posle</figcaption>
        </figure>
      </div>
    </div>
  );
}
