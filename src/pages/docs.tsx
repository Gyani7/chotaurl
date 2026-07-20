import {
  ArrowLeft,
  BarChart3,
  Braces,
  Globe2,
  KeyRound,
  Link2,
  QrCode,
  Users2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/logo";

const endpoints: Array<[string, string, string, LucideIcon]> = [
  ["POST", "/api/v1/links", "Create a smart link", Link2],
  ["GET", "/api/v1/links", "List workspace links", Link2],
  ["GET", "/api/v1/links/:id", "Link details and click history", BarChart3],
  ["PATCH", "/api/v1/links/:id", "Update routing and status", Link2],
  ["POST", "/api/v1/bulk", "Create up to 1,000 links", Braces],
  ["GET", "/api/v1/analytics", "Workspace analytics", BarChart3],
  ["GET", "/api/v1/qr", "Generate SVG or PNG QR codes", QrCode],
  ["GET", "/api/v1/domains", "List branded domains", Globe2],
  ["POST", "/api/v1/domains", "Connect a branded domain", Globe2],
  ["GET", "/api/v1/team", "List members and invitations", Users2],
  ["POST", "/api/v1/team", "Invite a workspace member", Users2],
];

export function DocsPage() {
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--bg)]/85 backdrop-blur-xl">
        <div className="container flex h-[68px] items-center justify-between">
          <Logo />
          <Link to="/" className="button-secondary">
            <ArrowLeft size={14} /> Back home
          </Link>
        </div>
      </header>
      <div className="container grid gap-14 py-16 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[var(--subtle)]">
              Documentation
            </p>
            <nav className="mt-4 grid gap-1 text-xs">
              {["Quick start", "Authentication", "Links", "Analytics", "Domains", "Teams"].map(
                (item, index) => (
                  <a
                    key={item}
                    href={index === 0 ? "#quick-start" : "#endpoints"}
                    className={`rounded-lg px-3 py-2 ${
                      index === 0
                        ? "bg-[var(--surface)] text-[var(--text)]"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {item}
                  </a>
                ),
              )}
            </nav>
          </div>
        </aside>
        <div className="max-w-3xl">
          <span className="eyebrow">
            <Braces size={14} /> REST API
          </span>
          <h1 className="mt-4 text-[clamp(42px,7vw,72px)] font-semibold leading-[.96] tracking-[-.06em]">
            Build links into anything.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            A predictable JSON API for smart links, targeting, QR codes, analytics,
            branded domains, and workspace automation.
          </p>

          <section id="quick-start" className="mt-16">
            <h2 className="text-2xl font-semibold tracking-[-.035em]">Quick start</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Create a scoped API key in Developer API, then send it as a bearer token.
              Browser sessions may use Supabase authentication cookies instead.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#090b0f]">
              <div className="flex items-center gap-2 border-b border-white/8 px-5 py-3 text-[10px] text-[#858b98]">
                <KeyRound size={12} /> Create your first link
              </div>
              <pre className="overflow-x-auto p-5 text-[11px] leading-6 text-[#abb1bc]">
                <code>{`curl -X POST https://chotaurl.pro/api/v1/links \\
  -H "Authorization: Bearer ch_live_••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "destination": "https://example.com/launch",
    "alias": "launch",
    "acceptedTrafficShare": true
  }'`}</code>
              </pre>
            </div>
            <div className="mt-5 rounded-xl border border-[rgba(138,124,255,.2)] bg-[rgba(138,124,255,.06)] p-4 text-xs leading-6 text-[var(--muted)]">
              <strong className="text-[var(--text)]">Traffic model:</strong> every create
              request must explicitly send <code>acceptedTrafficShare: true</code>.
              Eligible promotional traffic is capped globally at 20%.
            </div>
          </section>

          <section id="endpoints" className="mt-16">
            <h2 className="text-2xl font-semibold tracking-[-.035em]">Endpoints</h2>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--line)]">
              {endpoints.map(([method, path, description, EndpointIcon]) => {
                return (
                  <div
                    key={`${method}${path}`}
                    className="grid gap-3 border-b border-[var(--line)] bg-[var(--bg-elevated)] p-4 last:border-0 sm:grid-cols-[54px_1fr_1fr] sm:items-center"
                  >
                    <span
                      className={`text-[9px] font-bold ${
                        method === "POST"
                          ? "text-[var(--brand)]"
                          : method === "PATCH"
                            ? "text-[var(--warning)]"
                            : "text-[var(--blue)]"
                      }`}
                    >
                      {method}
                    </span>
                    <code className="text-[11px]">{path}</code>
                    <span className="flex items-center gap-2 text-[10px] text-[var(--muted)]">
                      <EndpointIcon size={12} />
                      {description}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
