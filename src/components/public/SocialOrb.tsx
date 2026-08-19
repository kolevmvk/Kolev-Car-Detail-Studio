"use client";

import type { CSSProperties } from "react";
import { useEffect, useId, useState } from "react";
import type { PublicSocialLinks } from "@/features/content/social";
import {
  SOCIAL_NETWORKS,
  SocialNetworkIcon,
} from "./SocialDock";

function SealMark() {
  const uid = useId().replace(/:/g, "");
  const face = `${uid}-face`;
  const rim = `${uid}-rim`;
  const ticks = Array.from({ length: 40 }, (_, i) => {
    const a = (i / 40) * Math.PI * 2;
    const inner = 36.2;
    const outer = 39.2;
    return {
      x1: 40 + Math.cos(a) * inner,
      y1: 40 + Math.sin(a) * inner,
      x2: 40 + Math.cos(a) * outer,
      y2: 40 + Math.sin(a) * outer,
    };
  });

  return (
    <svg className="social-orb__seal" viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <radialGradient id={face} cx="34%" cy="30%" r="68%">
          <stop offset="0%" stopColor="#6a5a46" />
          <stop offset="42%" stopColor="#2a241c" />
          <stop offset="100%" stopColor="#0b0a09" />
        </radialGradient>
        <linearGradient id={rim} x1="18%" y1="8%" x2="86%" y2="92%">
          <stop offset="0%" stopColor="#f6e7b8" />
          <stop offset="38%" stopColor="#e4c37a" />
          <stop offset="100%" stopColor="#8d6a32" />
        </linearGradient>
      </defs>
      <circle cx="40" cy="40" r="39.5" fill={`url(#${rim})`} />
      {ticks.map((tick) => (
        <line
          key={`${tick.x1}-${tick.y1}`}
          x1={tick.x1}
          y1={tick.y1}
          x2={tick.x2}
          y2={tick.y2}
          stroke="#1a1612"
          strokeWidth="1.15"
        />
      ))}
      <circle cx="40" cy="40" r="33.8" fill={`url(#${face})`} />
      <circle cx="40" cy="40" r="33.8" fill="none" stroke="#e4c37a" strokeWidth="1.35" />
      <circle cx="40" cy="40" r="27.4" fill="none" stroke="rgba(228,195,122,0.48)" strokeWidth="0.85" />
      <ellipse cx="30" cy="26" rx="16" ry="9" fill="rgba(255,244,214,0.16)" />
      <text
        x="40"
        y="49"
        textAnchor="middle"
        fill="#e4c37a"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="36"
        fontWeight="700"
      >
        K
      </text>
    </svg>
  );
}

export function SocialOrb({ links }: { links: PublicSocialLinks }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClose = () => setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("kolev:close-orb", onClose);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("kolev:close-orb", onClose);
    };
  }, []);

  return (
    <div className="social-orb" data-open={open}>
      <button
        type="button"
        className="social-orb__core"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? "Zatvori mreže" : "Otvori mreže"}
        onClick={() => setOpen((value) => !value)}
      >
        <SealMark />
      </button>

      <nav id={panelId} className="social-orb__links" aria-label="Društvene mreže" data-open={open}>
        {SOCIAL_NETWORKS.map((network, index) => {
          const href = links[network.id]?.trim() || "";
          const style = { "--i": index } as CSSProperties;
          const inner = (
            <>
              <span className="social-orb__disc">
                <SocialNetworkIcon id={network.id} />
              </span>
              <b>{network.label}</b>
            </>
          );

          if (!href) {
            return (
              <span
                key={network.id}
                className="social-orb__item"
                data-network={network.id}
                data-live="false"
                style={style}
                title={`${network.label} još nije objavljen`}
              >
                {inner}
              </span>
            );
          }

          return (
            <a
              key={network.id}
              className="social-orb__item"
              data-network={network.id}
              data-live="true"
              style={style}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={network.label}
            >
              {inner}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
