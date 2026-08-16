import type { Metadata } from "next";
import { StudioLoginForm } from "@/components/studio/StudioLoginForm";

export const metadata: Metadata = { title: "Prijava" };

export default function StudioLoginPage() {
  return (
    <div className="studio-login">
      <p className="studio-login__mark">Kolev Studio</p>
      <h1 className="studio-login__headline">Prijava</h1>
      <StudioLoginForm />
    </div>
  );
}
