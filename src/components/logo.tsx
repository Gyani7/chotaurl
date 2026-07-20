import { Link } from "react-router-dom";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2.5" aria-label="ChotaURL home">
      <span className="relative grid size-8 place-items-center overflow-hidden rounded-[10px] bg-[var(--brand)] text-[var(--brand-ink)] shadow-[0_0_24px_rgba(146,235,40,.2)]">
        <span className="absolute h-[3px] w-4 rotate-[-35deg] rounded-full bg-current" />
        <span className="absolute h-[3px] w-4 translate-x-[5px] translate-y-[-5px] rotate-[-35deg] rounded-full bg-current opacity-60" />
      </span>
      {!compact && (
        <span className="text-[15px] font-bold tracking-[-0.03em]">
          Chota<span className="text-[var(--brand)]">URL</span>
        </span>
      )}
    </Link>
  );
}
