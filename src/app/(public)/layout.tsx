import { SiteChrome } from "@/components/public/SiteChrome";
import { getStudioPublicLinks } from "@/features/content/public";
import { EMPTY_STUDIO_CONTACT } from "@/features/content/social";

export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const contact = await getStudioPublicLinks().catch(() => EMPTY_STUDIO_CONTACT);

  return (
    <>
      <SiteChrome contact={contact} />
      <main>{children}</main>
    </>
  );
}
