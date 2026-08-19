"use client";

import type { CSSProperties } from "react";
import type { PublicSocialLinks } from "@/features/content/social";

export const SOCIAL_NETWORKS = [
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "viber", label: "Viber" },
  { id: "telegram", label: "Telegram" },
] as const;

export type SocialNetworkId = (typeof SOCIAL_NETWORKS)[number]["id"];

export function SocialNetworkIcon({ id }: { id: SocialNetworkId }) {
  if (id === "instagram") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <rect className="social-icon__plate" x="3.2" y="3.2" width="25.6" height="25.6" rx="8.2" />
        <circle className="social-icon__lens" cx="16" cy="16.2" r="5.6" />
        <circle className="social-icon__dot" cx="22.8" cy="9.4" r="1.7" />
      </svg>
    );
  }
  if (id === "facebook") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle className="social-icon__plate" cx="16" cy="16" r="12.6" />
        <path
          className="social-icon__glyph"
          d="M18.7 26V17.2h3.2l.5-3.6h-3.7v-2.2c0-1 .3-1.8 1.8-1.8h2V6.2c-.4-.1-1.7-.2-3.2-.2-3.2 0-5.4 1.9-5.4 5.4v2.2H11v3.6h2.9V26z"
        />
      </svg>
    );
  }
  if (id === "tiktok") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle className="social-icon__plate" cx="16" cy="16" r="12.6" />
        <path
          className="social-icon__note social-icon__note--offset"
          d="M19.8 7.1c1 1.9 2.6 3.2 4.8 3.6v3.2c-1.7 0-3.3-.5-4.8-1.4v7c0 3.7-3 6.1-6.7 6.1S6.5 23.2 6.5 19.5s2.9-6.1 6.6-6.1c.4 0 .9.1 1.3.2v3.4c-.4-.1-.8-.2-1.3-.2-1.9 0-3.2 1.4-3.2 3.1s1.3 3.1 3.2 3.1 3.2-1.4 3.2-3.1V7.1h3.5z"
        />
        <path
          className="social-icon__note"
          d="M19.8 7.1c1 1.9 2.6 3.2 4.8 3.6v3.2c-1.7 0-3.3-.5-4.8-1.4v7c0 3.7-3 6.1-6.7 6.1S6.5 23.2 6.5 19.5s2.9-6.1 6.6-6.1c.4 0 .9.1 1.3.2v3.4c-.4-.1-.8-.2-1.3-.2-1.9 0-3.2 1.4-3.2 3.1s1.3 3.1 3.2 3.1 3.2-1.4 3.2-3.1V7.1h3.5z"
        />
      </svg>
    );
  }
  if (id === "whatsapp") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          className="social-icon__plate"
          d="M16 5.2A10.8 10.8 0 0 0 6.6 21.6L5.8 27l5.5-.8A10.8 10.8 0 1 0 16 5.2z"
        />
        <path
          className="social-icon__glyph"
          d="M12.1 11.6c-.3-.7-.6-.7-.9-.7h-.7c-.3 0-.7.1-1 .5s-1.1 1.1-1.1 2.6 1.1 3 1.2 3.2 2.1 3.4 5.2 4.6c2.5.9 3 .8 3.5.7s1.7-.7 1.9-1.4.2-1.2.2-1.4-.3-.3-.7-.5-1.7-.8-1.9-.9-.5-.2-.7.2-.8.9-.9 1.1-.4.3-.7.1c-.3-.2-1.3-.5-2.5-1.5-1-.8-1.6-1.8-1.8-2.1s0-.5.1-.6.3-.3.4-.5.2-.3.3-.5.1-.4 0-.5-.7-1.7-1-2.3z"
        />
      </svg>
    );
  }
  if (id === "viber") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          className="social-icon__plate"
          d="M9.1 5.6h13.8A4.5 4.5 0 0 1 27.4 10v9.5a4.5 4.5 0 0 1-4.5 4.3h-4.2L12.8 27.4v-3.6H9.1A4.5 4.5 0 0 1 4.6 19.3V10a4.5 4.5 0 0 1 4.5-4.4z"
        />
        <path
          className="social-icon__glyph"
          d="M13.2 11.6c2.6-1.1 6.2-.4 7.5 2.4.2.4 0 .6-.3.6h-.8c-.3 0-.5-.2-.6-.4-.7-1.5-3.1-2-4.8-1.1-.3.1-.6 0-.7-.3l-.3-.7c-.1-.4.1-.6.6-.8zm-.7 2.1c.2-.4.6-.4.8-.2 1.4.7 3.2.9 4.4.1.3-.2.6-.1.7.2l.2.7c.1.4 0 .6-.4.7-1.6 1-4.1.7-5.8-.3-.3-.2-.4-.5-.2-.8zm2.6 2.2c.7.7 2 .8 2.6.2.3-.3.6-.3.7 0l.5.5c.3.3.2.6-.1.8-1.2 1.2-3.3 1-4.5-.2l-.5-.5c-.3-.3-.2-.6.1-.8z"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle className="social-icon__plate" cx="16" cy="16" r="12.6" />
      <path
        className="social-icon__plane"
        d="M7.2 15.6 25.4 7.8c.7-.3 1.4.4 1.1 1.1L20.4 25.6c-.3.8-1.5.7-1.8-.1l-2.9-7.4-8.2-2c-.8-.2-.8-1.3-.3-1.5z"
      />
      <path className="social-icon__fold" d="M15.6 17.9 25.2 9.2" />
    </svg>
  );
}

export function SocialDock({
  links,
  variant = "dock",
}: {
  links: PublicSocialLinks;
  variant?: "dock" | "menu" | "board";
}) {
  return (
    <nav className={`social-dock social-dock--${variant}`} aria-label="Društvene mreže">
      {SOCIAL_NETWORKS.map((network, index) => {
        const href = links[network.id]?.trim() || "";
        const className = "social-dock__item";
        const style = { "--dock-index": index } as CSSProperties;
        const inner = (
          <>
            <SocialNetworkIcon id={network.id} />
            <span className="social-dock__name">{network.label}</span>
          </>
        );

        if (!href) {
          return (
            <span
              key={network.id}
              className={className}
              data-network={network.id}
              data-live="false"
              style={style}
              title={`${network.label} link još nije objavljen iz Studija`}
            >
              {inner}
            </span>
          );
        }

        return (
          <a
            key={network.id}
            className={className}
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
  );
}
