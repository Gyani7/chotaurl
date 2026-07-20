import { Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

export function ExpiredPage() {
  return (
    <main className="grid min-h-screen place-items-center p-5 text-center">
      <div className="max-w-md">
        <Logo />
        <Clock3 size={34} className="mx-auto mt-12 text-[var(--warning)]" />
        <h1 className="mt-5 text-3xl font-semibold tracking-[-.04em]">
          This link has expired.
        </h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          The owner set an expiration date or click limit for this destination.
        </p>
        <Link to="/" className="button-secondary mt-7">
          Create a new link
        </Link>
      </div>
    </main>
  );
}
