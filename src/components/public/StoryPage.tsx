import Link from "next/link";
import { media, spatial, video } from "@/features/story/content";
import { HeadlightHold } from "./HeadlightHold";
import { SpatialScene } from "./spatial/SpatialScene";
import { StoryImage } from "./StoryImage";
import { StoryVideo } from "./StoryVideo";
import { TimeScene } from "./TimeFrame";

/**
 * NEKAD · SADA · PONOVO — the public story experience.
 *
 * The same grey Golf Mk7 (Soran Ali / Pexels) is the visual protagonist.
 * Stock media — not a Kolev customer job. Each slot in content.ts accepts
 * authentic studio media without structural changes.
 */
export function StoryPage() {
  return (
    <article className="story">
      <h1 className="sr-only">
        Auto detajling u Negotinu — od prvog dana do povratka utiska
      </h1>

      {/* ── S01 NEKAD ── Opening / Memory — spatial WebGL scene ─────────────── */}
      <SpatialScene
        id="s1"
        className="spatial--hero"
        bgSrc={spatial.hero.bg}
        carSrc={spatial.hero.car}
        mirrorText="Kolev"
        yawRange={[-0.6, 0.12]}
        fogColor="#0d0d0d"
        fallbackSrc={media.openingHero}
        fallbackAlt="Sivi Golf na putu kroz brda — auto kad je još bio centar pažnje."
        fallbackCropClass="crop-golf-opening"
        label="Studio · Negotin"
        headline="Sećaš se?"
      />

      {/* ── S02 VREME ── Time passing ──────────────────────────────────────── */}
      <TimeScene />

      {/* ── S03 PREPOZNAVANJE ── Film pause — text sits at bottom of silence ─ */}
      <section className="scene scene--recognition" aria-labelledby="s3">
        <div className="scene__copy">
          <p id="s3" className="scene__headline">
            Nije ostario.
            <br />
            Zapušten je.
          </p>
          <p className="scene__note">
            Nije mu prošlo vreme.
            <br />
            Prošao mu je sjaj.
          </p>
        </div>
      </section>

      {/* ── S04 ULAZ ── Entry into studio ──────────────────────────────────── */}
      <section className="scene scene--entry" aria-labelledby="s4">
        <div className="scene__media">
          <StoryImage
            src={media.entryProcess}
            alt="Pena na faru — hemija pre ručnog rada, prelaz u studio."
            className="story-img crop-entry-foam"
          />
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="scene__copy scene__copy--low">
          <p id="s4" className="scene__headline">
            Auto ulazi.
            <br />
            Posao ostaje.
          </p>
        </div>
      </section>

      {/* ── S05 ZANAT ── Craft — edited as film, not media gallery ─────────── */}
      <section className="scene scene--craft" aria-labelledby="s5-label">
        <p className="sr-only" id="s5-label">Zanat</p>

        {/* Cut A: aged headlight macro — the detail that tells the whole story */}
        <div className="cut cut--macro">
          <div className="cut__media">
            <StoryImage
              src={media.craftHeadlightAged}
              alt="Izbledelost — far zamagljen godinama, bez udesa."
              className="story-img crop-headlight"
            />
            <span className="grain" aria-hidden="true" />
          </div>
          <p className="cut__label" aria-hidden="true">farovi</p>
        </div>

        {/* Cut A2: polished paint reflection — light and the KOLEV mark meet the surface */}
        <div className="cut cut--reflection">
          <div className="cut__media">
            <StoryImage
              src={media.craftReflection}
              alt="Sjaj laka posle poliranja — refleksija koja pokazuje dubinu, ne samo čistoću."
              className="story-img"
            />
            <span className="reflect-sweep" aria-hidden="true" />
            <span className="grain" aria-hidden="true" />
          </div>
          <p className="cut__mark" aria-hidden="true">Kolev</p>
        </div>

        {/* Dark interstitial — the silence before the machine starts */}
        <div className="cut cut--pause" aria-hidden="true" />

        {/* Cut B: polishing machine — movement and correction */}
        <div className="cut cut--video">
          <div className="cut__media">
            <StoryVideo
              src={video.polishProcess}
              poster={media.craftVideoPoster}
              alt="Rotaciona korekcija laka — bliski kadar bez rezova."
              className="story-video"
            />
          </div>
        </div>

        {/* Cut C: seat extraction — hard cut into interior fabric */}
        <div className="cut cut--interior">
          <div className="cut__media">
            <StoryImage
              src={media.craftSeat}
              alt="Mokra ekstrakcija tkanja sedišta — godišnji slojevi idu jedan po jedan."
              className="story-img crop-seat"
            />
            <span className="grain" aria-hidden="true" />
          </div>
          <p className="cut__label" aria-hidden="true">enterijer</p>
        </div>

        {/* Cut D: interior detail video — close human care */}
        <div className="cut cut--close">
          <div className="cut__media">
            <StoryVideo
              src={video.interiorProcess}
              poster={media.craftInteriorPoster}
              alt="Ručni rad na unutrašnjosti — četkica, krpa, detalj."
              className="story-video"
            />
          </div>
        </div>

        {/* Craft statement — no image */}
        <div className="cut cut--copy">
          <p className="scene__headline">
            Skidamo godine
            <br />
            sa izgleda.
          </p>
          <p className="scene__note">Ne sa papira.</p>
        </div>
      </section>

      {/* ── S06 TRANSFORMACIJA ── Hold-to-reveal ───────────────────────────── */}
      <section className="scene scene--transformation" aria-labelledby="s6">
        <div className="scene__copy scene__copy--pad">
          <p id="s6" className="scene__label">Rad · Rezultat</p>
        </div>
        <HeadlightHold />
      </section>

      {/* ── S07 POVRATAK ── Return — echoes S01, same spatial engine ───────── */}
      {/* Opening = memory. Return = regained attention. Same car, same */}
      {/* studio light, warmer fog — the scene itself has changed, not just the photo. */}
      <SpatialScene
        id="s7"
        className="spatial--return"
        bgSrc={spatial.return.bg}
        carSrc={spatial.return.car}
        mirrorText="Kolev"
        yawRange={[-0.15, 0.55]}
        fogColor="#1a1410"
        fallbackSrc={media.returnCar}
        fallbackAlt="Isti Golf kraj mora — sjaj koji se vratio zajedno sa pažnjom."
        fallbackCropClass="crop-golf-return"
        label="Studio · Negotin"
        headline={
          <>
            Ne vraćamo vreme.
            <br />
            Vraćamo ono što je
            <br />
            vreme sakrilo.
          </>
        }
      />

      {/* ── S08 AKCIJA ── Emotional continuation → booking ────────────────── */}
      <section className="scene scene--action" aria-labelledby="s8">
        <div className="scene__copy">
          <p className="scene__label">Kolev Car Detailing</p>
          <p id="s8" className="scene__headline scene__headline--sm">
            Možda mu ne treba
            <br />
            drugi auto.
            <br />
            Možda mu treba
            <br />
            drugi utisak.
          </p>
          <Link className="action__btn" href="/booking">
            Pogledaj prvi slobodan termin
          </Link>
          <p className="scene__meta">
            Negotin · Srbija · Termini su realni
          </p>
        </div>
      </section>
    </article>
  );
}
