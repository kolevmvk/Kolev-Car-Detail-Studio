import { SiteChrome } from "@/components/public/SiteChrome";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteChrome />
      <main>{children}</main>
    </>
  );
}
