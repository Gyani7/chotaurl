import { Link2Off } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-5 text-center">
      <div className="max-w-md">
        <Logo />
        <Link2Off size={34} className="mx-auto mt-12 text-[var(--subtle)]" />
        <p className="mt-5 text-xs font-semibold uppercase tracking-[.16em] text-[var(--brand)]">
          404 · Page not found
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-.04em]">
          This page does not exist.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          The link may be broken or the page may have moved.
        </p>
        <Link to="/" className="button-primary mt-7">
          Go to ChotaURL
        </Link>
      </div>
    </main>
  );
}
