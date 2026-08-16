import { RevealBlock } from "./RevealBlock";

export function BookingEntry() {
  return (
    <section
      className="chapter"
      style={{ background: "var(--color-surface-0)" }}
      aria-label="Rezervišite termin"
      id="termin"
    >
      <div
        className="px-5 py-20 md:px-12 md:py-28 lg:px-20 lg:py-32"
        style={{ borderTop: "1px solid var(--color-line-subtle)" }}
      >
        <div className="max-w-screen-lg flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* Left: copy */}
          <div>
            <RevealBlock>
              <p
                className="font-mono text-[11px] tracking-widest uppercase mb-6 opacity-40"
                style={{ color: "var(--color-text-primary-dark)" }}
              >
                Vaš auto čeka
              </p>
            </RevealBlock>
            <RevealBlock delay={0.1}>
              <h2
                className="font-display font-semibold leading-tight mb-6"
                style={{
                  fontSize: "clamp(2rem, 5.5vw, 4rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--color-text-primary-dark)",
                  maxWidth: "22ch",
                }}
              >
                Pogledaj<br />
                prvi slobodan termin.
              </h2>
            </RevealBlock>
            <RevealBlock delay={0.2}>
              <p
                className="font-sans font-light mb-10"
                style={{
                  fontSize: "clamp(0.9375rem, 2vw, 1.125rem)",
                  color: "var(--color-text-muted)",
                  maxWidth: "44ch",
                  lineHeight: "1.7",
                }}
              >
                Ako nisi siguran šta tvom autu treba, pošalji fotografije — dajemo
                procenu pre nego što zakazuješ.
              </p>
            </RevealBlock>
            <RevealBlock delay={0.28}>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/booking"
                  className="inline-flex items-center justify-center font-sans font-medium text-base px-7 py-4 transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                  style={{
                    background: "var(--color-text-primary-dark)",
                    color: "var(--color-surface-0)",
                    minHeight: "52px",
                  }}
                >
                  Pogledaj slobodne termine
                </a>
                <a
                  href="mailto:kolev@detailing.rs"
                  className="inline-flex items-center justify-center font-sans font-medium text-base px-7 py-4 transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                  style={{
                    border: "1px solid var(--color-line-subtle)",
                    color: "var(--color-text-primary-dark)",
                    minHeight: "52px",
                  }}
                >
                  Pošalji fotografije auta
                </a>
              </div>
            </RevealBlock>
          </div>

          {/* Right: studio fact block */}
          <RevealBlock delay={0.35} className="shrink-0">
            <div
              className="border-l-2 pl-6"
              style={{ borderColor: "var(--color-line-subtle)" }}
            >
              <dl className="space-y-4">
                {[
                  { label: "Lokacija", value: "Negotin, Srbija" },
                  { label: "Radno vreme", value: "Pon – Sob · po dogovoru" },
                  { label: "Radovi po najavi", value: "Bez čekanja u redu" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt
                      className="font-mono text-[10px] tracking-widest uppercase mb-0.5 opacity-40"
                      style={{ color: "var(--color-text-primary-dark)" }}
                    >
                      {label}
                    </dt>
                    <dd
                      className="font-sans text-sm"
                      style={{ color: "var(--color-text-primary-dark)" }}
                    >
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </RevealBlock>
        </div>
      </div>
    </section>
  );
}
