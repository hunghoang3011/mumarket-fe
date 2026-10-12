import { SiteFooter } from "@/shared/ui/shell/SiteFooter";
import { SiteHeader } from "@/shared/ui/shell/SiteHeader";

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader />
      <main id="noi-dung" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
