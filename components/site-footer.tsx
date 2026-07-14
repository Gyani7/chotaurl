import Link from "next/link";
import { Logo } from "@/components/logo";

const groups = [
  {
    label: "Product",
    links: ["Links", "Analytics", "QR codes", "Custom domains"],
  },
  {
    label: "Resources",
    links: ["API docs", "Status", "Security", "Changelog"],
  },
  {
    label: "Company",
    links: ["About", "Fair traffic", "Privacy", "Terms"],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--line)] py-12">
      <div className="container grid gap-12 md:grid-cols-[1.4fr_2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--muted)]">
            Premium link infrastructure for everyone, funded by fair and transparent
            traffic sharing.
          </p>
          <p className="mt-8 text-xs text-[var(--subtle)]">
            © {new Date().getFullYear()} ChotaURL. Built for the open web.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--subtle)]">
                {group.label}
              </p>
              <div className="grid gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    className="text-sm text-[var(--muted)] transition-colors hover:text-[var(--text)]"
                  >
                    {link}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
