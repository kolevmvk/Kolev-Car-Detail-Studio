"use client";

import { useState, useTransition } from "react";
import { createBrowserSupabaseClient } from "@/lib/db/browser";
import { useRouter } from "next/navigation";

export function StudioLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const sb = createBrowserSupabaseClient();
      const { error: authError } = await sb.auth.signInWithPassword({
        email,
        password,
      });
      if (authError) {
        setError("Neispravni podaci za prijavu.");
        return;
      }
      router.push("/studio");
      router.refresh();
    });
  }

  return (
    <form className="studio-form" onSubmit={handleSubmit} noValidate>
      {error && <p className="studio-form__error">{error}</p>}
      <div className="studio-field">
        <label className="studio-label" htmlFor="sl-email">Email</label>
        <input
          id="sl-email"
          className="studio-input"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="studio-field">
        <label className="studio-label" htmlFor="sl-password">Lozinka</label>
        <input
          id="sl-password"
          className="studio-input"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button className="studio-btn" type="submit" disabled={isPending}>
        {isPending ? "Prijavljujem…" : "Prijavi se"}
      </button>
    </form>
  );
}
