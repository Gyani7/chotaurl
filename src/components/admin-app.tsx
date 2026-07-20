import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  Ban,
  BarChart3,
  Check,
  ChevronDown,
  CircleDollarSign,
  ExternalLink,
  Globe2,
  Link2,
  MoreHorizontal,
  Plus,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Users2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const promos = [
  ["Northstar AI", "https://northstar.example/launch", "Active", "124,821", "$3,744"],
  ["Orbit Cloud", "https://orbit.example/free", "Active", "91,082", "$2,732"],
  ["Forma Design", "https://forma.example/teams", "Paused", "38,429", "$1,152"],
];

export function AdminApp() {
  const [redirectPercent, setRedirectPercent] = useState(20);
  const [saved, setSaved] = useState(false);

  async function savePercentage() {
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ promoRedirectPercent: redirectPercent }),
    }).catch(() => null);
    setSaved(true);
    setTimeout(() => setSaved(false), 1400);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[color:var(--bg)]/85 backdrop-blur-xl">
        <div className="flex h-[68px] items-center justify-between px-4 sm:px-7">
          <div className="flex items-center gap-5">
            <Logo />
            <span className="rounded-md border border-[rgba(255,111,125,.25)] bg-[rgba(255,111,125,.08)] px-2 py-1 text-[8px] font-semibold uppercase tracking-[.12em] text-[var(--danger)]">
              Admin
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/dashboard" className="button-secondary">
              <ArrowLeft size={14} /> Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-9">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[var(--danger)]">
              Platform control
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-.045em]">
              Operations center
            </h1>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Traffic, promotions, trust, users, and revenue at a glance.
            </p>
          </div>
          <button className="button-secondary">
            Last 30 days <ChevronDown size={13} />
          </button>
        </div>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Active users", "84,291", "+12.4%", Users2],
            ["Links created", "1.42M", "+18.2%", Link2],
            ["Redirects", "48.6M", "+21.7%", Activity],
            ["Promo visits", "8.91M", "18.3%", BarChart3],
            ["Revenue", "$267.4K", "+16.8%", CircleDollarSign],
          ].map(([label, value, trend, Icon]) => {
            const CardIcon = Icon as typeof Users2;
            return (
              <article
                key={String(label)}
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5"
              >
                <CardIcon size={16} className="text-[var(--brand)]" />
                <p className="mt-6 text-xl font-semibold tracking-[-.04em]">
                  {String(value)}
                </p>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className="text-[var(--muted)]">{String(label)}</span>
                  <span className="text-[var(--brand)]">{String(trend)}</span>
                </div>
              </article>
            );
          })}
        </section>

        <section className="mt-4 grid gap-4 xl:grid-cols-[.8fr_1.2fr]">
          <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold">Global traffic share</h2>
                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  Maximum eligible traffic sent to promotions
                </p>
              </div>
              <SlidersHorizontal size={17} className="text-[var(--brand)]" />
            </div>
            <div className="mt-9 flex items-end justify-between">
              <strong className="text-5xl tracking-[-.06em]">{redirectPercent}%</strong>
              <span className="text-[10px] text-[var(--muted)]">
                {100 - redirectPercent}% user destination
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={redirectPercent}
              onChange={(event) => setRedirectPercent(Number(event.target.value))}
              className="mt-8 w-full accent-[var(--brand)]"
            />
            <div className="mt-2 flex justify-between text-[9px] text-[var(--subtle)]">
              <span>0%</span>
              <span>Platform maximum 20%</span>
            </div>
            <button onClick={savePercentage} className="button-primary mt-7 w-full">
              {saved ? <Check size={15} /> : null}
              {saved ? "Saved globally" : "Save traffic policy"}
            </button>
          </article>

          <article className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] p-5">
              <div>
                <h2 className="text-sm font-semibold">Promotional URLs</h2>
                <p className="mt-1 text-[10px] text-[var(--muted)]">
                  Weighted destinations supporting the free model
                </p>
              </div>
              <button className="button-primary !min-h-9">
                <Plus size={14} /> Add promotion
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left">
                <thead>
                  <tr className="border-b border-[var(--line)] text-[9px] uppercase tracking-[.12em] text-[var(--subtle)]">
                    <th className="px-5 py-3">Campaign</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Visits</th>
                    <th className="px-4 py-3">Revenue</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {promos.map(([name, url, status, visits, revenue]) => (
                    <tr key={name} className="border-b border-[var(--line)] last:border-0">
                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold">{name}</p>
                        <p className="mt-1 max-w-[210px] truncate text-[9px] text-[var(--muted)]">
                          {url}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-[10px] ${
                            status === "Active"
                              ? "text-[var(--brand)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs">{visits}</td>
                      <td className="px-4 py-4 text-xs">{revenue}</td>
                      <td className="px-4 py-4">
                        <MoreHorizontal size={15} className="text-[var(--subtle)]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-3">
          {[
            {
              icon: ShieldAlert,
              title: "Abuse queue",
              value: "182",
              description: "Links requiring review",
              action: "Review queue",
              color: "var(--danger)",
            },
            {
              icon: Ban,
              title: "Blocked domains",
              value: "12,481",
              description: "Domains denied platform-wide",
              action: "Manage blacklist",
              color: "var(--warning)",
            },
            {
              icon: Globe2,
              title: "Domain health",
              value: "99.94%",
              description: "Branded domains operational",
              action: "View incidents",
              color: "var(--blue)",
            },
          ].map((card) => (
            <article
              key={card.title}
              className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5"
            >
              <div className="flex items-center justify-between">
                <card.icon size={17} style={{ color: card.color }} />
                <span className="size-2 rounded-full bg-[var(--brand)]" />
              </div>
              <p className="mt-6 text-2xl font-semibold">{card.value}</p>
              <p className="mt-1 text-xs font-medium">{card.title}</p>
              <p className="mt-1 text-[10px] text-[var(--muted)]">{card.description}</p>
              <button className="button-quiet mt-4 !min-h-8 !px-0 text-[10px]">
                {card.action} <ExternalLink size={11} />
              </button>
            </article>
          ))}
        </section>

        <section className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]">
          <div className="flex flex-col gap-3 border-b border-[var(--line)] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-semibold">Recent abuse signals</h2>
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                Automated risk scoring and user reports
              </p>
            </div>
            <label className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--subtle)]"
              />
              <input className="input !min-h-9 !pl-9 text-[10px]" placeholder="Search reports" />
            </label>
          </div>
          {[
            ["Phishing pattern", "chotaurl.pro/wallet-verify", "Critical", "2 min ago"],
            ["Malware reputation", "chotaurl.pro/download-setup", "High", "8 min ago"],
            ["Spam velocity", "chotaurl.pro/claim-offer", "Medium", "19 min ago"],
          ].map(([signal, link, risk, time]) => (
            <div
              key={link}
              className="grid gap-3 border-b border-[var(--line)] p-5 last:border-0 sm:grid-cols-[1fr_1fr_90px_90px_32px] sm:items-center"
            >
              <div className="flex items-center gap-2 text-xs font-medium">
                <AlertTriangle size={14} className="text-[var(--danger)]" />
                {signal}
              </div>
              <span className="text-[10px] text-[var(--muted)]">{link}</span>
              <span className="text-[10px] text-[var(--danger)]">{risk}</span>
              <span className="text-[9px] text-[var(--subtle)]">{time}</span>
              <MoreHorizontal size={15} className="text-[var(--subtle)]" />
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
