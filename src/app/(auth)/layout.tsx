import Link from "next/link";
import { Wordmark } from "@/shared/ui/Wordmark";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main id="noi-dung" className="flex flex-1 flex-col items-center px-4 py-10">
      <Link href="/" aria-label="GALAXY AUTO — Về trang chủ">
        <Wordmark />
      </Link>
      <div className="mt-8 w-full max-w-md rounded-panel border border-border-subtle bg-surface-panel p-6 sm:p-8">
        {children}
      </div>
    </main>
  );
}
