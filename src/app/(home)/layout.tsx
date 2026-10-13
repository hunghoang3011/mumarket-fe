import { SiteFooter } from "@/shared/ui/shell/SiteFooter";
import { SiteHeader } from "@/shared/ui/shell/SiteHeader";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="atmo-wuxia flex min-h-full flex-1 flex-col">
      <SiteHeader overHero />
      <main id="noi-dung" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
