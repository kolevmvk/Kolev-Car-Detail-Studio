"use client";

import Link from "next/link";
import { useRef } from "react";
import { useMountedReducedMotion } from "./useMountedReducedMotion";

/**
 * A button/link that pulls slightly toward the pointer and catches a soft
 * light spotlight where the cursor sits — like light moving across polished
 * paint, not a decorative gimmick. Mouse-only (no-op on touch, where most
 * visitors are); pull is disabled under reduced motion, spotlight stays.
 */
export function MagneticCta({
  href,
  className,
  children,
  ...rest
}: {
  href: React.ComponentProps<typeof Link>["href"];
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLAnchorElement>) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = useMountedReducedMotion();

  function handleMove(e: React.PointerEvent<HTMLAnchorElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    if (reduce) return;
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
    el.style.setProperty("--tx", `${dx}px`);
    el.style.setProperty("--ty", `${dy}px`);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
    </Link>
  );
}
