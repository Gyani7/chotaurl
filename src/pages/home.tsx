import {
  Activity,
  ArrowRight,
  BarChart3,
  Braces,
  Check,
  ChevronRight,
  CircleDot,
  Cloud,
  Code2,
  Globe2,
  KeyRound,
  Layers3,
  Link2,
  LockKeyhole,
  MousePointer2,
  Route,
  ShieldCheck,
  Sparkles,
  Users2,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ShortenForm } from "@/components/shorten-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const features = [
  {
    icon: Route,
    title: "Intent-aware routing",
    text: "Route by country, city, device, OS, and language with predictable fallbacks.",
  },
  {
    icon: BarChart3,
    title: "Real-time intelligence",
    text: "Understand every click across location, referrer, browser, and campaign.",
  },
  {
    icon: Globe2,
    title: "Your brand, everywhere",
    text: "Connect custom domains with automatic SSL and domain health monitoring.",
  },
  {
    icon: LockKeyhole,
    title: "Control access",
    text: "Add expiration, passwords, bot filtering, and private click histories.",
  },
  {
    icon: Users2,
    title: "Built for teams",
    text: "Share workspaces, roles, domains, templates, and analytics without seat limits.",
  },
  {
    icon: Code2,
    title: "API-first by default",
    text: "Create and manage links at scale with stable REST endpoints and scoped API keys.",
  },
];

const activity = [
  { country: "United States", flag: "US", clicks: "4,892", share: 82 },
  { country: "India", flag: "IN", clicks: "3,106", share: 61 },
  { country: "United Kingdom", flag: "GB", clicks: "1,884", share: 43 },
  { country: "Germany", flag: "DE", clicks: "1,296", share: 31 },
];

export function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden">
        <section className="relative min-h-[900px] px-0 pb-28 pt-40 text-center">
          <div className="grid-lines pointer-events-none absolute inset-x-0 top-[68px] h-[650px] opacity-60" />
          <div className="pointer-events-none absolute left-1/2 top-[-80px] h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(146,235,40,.12),transparent_62%)]" />
          <div className="container relative">
            <div className="eyebrow rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 normal-case tracking-normal">
              <Sparkles size={13} />
              Premium features. Zero paywalls.
              <ChevronRight size={13} />
            </div>
            <h1 className="mx-auto mt-7 max-w-[980px] text-[clamp(54px,8.7vw,112px)] font-semibold leading-[0.88] tracking-[-0.075em]">
              Every link,
              <br />
              <span className="text-gradient">working harder.</span>
            </h1>
            <p className="mx-auto mt-8 max-w-[650px] text-[clamp(16px,2vw,20px)] leading-8 text-[var(--muted)]">
              Create smarter links, understand every click, and grow your reach with
              enterprise-grade infrastructure that stays free forever.
            </p>
            <div className="mt-11">
              <ShortenForm />
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[var(--muted)]">
              {["Unlimited links", "No credit card", "All features included"].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <Check size={13} className="text-[var(--brand)]" />
                    {item}
                  </span>
                ),
              )}
            </div>

            <div className="glass relative mx-auto mt-24 max-w-[1050px] rounded-[24px] p-2 text-left">
              <div className="overflow-hidden rounded-[18px] border border-[var(--line)] bg-[var(--bg-elevated)]">
                <div className="flex h-11 items-center justify-between border-b border-[var(--line)] px-4">
                  <div className="flex gap-1.5">
                    <i className="size-2.5 rounded-full bg-[#ff706c]" />
                    <i className="size-2.5 rounded-full bg-[#ffc65a]" />
                    <i className="size-2.5 rounded-full bg-[var(--brand)]" />
                  </div>
                  <span className="text-[11px] text-[var(--subtle)]">
                    app.chotaurl.pro
                  </span>
                  <Activity size={14} className="text-[var(--brand)]" />
                </div>
                <div className="grid min-h-[480px] md:grid-cols-[190px_1fr]">
                  <aside className="hidden border-r border-[var(--line)] p-4 md:block">
                    <div className="mb-6 flex items-center gap-2.5">
                      <span className="grid size-7 place-items-center rounded-lg bg-[var(--brand)] text-[var(--brand-ink)]">
                        <Link2 size={14} />
                      </span>
                      <span className="text-xs font-semibold">Acme Studio</span>
                    </div>
                    {["Overview", "Links", "Analytics", "Domains", "Team"].map(
                      (item, index) => (
                        <div
                          key={item}
                          className={`mb-1 rounded-lg px-3 py-2 text-xs ${
                            index === 0
                              ? "bg-[var(--surface-hover)] text-[var(--text)]"
                              : "text-[var(--muted)]"
                          }`}
                        >
                          {item}
                        </div>
                      ),
                    )}
                  </aside>
                  <div className="p-5 sm:p-7">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-[var(--muted)]">Good morning, Alex</p>
                        <h2 className="mt-1 text-xl font-semibold tracking-tight">
                          Your links are moving.
                        </h2>
                      </div>
                      <button className="button-primary !min-h-9 !px-3 text-xs">
                        <Link2 size={14} /> New link
                      </button>
                    </div>
                    <div className="mt-7 grid gap-3 sm:grid-cols-3">
                      {[
                        ["Total clicks", "18,429", "+24.8%"],
                        ["Unique visitors", "13,872", "+18.1%"],
                        ["Active links", "148", "+12"],
                      ].map(([label, value, trend]) => (
                        <div
                          key={label}
                          className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"
                        >
                          <p className="text-[11px] text-[var(--muted)]">{label}</p>
                          <div className="mt-2 flex items-end justify-between">
                            <strong className="text-xl tracking-tight">{value}</strong>
                            <span className="text-[10px] text-[var(--brand)]">{trend}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium">Click activity</p>
                          <p className="mt-1 text-[10px] text-[var(--muted)]">
                            Last 30 days
                          </p>
                        </div>
                        <span className="rounded-md border border-[var(--line)] px-2 py-1 text-[9px] text-[var(--muted)]">
                          All links
                        </span>
                      </div>
                      <div className="mt-7 flex h-32 items-end gap-1.5">
                        {[22, 32, 28, 47, 38, 54, 44, 62, 57, 76, 64, 84, 74, 91, 82, 96, 87, 100, 92, 106, 98, 116, 105, 124].map(
                          (height, index) => (
                            <i
                              key={`${height}-${index}`}
                              className="flex-1 rounded-t-sm bg-[linear-gradient(to_top,var(--brand),rgba(146,235,40,.12))]"
                              style={{ height: `${height}px`, opacity: 0.55 + index / 60 }}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="product" className="border-y border-[var(--line)] py-28">
          <div className="container">
            <span className="eyebrow">
              <Layers3 size={14} /> One complete toolkit
            </span>
            <div className="mt-3 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="section-title">Everything a link can do. Nothing held back.</h2>
              <p className="max-w-sm text-sm leading-6 text-[var(--muted)]">
                Every feature is included from day one—whether you create ten links or
                ten million.
              </p>
            </div>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--line)] md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <article
                  key={feature.title}
                  className="group bg-[var(--bg-elevated)] p-7 transition-colors hover:bg-[var(--surface-hover)]"
                >
                  <feature.icon
                    size={20}
                    className="text-[var(--brand)] transition-transform group-hover:scale-110"
                  />
                  <h3 className="mt-8 font-semibold tracking-tight">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {feature.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="analytics" className="py-32">
          <div className="container grid items-center gap-16 lg:grid-cols-[.86fr_1.14fr]">
            <div>
              <span className="eyebrow">
                <MousePointer2 size={14} /> Analytics that answer why
              </span>
              <h2 className="section-title">See the people behind every click.</h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-[var(--muted)]">
                Go beyond vanity metrics. Follow live click history, compare campaigns,
                and understand which audience, device, and channel actually converts.
              </p>
              <div className="mt-8 grid gap-4 text-sm">
                {[
                  "Privacy-aware event tracking",
                  "Country, city, device, browser, and referrer",
                  "Exportable reports and retention controls",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="grid size-6 place-items-center rounded-full bg-[rgba(146,235,40,.12)] text-[var(--brand)]">
                      <Check size={13} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="glass rounded-3xl p-3">
              <div className="rounded-[18px] border border-[var(--line)] bg-[var(--bg-elevated)] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Audience locations</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">
                      12,842 clicks · 84 countries
                    </p>
                  </div>
                  <Globe2 size={18} className="text-[var(--brand)]" />
                </div>
                <div className="relative my-8 h-48 overflow-hidden rounded-xl border border-[var(--line)] bg-[radial-gradient(circle_at_center,rgba(111,184,255,.16),transparent_60%)]">
                  <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(var(--text)_1px,transparent_1px)] [background-size:14px_14px]" />
                  {[
                    ["22%", "24%", 12],
                    ["46%", "38%", 9],
                    ["68%", "29%", 14],
                    ["77%", "61%", 8],
                    ["57%", "66%", 6],
                  ].map(([left, top, size], index) => (
                    <span
                      key={left}
                      className="absolute rounded-full bg-[var(--brand)] shadow-[0_0_18px_var(--brand)]"
                      style={{
                        left,
                        top,
                        width: size,
                        height: size,
                        animation: `pulse-dot ${1.7 + index / 3}s ease-in-out infinite`,
                      }}
                    />
                  ))}
                </div>
                <div className="grid gap-4">
                  {activity.map((item) => (
                    <div
                      key={item.country}
                      className="grid grid-cols-[28px_1fr_auto] items-center gap-3 text-xs"
                    >
                      <span className="text-[10px] font-semibold text-[var(--muted)]">
                        {item.flag}
                      </span>
                      <div>
                        <div className="flex justify-between">
                          <span>{item.country}</span>
                        </div>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--line)]">
                          <div
                            className="h-full rounded-full bg-[var(--brand)]"
                            style={{ width: `${item.share}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-[var(--muted)]">{item.clicks}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="developers" className="border-y border-[var(--line)] py-28">
          <div className="container grid gap-14 lg:grid-cols-2">
            <div>
              <span className="eyebrow">
                <Braces size={14} /> Built for builders
              </span>
              <h2 className="section-title">One API. Millions of links.</h2>
              <p className="mt-6 max-w-lg text-base leading-7 text-[var(--muted)]">
                Automate campaign links, product flows, QR codes, and deep links with a
                clean REST API designed for reliable scale.
              </p>
              <Link to="/docs" className="button-secondary mt-8">
                Read API docs <ArrowRight size={15} />
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[#0a0c10] shadow-[var(--shadow)]">
              <div className="flex h-11 items-center border-b border-white/8 px-4 text-[11px] text-[#747b89]">
                POST /api/v1/links
              </div>
              <pre className="overflow-x-auto p-6 text-[12px] leading-6 text-[#a7adba]">
                <code>{`curl -X POST https://chotaurl.pro/api/v1/links \\
  -H "Authorization: Bearer ch_live_••••" \\
  -H "Content-Type: application/json" \\
  -d '{
    "destination": "https://acme.com/launch",
    "alias": "launch",
    "expiresAt": "2026-12-31T23:59:59Z",
    "targeting": {
      "country": { "IN": "https://acme.in/launch" },
      "device": { "mobile": "https://m.acme.com/launch" }
    }
  }'`}</code>
              </pre>
              <div className="border-t border-white/8 bg-white/[.02] px-6 py-4 text-[11px] text-[var(--brand)]">
                201 Created · 84ms
              </div>
            </div>
          </div>
        </section>

        <section id="model" className="relative py-32">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(138,124,255,.1),transparent_45%)]" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <span className="eyebrow">
                <CircleDot size={14} /> A different business model
              </span>
              <h2 className="section-title mx-auto">Free forever. Funded fairly.</h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-[var(--muted)]">
                We do not lock useful tools behind pricing tiers. Instead, a transparent
                share of eligible visits supports curated platform promotions.
              </p>
            </div>
            <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
              {[
                {
                  icon: Zap,
                  step: "01",
                  title: "You choose the destination",
                  text: "At least 80% of eligible visitors go directly to your URL.",
                },
                {
                  icon: Cloud,
                  step: "02",
                  title: "We fund the platform",
                  text: "Up to 20% may visit a vetted, admin-managed promotion.",
                },
                {
                  icon: ShieldCheck,
                  step: "03",
                  title: "Everything stays clear",
                  text: "The percentage is disclosed before creation and visible per link.",
                },
              ].map((item) => (
                <article
                  key={item.step}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6"
                >
                  <div className="flex items-center justify-between">
                    <item.icon size={19} className="text-[var(--brand)]" />
                    <span className="font-mono text-[10px] text-[var(--subtle)]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="mt-10 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
            <div className="mx-auto mt-8 max-w-5xl rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex-1">
                  <div className="flex justify-between text-xs">
                    <span>Your destination</span>
                    <strong>80%</strong>
                  </div>
                  <div className="mt-3 flex h-2 overflow-hidden rounded-full bg-[var(--line)]">
                    <span className="h-full w-4/5 bg-[var(--brand)]" />
                    <span className="h-full w-1/5 bg-[var(--violet)]" />
                  </div>
                </div>
                <div className="flex gap-5 text-xs text-[var(--muted)]">
                  <span>
                    <i className="mr-2 inline-block size-2 rounded-full bg-[var(--brand)]" />
                    Your URL
                  </span>
                  <span>
                    <i className="mr-2 inline-block size-2 rounded-full bg-[var(--violet)]" />
                    Platform
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-32">
          <div className="container">
            <div className="relative overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] px-6 py-20 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(146,235,40,.16),transparent_48%)]" />
              <div className="relative">
                <KeyRound size={28} className="mx-auto text-[var(--brand)]" />
                <h2 className="mx-auto mt-6 max-w-2xl text-[clamp(38px,6vw,66px)] font-semibold leading-[.98] tracking-[-.055em]">
                  Make your next link count.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-[var(--muted)]">
                  All features. Unlimited links. No credit card.
                </p>
                <Link to="/login?mode=signup" className="button-primary mt-8 !h-12 !px-6">
                  Create your workspace <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
