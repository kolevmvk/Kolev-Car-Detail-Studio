"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveStudioPublicLinks } from "@/features/content/admin-actions";
import type { PublicStudioContact } from "@/features/content/social";
import { EMPTY_STUDIO_CONTACT } from "@/features/content/social";
import { SOCIAL_NETWORKS } from "@/components/public/SocialDock";
import { SocialDock } from "@/components/public/SocialDock";

const hints: Record<(typeof SOCIAL_NETWORKS)[number]["id"], string> = {
  instagram: "https://instagram.com/kolev...",
  facebook: "https://facebook.com/kolev...",
  tiktok: "https://tiktok.com/@kolev...",
  whatsapp: "https://wa.me/3816...",
  viber: "viber://chat?number=%2B3816...",
  telegram: "https://t.me/kolev...",
};

export function StudioLinksEditor({ links }: { links: PublicStudioContact }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState<PublicStudioContact>({
    ...EMPTY_STUDIO_CONTACT,
    ...links,
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    startTransition(async () => {
      const result = await saveStudioPublicLinks({
        phone: values.phone ?? "",
        instagramUrl: values.instagram ?? "",
        facebookUrl: values.facebook ?? "",
        tiktokUrl: values.tiktok ?? "",
        whatsappUrl: values.whatsapp ?? "",
        viberUrl: values.viber ?? "",
        telegramUrl: values.telegram ?? "",
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  return (
    <form className="studio-editor" onSubmit={handleSubmit}>
      <div className="studio-editor__heading">
        <div>
          <p className="studio-kicker">Javni kontakt</p>
          <h2 className="studio-editor__title">Telefon i mreže</h2>
        </div>
      </div>

      {error && <p className="studio-form__error">{error}</p>}
      {saved && <p className="studio-form__success">Objavljeno na sajtu.</p>}

      <div className="studio-form-grid">
        <label className="studio-field studio-field--wide">
          <span className="studio-label">Običan telefon</span>
          <input
            className="studio-input"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+381 64 …"
            value={values.phone ?? ""}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                phone: event.target.value,
              }))
            }
          />
        </label>
        {SOCIAL_NETWORKS.map((network) => (
          <label className="studio-field studio-field--wide" key={network.id}>
            <span className="studio-label">{network.label}</span>
            <input
              className="studio-input"
              name={network.id}
              type="text"
              inputMode="url"
              placeholder={hints[network.id]}
              value={values[network.id] ?? ""}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  [network.id]: event.target.value,
                }))
              }
            />
          </label>
        ))}
      </div>

      <div className="studio-preview">
        <p className="studio-label">Kako će izgledati mreže</p>
        <SocialDock links={values} variant="board" />
      </div>

      <button className="studio-btn studio-editor__submit" type="submit" disabled={isPending}>
        {isPending ? "Čuvam…" : "Sačuvaj i objavi kontakt"}
      </button>
    </form>
  );
}
