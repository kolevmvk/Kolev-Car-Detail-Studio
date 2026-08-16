import { RevealBlock } from "./RevealBlock";
import { ScenePlaceholder } from "./ScenePlaceholder";

const headlightStages = [
  {
    variant: "oxidized" as const,
    label: "far: stanje pre rada — pomućen lak",
    step: "01",
    caption: "Stanje",
    description: "Organski lak farova degradira od UV i vremenskih uticaja. Rezultat: gubitak optičke jasnoće.",
  },
  {
    variant: "process" as const,
    label: "far: abrazivna korekcija i zaštita",
    step: "02",
    caption: "Postupak",
    description: "Mehanička korekcija, višestepeno poliranje, nanošenje UV zaštite. Bez zamene farova.",
  },
  {
    variant: "clear" as const,
    label: "far: optička jasnoća — posle rada",
    step: "03",
    caption: "Rezultat",
    description: "Optička jasnoća vraćena. Noćna vidljivost i estetika kao pre degradacije.",
  },
];

export function ChapterWorkshop() {
  return (
    <section
      className="chapter"
      style={{ background: "var(--color-surface-1)" }}
      aria-label="Radionica — restauracija farova"
    >
      {/* Section header */}
      <div className="px-5 pt-16 pb-12 md:px-12 md:pt-20 lg:px-20">
        <RevealBlock>
          <p
            className="font-mono text-[11px] tracking-widest uppercase mb-6 opacity-40"
            style={{ color: "var(--color-text-primary-dark)" }}
          >
            Proces restauracije farova
          </p>
        </RevealBlock>
        <RevealBlock delay={0.1}>
          <h2
            className="font-display font-semibold leading-tight"
            style={{
              fontSize: "clamp(2rem, 5.5vw, 4rem)",
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary-dark)",
              maxWidth: "22ch",
            }}
          >
            Tri koraka do svetlosnog sjaja.
          </h2>
        </RevealBlock>
      </div>

      {/* Process grid — 3 portrait scenes stacked on mobile, side by side on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: "var(--color-line-subtle)" }}>
        {headlightStages.map((stage, i) => (
          <RevealBlock key={stage.step} delay={i * 0.12} className="flex flex-col">
            <ScenePlaceholder
              variant={stage.variant}
              label={stage.label}
              className="w-full flex-1"
              aspectRatio="4 / 5"
            />
            <div
              className="px-5 py-6 md:px-6"
              style={{ background: "var(--color-surface-1)" }}
            >
              <div className="flex items-baseline gap-3 mb-2">
                <span
                  className="font-mono text-[10px] tracking-widest"
                  style={{ color: "var(--color-accent)", opacity: 0.8 }}
                >
                  {stage.step}
                </span>
                <span
                  className="font-display font-semibold text-base tracking-wide uppercase"
                  style={{ color: "var(--color-text-primary-dark)" }}
                >
                  {stage.caption}
                </span>
              </div>
              <p
                className="font-sans font-light text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {stage.description}
              </p>
            </div>
          </RevealBlock>
        ))}
      </div>

      {/* Interior teaser — a second work category, single horizontal strip */}
      <div className="px-5 pt-12 pb-16 md:px-12 md:pt-16 lg:px-20">
        <RevealBlock>
          <div
            className="flex flex-col md:flex-row gap-6 md:gap-12 items-start md:items-center pt-8"
            style={{ borderTop: "1px solid var(--color-line-subtle)" }}
          >
            <div className="flex-1">
              <p
                className="font-mono text-[11px] tracking-widest uppercase mb-3 opacity-40"
                style={{ color: "var(--color-text-primary-dark)" }}
              >
                Detaljing enterijera
              </p>
              <p
                className="font-display font-semibold leading-tight"
                style={{
                  fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                  letterSpacing: "-0.01em",
                  color: "var(--color-text-primary-dark)",
                  maxWidth: "20ch",
                }}
              >
                Tekstil, plastike, površine.
              </p>
            </div>
            <div className="flex-1 md:flex-none md:w-72">
              <ScenePlaceholder
                variant="warm"
                label="enterijer: dubinsko čišćenje sedišta"
                className="w-full"
                aspectRatio="16 / 9"
              />
            </div>
          </div>
        </RevealBlock>
      </div>
    </section>
  );
}
