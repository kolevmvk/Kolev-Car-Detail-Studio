import Link from "next/link";
import { media, video } from "@/features/story/content";
import { HeadlightHold } from "./HeadlightHold";
import { StoryImage } from "./StoryImage";
import { StoryVideo } from "./StoryVideo";
import { TimeScene } from "./TimeFrame";

/**
 * NEKAD · SADA · PONOVO — the public story experience.
 *
 * Eight cinematic scenes following one ordinary Golf from the memory of
 * being new, through unnoticed decline, into the studio, and back out.
 *
 * Visual continuity: the same grey Golf Mk7 (Soran Ali / Pexels) appears
 * across scenes as the protagonist. It is stock media — not a Kolev
 * customer job. Asset slots in src/features/story/content.ts are ready
 * to accept authentic media without structural changes.
 */
export function StoryPage() {
  return (
    <article className="story">
      <h1 className="sr-only">
        Auto detajling u Negotinu — od prvog dana do povratka utiska
      </h1>

      {/* ── SCENE 01 — NEKAD ── Memory / The first day ──────────────────── */}
      <section className="scene scene--memory" aria-labelledby="s1">
        <div className="scene__media">
          <StoryImage
            src={media.openingHero}
            alt="Sivi Golf na putu kroz brda — auto kad je još bio centar pažnje."
            priority
            className="story-img crop-golf-opening"
          />
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="scene__copy scene__copy--low">
          <p className="scene__label">Studio · Negotin</p>
          <p id="s1" className="scene__headline">
            Sećaš se?
          </p>
        </div>
      </section>

      {/* ── SCENE 02 — VREME ── Time passing (scroll-linked) ───────────── */}
      <TimeScene />

      {/* ── SCENE 03 — PREPOZNAVANJE ── Recognition — visual rest ─────── */}
      <section className="scene scene--recognition" aria-labelledby="s3">
        <div className="scene__copy scene__copy--text-only">
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

      {/* ── SCENE 04 — ULAZ ── Entry — foam on headlight, transition ────── */}
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

      {/* ── SCENE 05 — ZANAT ── Craft — cinematic cut sequence ──────────── */}
      <section className="scene scene--craft" aria-labelledby="s5-label">
        <p className="sr-only" id="s5-label">Zanat</p>

        {/* Cut A: aged headlight — the detail that tells the story */}
        <div className="cut">
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

        {/* Cut B: polishing process video — the work of correction */}
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

        {/* Cut C: interior extraction — seat fabric, honest process */}
        <div className="cut cut--accent">
          <div className="cut__media">
            <StoryImage
              src={media.craftSeat}
              alt="Mokra ekstrakcija tkanja sedišta — godišnji slojevi idu jedan po jedan."
              className="story-img"
            />
            <span className="grain" aria-hidden="true" />
          </div>
          <p className="cut__label" aria-hidden="true">enterijer</p>
        </div>

        {/* Cut D: interior detailing video — hands, material, care */}
        <div className="cut cut--foam">
          <div className="cut__media">
            <StoryVideo
              src={video.interiorProcess}
              poster={media.craftInteriorPoster}
              alt="Ručni rad na unutrašnjosti — četkica, krpa, detalj."
              className="story-video"
            />
          </div>
        </div>

        {/* Copy cut — craft statement */}
        <div className="cut cut--copy">
          <p className="scene__headline">
            Skidamo godine
            <br />
            sa izgleda.
          </p>
          <p className="scene__note">Ne sa papira.</p>
        </div>
      </section>

      {/* ── SCENE 06 — TRANSFORMACIJA ── Hold-to-reveal ─────────────────── */}
      <section className="scene scene--transformation" aria-labelledby="s6">
        <div className="scene__copy scene__copy--pad">
          <p id="s6" className="scene__label">Rad · Rezultat</p>
        </div>
        <HeadlightHold />
      </section>

      {/* ── SCENE 07 — POVRATAK ── Return — Golf back on the road ─────────── */}
      <section className="scene scene--return" aria-labelledby="s7">
        <div className="scene__media">
          <StoryImage
            src={media.returnCar}
            alt="Isti Golf, drugi osećaj — more i asfalt, sjaj koji se vratio."
            className="story-img crop-golf-return"
          />
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="scene__copy scene__copy--low">
          <p className="scene__label">Studio · Negotin</p>
          <p id="s7" className="scene__headline">
            Ne vraćamo vreme.
            <br />
            Vraćamo ono što je
            <br />
            vreme sakrilo.
          </p>
        </div>
      </section>

      {/* ── SCENE 08 — AKCIJA ── Action — natural story end ─────────────── */}
      <section className="scene scene--action" aria-labelledby="s8">
        <div className="scene__copy">
          <p className="scene__label">Kolev Car Detailing</p>
          <p id="s8" className="scene__headline scene__headline--sm">
            Hoćeš da vidiš šta
            <br />
            možemo da vratimo
            <br />
            tvom autu?
          </p>
          <p className="scene__note">
            Slobodni termini se prikazuju samo kada ih studio stvarno otvori.
          </p>
          <Link className="action__btn" href="/booking">
            Pogledaj prvi slobodan termin
          </Link>
          <p className="scene__meta">Negotin · Srbija</p>
        </div>
      </section>
    </article>
  );
}
