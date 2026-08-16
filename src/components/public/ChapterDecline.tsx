import { RevealBlock } from "./RevealBlock";
import { ScenePlaceholder } from "./ScenePlaceholder";

export function ChapterDecline() {
  return (
    <section
      className="chapter"
      style={{ background: "var(--color-surface-0)" }}
      aria-label="Vreme je postupno"
    >
      {/* Split composition: two tall portrait crops side by side */}
      <div className="grid grid-cols-2 md:grid-cols-2 gap-px" style={{ background: "var(--color-line-subtle)" }}>
        <div className="relative">
          <ScenePlaceholder
            variant="headlight"
            label="far: novo stanje"
            className="w-full"
            aspectRatio="3 / 4"
          />
          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-12"
            style={{
              background: "linear-gradient(to top, #0d0d0dcc 0%, transparent 100%)",
            }}
          >
            <p
              className="font-mono text-[10px] tracking-widest uppercase opacity-50"
              style={{ color: "var(--color-text-primary-dark)" }}
            >
              2020
            </p>
          </div>
        </div>
        <div className="relative">
          <ScenePlaceholder
            variant="oxidized"
            label="far: posle godina upotrebe"
            className="w-full"
            aspectRatio="3 / 4"
          />
          <div
            className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-12"
            style={{
              background: "linear-gradient(to top, #0d0d0dcc 0%, transparent 100%)",
            }}
          >
            <p
              className="font-mono text-[10px] tracking-widest uppercase opacity-50"
              style={{ color: "var(--color-text-primary-dark)" }}
            >
              Danas
            </p>
          </div>
        </div>
      </div>

      {/* Chapter copy — editorial left-aligned block */}
      <div className="px-5 py-16 md:px-12 md:py-20 lg:px-20 lg:py-24">
        <RevealBlock>
          <p
            className="font-display font-semibold leading-tight mb-4"
            style={{
              fontSize: "clamp(1.75rem, 5vw, 3.5rem)",
              letterSpacing: "-0.02em",
              color: "var(--color-text-primary-dark)",
              maxWidth: "18ch",
            }}
          >
            Nije se promenio odjednom.
          </p>
        </RevealBlock>
        <RevealBlock delay={0.15}>
          <p
            className="font-sans font-light"
            style={{
              fontSize: "clamp(1rem, 2.5vw, 1.375rem)",
              color: "var(--color-text-muted)",
              maxWidth: "42ch",
              lineHeight: "1.6",
            }}
          >
            Samo si prestao da primećuješ.
          </p>
        </RevealBlock>
      </div>
    </section>
  );
}
