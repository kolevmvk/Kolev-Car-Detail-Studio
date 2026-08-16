interface ScenePlaceholderProps {
  variant: "dark" | "headlight" | "warm" | "workshop" | "reveal" | "oxidized" | "process" | "clear";
  label: string;
  className?: string;
  aspectRatio?: string;
}

const gradients: Record<ScenePlaceholderProps["variant"], string> = {
  dark: "radial-gradient(ellipse 120% 80% at 60% 30%, #1e1a14 0%, #0d0d0d 70%)",
  headlight:
    "radial-gradient(ellipse 40% 60% at 75% 50%, #2a2210 0%, #0d0d0d 55%), radial-gradient(ellipse 20% 20% at 75% 50%, #c49a3a20 0%, transparent 70%)",
  warm: "radial-gradient(ellipse 100% 80% at 40% 60%, #2c2218 0%, #18130c 70%)",
  workshop: "radial-gradient(ellipse 100% 80% at 50% 40%, #1c1c1c 0%, #111111 60%)",
  reveal: "radial-gradient(ellipse 140% 100% at 50% 20%, #201c16 0%, #0d0d0d 65%)",
  oxidized:
    "radial-gradient(ellipse 70% 70% at 50% 50%, #3a2e10 0%, #1e1800 60%), radial-gradient(ellipse 40% 40% at 50% 50%, #c4913a18 0%, transparent 70%)",
  process:
    "radial-gradient(ellipse 80% 80% at 50% 50%, #1e1e1e 0%, #141414 70%), linear-gradient(135deg, #2a2a2a 0%, #111111 100%)",
  clear:
    "radial-gradient(ellipse 60% 60% at 50% 50%, #1a2030 0%, #0d1020 60%), radial-gradient(ellipse 30% 30% at 50% 50%, #a0c4e820 0%, transparent 70%)",
};

export function ScenePlaceholder({ variant, label, className = "", aspectRatio }: ScenePlaceholderProps) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: gradients[variant],
        aspectRatio: aspectRatio ?? "16 / 9",
      }}
      role="img"
      aria-label={label}
    >
      <span
        className="absolute bottom-3 right-3 font-mono text-[10px] tracking-wider uppercase opacity-30"
        style={{ color: "var(--color-text-primary-dark)" }}
      >
        {label}
      </span>
    </div>
  );
}
