import Link from "next/link";
import { Logo } from "@/components/icons/Logo";

export function Header() {
  return (
    <header className="py-4 px-4 sm:px-6 lg:px-8 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold font-headline text-primary">
            XINOVA696
          </span>
        </Link>
      </div>
    </header>
  );
}
