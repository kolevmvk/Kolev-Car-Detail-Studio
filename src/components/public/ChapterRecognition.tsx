import { RevealBlock } from "./RevealBlock";

export function ChapterRecognition() {
  return (
    <section
      className="chapter"
      style={{ background: "var(--color-surface-light)" }}
      aria-label="Prepoznavanje"
    >
      <div className="px-5 py-20 md:px-12 md:py-28 lg:py-36">
        {/* Narrow editorial column — not centered: left-anchored on mobile, offset on desktop */}
        <div className="max-w-screen-md lg:pl-[15%]">
          <RevealBlock>
            <p
              className="font-mono text-[11px] tracking-widest uppercase mb-10 opacity-40"
              style={{ color: "var(--color-text-primary-light)" }}
            >
              Prepoznavanje
            </p>
          </RevealBlock>

          <RevealBlock delay={0.1}>
            <blockquote
              className="font-display font-semibold leading-tight mb-8"
              style={{
                fontSize: "clamp(2rem, 6vw, 4.5rem)",
                letterSpacing: "-0.02em",
                color: "var(--color-text-primary-light)",
                maxWidth: "20ch",
              }}
            >
              <span className="block">Godine ostaju</span>
              <span className="block">u saobraćajnoj.</span>
              <span
                className="block mt-2"
                style={{ color: "var(--color-accent)", fontStyle: "italic" }}
              >
                Tragovi ne moraju.
              </span>
            </blockquote>
          </RevealBlock>

          <RevealBlock delay={0.25}>
            <div
              className="w-12 h-px mb-8"
              style={{ background: "var(--color-text-muted)", opacity: 0.4 }}
              aria-hidden="true"
            />
          </RevealBlock>

          <RevealBlock delay={0.3}>
            <p
              className="font-sans font-light"
              style={{
                fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
                color: "var(--color-text-muted)",
                maxWidth: "52ch",
                lineHeight: "1.75",
              }}
            >
              Svaki auto prolazi kroz isto. Polako, neprimetno. Ne zbog nehata — zbog
              svakodnevnice. Ono što je ostalo ispod prljavštine, mrlja i pomućenog laka
              nije izgubljeno. Samo čeka.
            </p>
          </RevealBlock>

          <RevealBlock delay={0.4}>
            <p
              className="font-sans font-semibold mt-8"
              style={{
                fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
                color: "var(--color-text-primary-light)",
              }}
            >
              Ne vraćamo kilometre. Vraćamo utisak.
            </p>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
