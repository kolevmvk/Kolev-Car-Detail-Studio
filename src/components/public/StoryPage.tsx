import { media } from "@/features/story/content";
import type { ServicePublic } from "@/features/booking/schema";
import { AgeRemovalScene } from "./AgeRemovalScene";
import { CraftReel } from "./CraftReel";
import { DetailingWordmark } from "./DetailingWordmark";
import { HeadlightHold } from "./HeadlightHold";
import { InspectionScene } from "./InspectionScene";
import { OpeningHero } from "./OpeningHero";
import {
  PromotionBanner,
  type PublicPromotion,
} from "./PromotionBanner";
import { Reveal } from "./Reveal";
import { ServiceLedger } from "./ServiceLedger";
import { StoryImage } from "./StoryImage";
import { TimeScene } from "./TimeFrame";

/**
 * NEKAD · SADA · PONOVO — the public story experience.
 *
 * The same grey Golf Mk7 (Soran Ali / Pexels) is the visual protagonist.
 * Stock media — not a Kolev customer job. Each slot in content.ts accepts
 * authentic studio media without structural changes.
 */
export function StoryPage({
  promotion,
  services,
}: {
  promotion?: PublicPromotion | null;
  services: ServicePublic[];
}) {
  return (
    <article className="story">
      {/* ── S01 SEĆANJE ── The real car opens the story; no simulated vehicle. ── */}
      <OpeningHero />

      {/* ── S02 VREME ── Time passing ──────────────────────────────────────── */}
      <TimeScene />

      {/* ── S03 PREPOZNAVANJE ── Inspection light exposes accumulated wear. ─ */}
      <InspectionScene />

      {/* ── S04–S05 ZANAT ── Three process cuts in one timed/swipe reel. ─ */}
      <CraftReel />

      {/* ── S06 TRANSFORMACIJA ── Hold-to-reveal ───────────────────────────── */}
      <section className="scene scene--transformation" aria-labelledby="s6">
        <div className="scene__copy scene__copy--pad">
          <p id="s6" className="scene__label">
            Farovi
          </p>
        </div>
        <HeadlightHold />
      </section>

      {/* ── S07 POVRATAK ── Vlasnica ponovo vidi isti automobil. ───────────── */}
      <AgeRemovalScene />

      {promotion && <PromotionBanner promotion={promotion} />}

      {/* ── S08 AKCIJA ── Emotional continuation → booking ────────────────── */}
      <section id="booking-entry" className="scene scene--action" aria-labelledby="s8">
        <div className="action__media">
          <StoryImage
            src={media.campaignFinale}
            alt="Kolev Car Detail Studio u poslednjem svetlu dana."
            className="story-img action__image"
          />
          <span className="action__grade" aria-hidden="true" />
        </div>
        <DetailingWordmark />
        <div className="scene__copy">
          <p className="scene__label">Kolev Car Detailing</p>
          <Reveal>
            <p id="s8" className="scene__headline scene__headline--sm">
              Možda ti ne treba
              <br />
              drugi auto.
              <br />
              Možda mu treba
              <br />
              drugi utisak.
            </p>
          </Reveal>
          <p className="scene__meta">
            Negotin · Srbija · Termini su realni
          </p>
        </div>
      </section>

      <ServiceLedger services={services} />
    </article>
  );
}
