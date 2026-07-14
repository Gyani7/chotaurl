import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "#product", label: "Product" },
  { href: "#analytics", label: "Analytics" },
  { href: "#developers", label: "Developers" },
  { href: "#model", label: "Why free?" },
];

export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[color:var(--bg)]/78 backdrop-blur-xl">
      <div className="container flex h-[68px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[13px] font-medium text-[var(--muted)] transition-colors hover:text-[var(--text)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <Link href="/login" className="button-quiet hidden sm:inline-flex">
            Sign in
          </Link>
          <Link href="/login?mode=signup" className="button-primary">
            Start free <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}
