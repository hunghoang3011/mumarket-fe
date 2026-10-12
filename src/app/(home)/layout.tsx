import { SiteFooter } from "@/shared/ui/shell/SiteFooter";
import { SiteHeader } from "@/shared/ui/shell/SiteHeader";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <SiteHeader overHero />
      <main id="noi-dung" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
