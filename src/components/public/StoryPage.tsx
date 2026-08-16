import Link from "next/link";
import { media, video } from "@/features/story/content";
import { HeadlightHold } from "./HeadlightHold";
import { StoryImage } from "./StoryImage";
import { StoryVideo } from "./StoryVideo";
import { TimeFrame } from "./TimeFrame";

export function StoryPage() {
  return (
    <article className="story">
      <h1 className="sr-only">
        Auto detajling u Negotinu — od prvog dana do povratka utiska
      </h1>

      {/* ── Act 1: Opening — the car under full attention ──────────────────── */}
      <section className="frame" aria-labelledby="act-memory">
        <div className="frame__media">
          <StoryImage
            src={media.openingHero}
            alt="Auto u gustoj peni — karoserija se tretira od ivice do ivice."
            priority
            className="story-img"
          />
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="frame__caption">
          <p className="kicker">Studio · Negotin</p>
          <p id="act-memory" className="display">
            Sećaš se kako je
            <br />
            auto izgledao
            <br />
            kada si ga
            <br />
            stvarno gledao?
          </p>
        </div>
      </section>

      {/* ── Act 2: Material — what care preserves ──────────────────────────── */}
      <section className="material" aria-label="Materijal koji zahteva pažnju">
        <figure className="material__lead">
          <span className="material__media">
            <StoryImage
              src={media.materialLead}
              alt="Rotaciona mašina na karoseriji — sjaj koji dolazi od rada, ne od filtera."
              className="story-img"
            />
          </span>
          <figcaption>Lak. Kada se radi pravo.</figcaption>
        </figure>
        <figure className="material__inset">
          <span className="material__media material__media--inset">
            <StoryImage
              src={media.materialInset}
              alt="Čisto kožno sedište — jasna tekstura, bez naslaga."
              className="story-img"
            />
          </span>
          <figcaption>Enterijer. Kakav može opet biti.</figcaption>
        </figure>
      </section>

      {/* ── Act 3: Time — exterior work dissolves to interior work ─────────── */}
      <TimeFrame />

      {/* ── Act 4: Recognition — the turning point ─────────────────────────── */}
      <section className="recognition" aria-labelledby="act-recognition">
        <p className="kicker kicker--dark">Prepoznavanje</p>
        <p id="act-recognition" className="display display--light">
          Tragovi ne moraju
          <br />
          da ostanu.
        </p>
        <p className="recognition__line">Ne vraćamo kilometre. Vraćamo utisak.</p>
      </section>

      {/* ── After-proof: booking CTA stays present through the proof section ── */}
      <div className="after-proof">
        <div className="sticky-cta" id="booking-entry">
          <Link className="sticky-cta__btn" href="/booking">
            Pogledaj prvi slobodan termin
          </Link>
        </div>

        {/* ── Act 5: Craft — three service categories with process proof ────── */}
        <section className="craft" aria-labelledby="act-craft">
          <header className="craft__head">
            <p className="kicker">Studio · Negotin</p>
            <p id="act-craft" className="display display--sm">
              Ulazi auto.
              <br />
              Ostaje posao.
            </p>
          </header>

          {/* Lead: headlight process + paint video overlaid */}
          <figure className="craft__lead">
            <span className="craft__index">01 · farovi</span>
            <span className="craft__media craft__media--video">
              <StoryImage
                src={media.craftHeadlight}
                alt="Mašina na faru — abrazija, poliranje, zaštita."
                className="story-img"
              />
              <StoryVideo
                src={video.polishProcess}
                poster={media.craftVideoPoster}
                alt="Rotaciona korekcija laka — bliski kadar bez rezova."
              />
            </span>
            <figcaption>
              <span>Farovi · Lak</span>
              Stanje. Priprema. Poliranje. Zaštita. Optika.
            </figcaption>
          </figure>

          {/* Inset: extraction overlaps the lead */}
          <figure className="craft__inset">
            <span className="craft__index">02 · enterijer</span>
            <span className="craft__media craft__media--inset">
              <StoryImage
                src={media.craftExtract}
                alt="Ekstraktor na tkanini sedišta — mokra ekstrakcija, ne površinsko čišćenje."
                className="story-img"
              />
            </span>
            <figcaption>
              <span>Enterijer</span>
              Tkanje. Ekstrakcija. Plastike. Isti ugao posle.
            </figcaption>
          </figure>
        </section>

        {/* ── Act 6: Compare — press-and-hold process → result ──────────────── */}
        <section className="compare" aria-labelledby="act-compare">
          <div className="compare__copy">
            <p id="act-compare" className="display display--sm">
              Isti prostor.
              <br />
              Drugi materijal.
            </p>
            <p className="lede">Ne klizač. Pritisak — kao ruka koja briše.</p>
          </div>
          <HeadlightHold />
        </section>

        {/* ── Act 7: Return — the workshop is where the change happens ──────── */}
        <section className="frame" aria-labelledby="act-return">
          <div className="frame__media">
            <StoryImage
              src={media.returnWorkshop}
              alt="Mehaničar polira auto u otvorenoj garaži — pažnja bez prečice."
              className="story-img"
            />
            <span className="grain" aria-hidden="true" />
          </div>
          <div className="frame__caption">
            <p className="kicker">Studio · Negotin</p>
            <p id="act-return" className="display">
              Isti auto.
              <br />
              Drugi utisak.
            </p>
            <p className="lede">Ne vraćamo vreme. Vraćamo ono što je vreme sakrilo.</p>
          </div>
        </section>

        {/* ── Act 8: Close — truthful booking entry ─────────────────────────── */}
        <section className="close" aria-labelledby="act-close">
          <p className="kicker">Kolev Car Detailing</p>
          <p id="act-close" className="display display--sm">
            Tvoj auto.
            <br />
            Isti kadar.
          </p>
          <p className="lede close__note">
            Slobodni termini se prikazuju samo kada ih studio stvarno otvori. Nema lažne
            popunjenosti.
          </p>
          <Link className="close__btn" href="/booking">
            Pogledaj prvi slobodan termin
          </Link>
          <p className="close__meta">Negotin · Srbija</p>
        </section>
      </div>
    </article>
  );
}
