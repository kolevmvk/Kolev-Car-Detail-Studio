import Link from "next/link";
import { media, storyVehicle } from "@/features/story/content";
import { HeadlightHold } from "./HeadlightHold";
import { StoryImage } from "./StoryImage";

export function StoryPage() {
  return (
    <article className="story">
      <h1 className="sr-only">
        {storyVehicle.make} {storyVehicle.model} {storyVehicle.year} — od sećanja do povratka
        utiska
      </h1>

      <section className="frame" aria-labelledby="act-memory">
        <div className="frame__media">
          <StoryImage
            src={media.golfNew}
            alt={`${storyVehicle.meta}, 3/4 prednji kadar, čist i poželjan.`}
            priority
            className="story-img crop-hero"
          />
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="frame__caption">
          <p className="kicker">{storyVehicle.meta}</p>
          <p id="act-memory" className="display">
            Sećaš se kako je
            <br />
            Golf izgledao
            <br />
            kada si ga
            <br />
            stvarno gledao?
          </p>
        </div>
      </section>

      <section className="material" aria-label="Materijal dok je još bio nov">
        <figure className="material__lead">
          <span className="material__media">
            <StoryImage
              src={media.headlightClear}
              alt="Čist far: providan polikarbonat, oštar reflektor."
              className="story-img crop-lamp"
            />
          </span>
          <figcaption>Far. Još uvek vidi.</figcaption>
        </figure>
        <figure className="material__inset">
          <span className="material__media material__media--inset">
            <StoryImage
              src={media.seatClean}
              alt="Čisto sivo platno prednjeg sedišta, zategnuto, bez mrlja."
              className="story-img crop-seat"
            />
          </span>
          <figcaption>Sedište. Još uvek svetlo.</figcaption>
        </figure>
      </section>

      <section className="time" aria-labelledby="act-time">
        <div className="time__sticky">
          <div className="time__media">
            <StoryImage
              src={media.golfNew}
              alt=""
              className="story-img time__new crop-hero"
            />
            <StoryImage
              src={media.golfWorn}
              alt={`${storyVehicle.model}, isti kadar posle godina obične upotrebe.`}
              className="story-img time__worn crop-hero"
            />
            <span className="grain" aria-hidden="true" />
          </div>
          <div className="time__copy">
            <p id="act-time" className="display display--sm">
              Nije se promenio odjednom.
            </p>
            <p className="lede">Samo si prestao da primećuješ.</p>
          </div>
        </div>
        <div className="time__mobile-next">
          <div className="frame__media">
            <StoryImage
              src={media.golfWorn}
              alt={`${storyVehicle.model}, isti 3/4 kadar — umoran od godina, ne slomljen.`}
              className="story-img crop-hero"
            />
            <span className="grain" aria-hidden="true" />
          </div>
          <div className="frame__caption">
            <p className="lede">Isti auto. Druge godine.</p>
          </div>
        </div>
      </section>

      <section className="frame" aria-labelledby="act-lens">
        <div className="frame__media">
          <StoryImage
            src={media.headlightOxidized}
            alt="Isti far posle sunca: žut, mutan, godine u plastici."
            className="story-img crop-lamp"
          />
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="frame__caption">
          <p id="act-lens" className="display display--sm">
            Godine ostaju
            <br />
            u saobraćajnoj.
          </p>
          <p className="lede">U faru ostaju samo ako ih ostaviš.</p>
        </div>
      </section>

      <section className="frame" aria-labelledby="act-seat">
        <div className="frame__media">
            <StoryImage
              src={media.seatWorn}
              alt="Isto sivo platno: potamnelo, spljošteno, mrlja u tkanju."
              className="story-img crop-seat"
            />
        </div>
        <div className="frame__caption">
          <p id="act-seat" className="lede">
            Nije drama. Samo se naložilo — šav po šav, zima po zima.
          </p>
        </div>
      </section>

      <section className="recognition" aria-labelledby="act-recognition">
        <p className="kicker kicker--dark">Prepoznavanje</p>
        <p id="act-recognition" className="display display--light">
          Tragovi ne moraju
          <br />
          da ostanu.
        </p>
        <p className="recognition__line">Ne vraćamo kilometre. Vraćamo utisak.</p>
      </section>

      <div className="after-proof">
      <div className="sticky-cta" id="booking-entry">
        <Link className="sticky-cta__btn" href="/booking">
          Pogledaj prvi slobodan termin
        </Link>
      </div>

      <section className="craft" aria-labelledby="act-craft">
        <header className="craft__head">
          <p className="kicker">Studio · Negotin</p>
          <p id="act-craft" className="display display--sm">
            Ulazi auto.
            <br />
            Ostaje posao.
          </p>
        </header>

        <figure className="craft__shot">
          <span className="craft__index">01</span>
          <span className="craft__media">
            <StoryImage
              src={media.processPolish}
              alt="Ruke i jastučić na oksidisanom faru — abrazija, ne magija."
            />
          </span>
          <figcaption>
            <span>Farovi</span>
            Stanje. Priprema. Poliranje. Zaštita. Optika.
          </figcaption>
        </figure>

        <figure className="craft__shot">
          <span className="craft__index">02</span>
          <span className="craft__media">
            <StoryImage
              src={media.processExtract}
              alt="Ekstraktor na sedištu i prljava voda u posudi — dokaz rada."
            />
          </span>
          <figcaption>
            <span>Enterijer</span>
            Tkanje. Ekstrakcija. Prljava voda. Isti ugao posle.
          </figcaption>
        </figure>
      </section>

      <section className="compare" aria-labelledby="act-compare">
        <div className="compare__copy">
          <p id="act-compare" className="display display--sm">
            Isti far.
            <br />
            Druga svetlost.
          </p>
          <p className="lede">Ne klizač. Pritisak — kao ruka na površini.</p>
        </div>
        <HeadlightHold />
      </section>

      <section className="frame frame--beam" aria-labelledby="act-beam">
        <div className="frame__media">
          <StoryImage
            src={media.beamNight}
            alt="Noć: restaurirani far seče snop preko mokrog asfalta."
          />
          <span className="beam-glow" aria-hidden="true" />
        </div>
        <div className="frame__caption">
          <p id="act-beam" className="display display--sm">
            Svetlost se vraća
            <br />
            u far, ne u brojač.
          </p>
        </div>
      </section>

      <section className="frame" aria-labelledby="act-return">
        <div className="frame__media">
          <StoryImage
            src={media.golfRestored}
            alt={`${storyVehicle.meta}, isti 3/4 kadar posle rada — poželjan opet.`}
            className="story-img crop-hero"
          />
          <span className="grain" aria-hidden="true" />
        </div>
        <div className="frame__caption">
          <p className="kicker">{storyVehicle.meta}</p>
          <p id="act-return" className="display">
            Isti auto.
            <br />
            Drugi utisak.
          </p>
          <p className="lede">Ne vraćamo vreme. Vraćamo ono što je vreme sakrilo.</p>
        </div>
      </section>

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
