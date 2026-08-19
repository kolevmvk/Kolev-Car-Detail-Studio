import { media } from "@/features/story/content";
import { KineticType } from "./KineticType";
import { StoryImage } from "./StoryImage";

/**
 * Opening memory: one real, ordinary car with enough room around it to feel
 * remembered rather than advertised. Motion is photographic (a restrained
 * settle and light pass), never a substitute for vehicle detail.
 */
export function OpeningHero() {
  return (
    <section className="opening-hero" aria-labelledby="opening-hero-title">
      <div className="opening-hero__media">
        <StoryImage
          src={media.openingHero}
          alt="Sivi Golf na obalskom putu u poslednjem svetlu dana."
          priority
          className="story-img opening-hero__image"
        />
        <span className="opening-hero__grade" aria-hidden="true" />
        <span className="opening-hero__light" aria-hidden="true" />
        <span className="grain" aria-hidden="true" />
      </div>

      <div className="opening-hero__copy">
        <p className="scene__label">Jedan auto · Jedna priča</p>
        <KineticType
          as="h1"
          id="opening-hero-title"
          className="opening-hero__title"
          lines={["Sećaš se kako je izgledao", "kada si ga stvarno gledao?"]}
          variant="memory"
        />
        <p className="opening-hero__note">
          Nije uvek izgledao umorno.
        </p>
      </div>

      <div className="opening-hero__rail" aria-hidden="true">
        <span>01 / 08</span>
        <span className="opening-hero__rail-line" />
        <span>Skroluj kroz vreme</span>
      </div>
    </section>
  );
}
