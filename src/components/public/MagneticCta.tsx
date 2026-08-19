"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  function handleMove(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
    const key = el.querySelector<HTMLElement>(".booking-key__object");
    const keyRect = key?.getBoundingClientRect() ?? rect;
    const keyX = Math.min(1, Math.max(0, (e.clientX - keyRect.left) / keyRect.width));
    const keyY = Math.min(1, Math.max(0, (e.clientY - keyRect.top) / keyRect.height));
    el.style.setProperty("--kx", `${keyX * 100}%`);
    el.style.setProperty("--ky", `${keyY * 100}%`);
    el.style.setProperty("--key-rx", `${(0.5 - keyY) * 24}deg`);
    el.style.setProperty("--key-ry", `${(keyX - 0.5) * 30}deg`);
    if (reduce) return;
    if (e.pointerType !== "mouse") return;
    const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.16;
    const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.16;
    const rx = ((e.clientY - (rect.top + rect.height / 2)) / rect.height) * -4;
    const ry = ((e.clientX - (rect.left + rect.width / 2)) / rect.width) * 5;
    el.style.setProperty("--tx", `${dx}px`);
    el.style.setProperty("--ty", `${dy}px`);
    el.style.setProperty("--rx", `${rx}deg`);
    el.style.setProperty("--ry", `${ry}deg`);
  }

  function handleDown(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    el.dataset.pressed = "true";
    el.setPointerCapture(e.pointerId);
    handleMove(e);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(9);
    }
  }

  function handleUp(e: React.PointerEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    delete el.dataset.pressed;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
  }

  function handleLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tx", "0px");
    el.style.setProperty("--ty", "0px");
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--key-rx", "-7deg");
    el.style.setProperty("--key-ry", "-12deg");
  }

  function handleClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();
    const el = ref.current;
    if (!el || el.dataset.activating === "true") return;
    el.dataset.activating = "true";
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([12, 32, 16]);
    }
    const destination = typeof href === "string" ? href : (href.pathname ?? "/");
    window.setTimeout(() => router.push(destination as Route), reduce ? 0 : 320);
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={className}
      onPointerMove={handleMove}
      onPointerDown={handleDown}
      onPointerUp={handleUp}
      onPointerCancel={handleUp}
      onPointerLeave={handleLeave}
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          ref.current?.setAttribute("data-pressed", "true");
        }
      }}
      onKeyUp={() => ref.current?.removeAttribute("data-pressed")}
      {...rest}
    >
      {children}
    </Link>
  );
}
