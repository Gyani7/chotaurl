import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Filter,
  Globe2,
  KeyRound,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  MousePointer2,
  Plus,
  QrCode,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Users2,
  X,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FormEvent, useMemo, useState } from "react";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

type View = "overview" | "links" | "analytics" | "domains" | "team" | "api";

type LinkRecord = {
  id: string;
  title: string;
  slug: string;
  destination: string;
  clicks: number;
  uniqueClicks: number;
  created: string;
  status: "Active" | "Paused";
  tags: string[];
};

const chartData = [
  { date: "Jun 15", clicks: 380, unique: 292 },
  { date: "Jun 18", clicks: 520, unique: 401 },
  { date: "Jun 21", clicks: 470, unique: 378 },
  { date: "Jun 24", clicks: 690, unique: 510 },
  { date: "Jun 27", clicks: 620, unique: 492 },
  { date: "Jun 30", clicks: 840, unique: 628 },
  { date: "Jul 03", clicks: 780, unique: 582 },
  { date: "Jul 06", clicks: 1080, unique: 791 },
  { date: "Jul 09", clicks: 960, unique: 712 },
  { date: "Jul 12", clicks: 1240, unique: 914 },
  { date: "Jul 14", clicks: 1174, unique: 868 },
];

const initialLinks: LinkRecord[] = [
  {
    id: "1",
    title: "Summer launch campaign",
    slug: "summer-26",
    destination: "https://acme.studio/campaigns/summer-launch",
    clicks: 8421,
    uniqueClicks: 6184,
    created: "2 hours ago",
    status: "Active",
    tags: ["campaign", "paid"],
  },
  {
    id: "2",
    title: "Product onboarding",
    slug: "get-started",
    destination: "https://docs.acme.studio/getting-started",
    clicks: 3982,
    uniqueClicks: 3241,
    created: "Yesterday",
    status: "Active",
    tags: ["product"],
  },
  {
    id: "3",
    title: "Partner referral",
    slug: "northstar",
    destination: "https://acme.studio/partners/northstar",
    clicks: 2401,
    uniqueClicks: 1890,
    created: "Jul 10",
    status: "Active",
    tags: ["partner"],
  },
  {
    id: "4",
    title: "Webinar registration",
    slug: "growth-live",
    destination: "https://events.acme.studio/growth-live",
    clicks: 1738,
    uniqueClicks: 1461,
    created: "Jul 8",
    status: "Paused",
    tags: ["event"],
  },
];

const navItems: Array<{
  view: View;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { view: "overview", label: "Overview", icon: LayoutDashboard },
  { view: "links", label: "Links", icon: Link2 },
  { view: "analytics", label: "Analytics", icon: BarChart3 },
  { view: "domains", label: "Domains", icon: Globe2 },
  { view: "team", label: "Team", icon: Users2 },
  { view: "api", label: "Developer API", icon: Braces },
];

function number(value: number) {
  return new Intl.NumberFormat("en", { notation: "compact" }).format(value);
}

export function DashboardApp({ userEmail }: { userEmail: string }) {
  const [view, setView] = useState<View>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [links, setLinks] = useState(initialLinks);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");

  const filteredLinks = useMemo(
    () =>
      links.filter((link) =>
        `${link.title} ${link.slug} ${link.destination}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [links, query],
  );

  function switchView(next: View) {
    setView(next);
    setSidebarOpen(false);
  }

  async function copyLink(slug: string) {
    await navigator.clipboard.writeText(`${window.location.origin}/${slug}`);
    setCopied(slug);
    setTimeout(() => setCopied(""), 1400);
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {sidebarOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[244px] flex-col border-r border-[var(--line)] bg-[var(--bg-elevated)] transition-transform lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[68px] items-center justify-between border-b border-[var(--line)] px-5">
          <Logo />
          <button
            className="button-quiet size-8 !p-0 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={17} />
          </button>
        </div>
        <div className="p-3">
          <button className="flex w-full items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-2.5 text-left">
            <span className="grid size-8 place-items-center rounded-lg bg-[linear-gradient(135deg,#8a7cff,#6fb8ff)] text-xs font-bold text-white">
              AS
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold">Acme Studio</span>
              <span className="block text-[10px] text-[var(--muted)]">Owner workspace</span>
            </span>
            <ChevronDown size={14} className="text-[var(--subtle)]" />
          </button>
        </div>
        <nav className="flex-1 px-3 py-2" aria-label="Dashboard navigation">
          <p className="mb-2 px-3 text-[9px] font-semibold uppercase tracking-[.15em] text-[var(--subtle)]">
            Workspace
          </p>
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => switchView(item.view)}
              className={`mb-1 flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-xs font-medium transition-colors ${
                view === item.view
                  ? "bg-[var(--surface-hover)] text-[var(--text)]"
                  : "text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
              }`}
            >
              <item.icon
                size={16}
                className={view === item.view ? "text-[var(--brand)]" : ""}
              />
              {item.label}
              {item.view === "links" && (
                <span className="ml-auto rounded-md bg-[var(--surface)] px-1.5 py-0.5 text-[9px] text-[var(--muted)]">
                  {links.length}
                </span>
              )}
            </button>
          ))}
          <p className="mb-2 mt-7 px-3 text-[9px] font-semibold uppercase tracking-[.15em] text-[var(--subtle)]">
            Account
          </p>
          {[
            { label: "Settings", icon: Settings },
            { label: "Help & docs", icon: CircleHelp },
          ].map((item) => (
            <button
              key={item.label}
              className="mb-1 flex h-10 w-full items-center gap-3 rounded-[10px] px-3 text-xs font-medium text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
            >
              <item.icon size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="m-3 rounded-xl border border-[rgba(146,235,40,.18)] bg-[rgba(146,235,40,.06)] p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold">
            <Sparkles size={14} className="text-[var(--brand)]" />
            All features unlocked
          </div>
          <p className="mt-2 text-[10px] leading-4 text-[var(--muted)]">
            No limits, upgrades, or surprise invoices.
          </p>
        </div>
        <div className="flex items-center gap-3 border-t border-[var(--line)] p-4">
          <span className="grid size-8 place-items-center rounded-full bg-[var(--violet)] text-[10px] font-bold text-white">
            AK
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-semibold">Alex Kapoor</span>
            <span className="block truncate text-[9px] text-[var(--muted)]">
              {userEmail}
            </span>
          </span>
          <MoreHorizontal size={15} className="text-[var(--subtle)]" />
        </div>
      </aside>

      <div className="lg:pl-[244px]">
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[var(--line)] bg-[color:var(--bg)]/85 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button
              className="button-quiet size-9 !p-0 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={18} />
            </button>
            <div className="relative hidden w-[260px] sm:block">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--subtle)]"
              />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="input !min-h-9 !rounded-lg !pl-9 text-xs"
                placeholder="Search links..."
              />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button className="button-quiet relative size-10 !p-0">
              <Bell size={17} />
              <span className="absolute right-2.5 top-2.5 size-1.5 rounded-full bg-[var(--brand)]" />
            </button>
            <button
              onClick={() => setCreateOpen(true)}
              className="button-primary ml-2 !min-h-10"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Create link</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] p-4 sm:p-7 lg:p-9">
          {view === "overview" && (
            <Overview
              links={links}
              onCreate={() => setCreateOpen(true)}
              onViewLinks={() => setView("links")}
              onCopy={copyLink}
              copied={copied}
            />
          )}
          {view === "links" && (
            <LinksView
              links={filteredLinks}
              query={query}
              onQuery={setQuery}
              onCreate={() => setCreateOpen(true)}
              onCopy={copyLink}
              copied={copied}
            />
          )}
          {view === "analytics" && <AnalyticsView />}
          {view === "domains" && <DomainsView />}
          {view === "team" && <TeamView />}
          {view === "api" && <ApiView />}
        </main>
      </div>

      {createOpen && (
        <CreateLinkDialog
          onClose={() => setCreateOpen(false)}
          onCreated={(link) => {
            setLinks((current) => [link, ...current]);
            setCreateOpen(false);
            setView("links");
          }}
        />
      )}
    </div>
  );
}

function PageHeading({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-2xl font-semibold tracking-[-0.035em] sm:text-[28px]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Overview({
  links,
  onCreate,
  onViewLinks,
  onCopy,
  copied,
}: {
  links: LinkRecord[];
  onCreate: () => void;
  onViewLinks: () => void;
  onCopy: (slug: string) => void;
  copied: string;
}) {
  const stats = [
    ["Total clicks", "18,429", "24.8%", MousePointer2],
    ["Unique visitors", "13,872", "18.1%", Users2],
    ["Conversion rate", "6.84%", "0.7%", Activity],
    ["Links created", "148", "12", Link2],
  ] as const;

  return (
    <div>
      <PageHeading
        title="Good morning, Alex."
        description="Your links generated 1,174 clicks today. Here is what is moving."
        action={
          <button onClick={onCreate} className="button-secondary">
            <Plus size={15} /> New smart link
          </button>
        }
      />
      <section className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, delta, Icon]) => (
          <article
            key={label}
            className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-8 place-items-center rounded-lg bg-[var(--surface)] text-[var(--muted)]">
                <Icon size={15} />
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--brand)]">
                <ArrowUpRight size={12} />
                {delta}
              </span>
            </div>
            <p className="mt-6 text-2xl font-semibold tracking-[-0.04em]">{value}</p>
            <p className="mt-1 text-[11px] text-[var(--muted)]">{label}</p>
          </article>
        ))}
      </section>

      <section className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <ChartCard />
        <LocationsCard />
      </section>

      <section className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]">
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Top performing links</h2>
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              Ranked by clicks in the selected period
            </p>
          </div>
          <button onClick={onViewLinks} className="button-quiet !min-h-8 text-[11px]">
            View all <ChevronRight size={13} />
          </button>
        </div>
        <LinkTable links={links.slice(0, 4)} onCopy={onCopy} copied={copied} />
      </section>
    </div>
  );
}

function ChartCard({ tall = false }: { tall?: boolean }) {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5 sm:p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-sm font-semibold">Click activity</h2>
          <p className="mt-1 text-[11px] text-[var(--muted)]">
            Clicks and unique visitors over 30 days
          </p>
        </div>
        <button className="button-quiet !min-h-8 !rounded-lg !px-2.5 text-[10px]">
          Last 30 days <ChevronDown size={12} />
        </button>
      </div>
      <div className={`mt-6 ${tall ? "h-[350px]" : "h-[290px]"}`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ left: -20, right: 4 }}>
            <defs>
              <linearGradient id={tall ? "analytics-clicks" : "clicks"} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#92eb28" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#92eb28" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--line)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 9, fill: "var(--subtle)" }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "var(--subtle)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface-strong)",
                border: "1px solid var(--line)",
                borderRadius: 10,
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="clicks"
              stroke="#92eb28"
              strokeWidth={2}
              fill={`url(#${tall ? "analytics-clicks" : "clicks"})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  );
}

function LocationsCard() {
  return (
    <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold">Top locations</h2>
          <p className="mt-1 text-[11px] text-[var(--muted)]">By total clicks</p>
        </div>
        <Globe2 size={16} className="text-[var(--brand)]" />
      </div>
      <div className="relative mt-6 h-28 overflow-hidden rounded-xl border border-[var(--line)] bg-[radial-gradient(circle_at_center,rgba(111,184,255,.14),transparent_70%)]">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(var(--text)_1px,transparent_1px)] [background-size:12px_12px]" />
        {[
          ["21%", "38%", 10],
          ["44%", "56%", 7],
          ["70%", "31%", 12],
          ["78%", "67%", 6],
        ].map(([left, top, size]) => (
          <span
            key={left}
            className="absolute rounded-full bg-[var(--brand)] shadow-[0_0_14px_var(--brand)]"
            style={{ left, top, width: size, height: size }}
          />
        ))}
      </div>
      <div className="mt-6 grid gap-4">
        {[
          ["US", "United States", "38.1%", 76],
          ["IN", "India", "24.2%", 55],
          ["GB", "United Kingdom", "14.7%", 36],
          ["DE", "Germany", "10.1%", 25],
        ].map(([code, country, share, width]) => (
          <div
            key={country}
            className="grid grid-cols-[24px_1fr_auto] items-center gap-2 text-[10px]"
          >
            <span className="font-semibold text-[var(--subtle)]">{code}</span>
            <div>
              <div className="mb-1.5">{country}</div>
              <div className="h-1 rounded-full bg-[var(--line)]">
                <div
                  className="h-full rounded-full bg-[var(--brand)]"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
            <span className="text-[var(--muted)]">{share}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

function LinksView({
  links,
  query,
  onQuery,
  onCreate,
  onCopy,
  copied,
}: {
  links: LinkRecord[];
  query: string;
  onQuery: (value: string) => void;
  onCreate: () => void;
  onCopy: (slug: string) => void;
  copied: string;
}) {
  return (
    <div>
      <PageHeading
        title="Links"
        description="Create, organize, target, and monitor every short link."
        action={
          <button onClick={onCreate} className="button-primary">
            <Plus size={15} /> Create link
          </button>
        }
      />
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--subtle)]"
          />
          <input
            className="input !pl-10 text-xs"
            value={query}
            onChange={(event) => onQuery(event.target.value)}
            placeholder="Search by title, alias, or destination"
          />
        </label>
        <button className="button-secondary">
          <Filter size={14} /> Filter
        </button>
        <button className="button-secondary">
          <Download size={14} /> Export
        </button>
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]">
        <LinkTable links={links} onCopy={onCopy} copied={copied} />
      </div>
    </div>
  );
}

function LinkTable({
  links,
  onCopy,
  copied,
}: {
  links: LinkRecord[];
  onCopy: (slug: string) => void;
  copied: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--line)] text-[9px] uppercase tracking-[.12em] text-[var(--subtle)]">
            <th className="px-5 py-3 font-semibold">Link</th>
            <th className="px-4 py-3 font-semibold">Clicks</th>
            <th className="px-4 py-3 font-semibold">Unique</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Created</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {links.map((link) => (
            <tr
              key={link.id}
              className="border-b border-[var(--line)] last:border-0 hover:bg-[var(--surface)]"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-[var(--brand)]">
                    <Link2 size={15} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold">{link.title}</p>
                    <button
                      onClick={() => onCopy(link.slug)}
                      className="mt-1 inline-flex items-center gap-1.5 text-[10px] text-[var(--brand)]"
                    >
                      chotaurl.pro/{link.slug}
                      {copied === link.slug ? <Check size={10} /> : <Copy size={10} />}
                    </button>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4 text-xs font-medium">{number(link.clicks)}</td>
              <td className="px-4 py-4 text-xs text-[var(--muted)]">
                {number(link.uniqueClicks)}
              </td>
              <td className="px-4 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[9px] ${
                    link.status === "Active"
                      ? "border-[rgba(146,235,40,.2)] bg-[rgba(146,235,40,.07)] text-[var(--brand)]"
                      : "border-[var(--line)] text-[var(--muted)]"
                  }`}
                >
                  <i className="size-1 rounded-full bg-current" />
                  {link.status}
                </span>
              </td>
              <td className="px-4 py-4 text-[10px] text-[var(--muted)]">
                {link.created}
              </td>
              <td className="px-4 py-4">
                <button className="button-quiet size-8 !p-0">
                  <MoreHorizontal size={15} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {links.length === 0 && (
        <div className="grid min-h-64 place-items-center text-center">
          <div>
            <Search size={24} className="mx-auto text-[var(--subtle)]" />
            <p className="mt-3 text-sm font-semibold">No links found</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Try a different title, alias, or destination.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function AnalyticsView() {
  return (
    <div>
      <PageHeading
        title="Analytics"
        description="Understand your audience, channels, and devices in real time."
        action={
          <button className="button-secondary">
            <Download size={14} /> Export report
          </button>
        }
      />
      <div className="mt-8 flex flex-wrap gap-2">
        {["Last 30 days", "All links", "All countries", "All devices"].map((item) => (
          <button key={item} className="button-secondary !min-h-9 text-[10px]">
            {item} <ChevronDown size={11} />
          </button>
        ))}
      </div>
      <div className="mt-4">
        <ChartCard tall />
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Devices",
            icon: Smartphone,
            rows: [
              ["Mobile", "61.4%"],
              ["Desktop", "34.8%"],
              ["Tablet", "3.8%"],
            ],
          },
          {
            title: "Top referrers",
            icon: ExternalLink,
            rows: [
              ["instagram.com", "32.1%"],
              ["Direct", "26.7%"],
              ["google.com", "18.4%"],
            ],
          },
          {
            title: "Browsers",
            icon: Globe2,
            rows: [
              ["Chrome", "57.8%"],
              ["Safari", "27.2%"],
              ["Edge", "8.3%"],
            ],
          },
        ].map((card) => (
          <article
            key={card.title}
            className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-5"
          >
            <div className="flex items-center gap-2">
              <card.icon size={15} className="text-[var(--brand)]" />
              <h2 className="text-xs font-semibold">{card.title}</h2>
            </div>
            <div className="mt-6 grid gap-5">
              {card.rows.map(([label, value], index) => (
                <div key={label}>
                  <div className="flex justify-between text-[10px]">
                    <span>{label}</span>
                    <span className="text-[var(--muted)]">{value}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-[var(--line)]">
                    <div
                      className="h-full rounded-full bg-[var(--brand)]"
                      style={{ width: `${75 - index * 20}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function DomainsView() {
  return (
    <div>
      <PageHeading
        title="Custom domains"
        description="Use your own branded domains with automatic HTTPS."
        action={
          <button className="button-primary">
            <Plus size={15} /> Add domain
          </button>
        }
      />
      <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]">
        {[
          ["go.acme.studio", "Active", "124 links", "Primary"],
          ["acme.link", "Active", "24 links", ""],
          ["tryacme.co", "Verifying", "0 links", ""],
        ].map(([domain, status, links, primary]) => (
          <div
            key={domain}
            className="flex flex-col gap-4 border-b border-[var(--line)] p-5 last:border-0 sm:flex-row sm:items-center"
          >
            <span className="grid size-10 place-items-center rounded-xl border border-[var(--line)] bg-[var(--surface)] text-[var(--brand)]">
              <Globe2 size={17} />
            </span>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{domain}</p>
                {primary && (
                  <span className="rounded-full bg-[rgba(138,124,255,.12)] px-2 py-0.5 text-[8px] text-[var(--violet)]">
                    {primary}
                  </span>
                )}
              </div>
              <p className="mt-1 text-[10px] text-[var(--muted)]">{links}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] ${
                status === "Active" ? "text-[var(--brand)]" : "text-[var(--warning)]"
              }`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {status}
            </span>
            <button className="button-quiet size-9 !p-0">
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-[rgba(111,184,255,.18)] bg-[rgba(111,184,255,.05)] p-5">
        <div className="flex gap-3">
          <ShieldCheck size={18} className="shrink-0 text-[var(--blue)]" />
          <div>
            <p className="text-xs font-semibold">Automatic domain protection</p>
            <p className="mt-1 text-[11px] leading-5 text-[var(--muted)]">
              SSL renews automatically. Domain health and reputation are monitored
              continuously.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamView() {
  return (
    <div>
      <PageHeading
        title="Team"
        description="Collaborate without seat limits or role-based pricing."
        action={
          <button className="button-primary">
            <Plus size={15} /> Invite member
          </button>
        }
      />
      <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)]">
        {[
          ["AK", "Alex Kapoor", "alex@acme.studio", "Owner", "Active now"],
          ["MS", "Maya Singh", "maya@acme.studio", "Admin", "12 min ago"],
          ["JL", "Jon Lee", "jon@acme.studio", "Editor", "Yesterday"],
          ["NS", "Nora Shah", "nora@acme.studio", "Viewer", "Jul 12"],
        ].map(([initials, name, email, role, activity]) => (
          <div
            key={email}
            className="grid gap-3 border-b border-[var(--line)] p-5 last:border-0 sm:grid-cols-[1fr_100px_100px_32px] sm:items-center"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full bg-[var(--surface-hover)] text-[10px] font-bold">
                {initials}
              </span>
              <div>
                <p className="text-xs font-semibold">{name}</p>
                <p className="mt-1 text-[10px] text-[var(--muted)]">{email}</p>
              </div>
            </div>
            <span className="text-[10px]">{role}</span>
            <span className="text-[10px] text-[var(--muted)]">{activity}</span>
            <button className="button-quiet size-8 !p-0">
              <MoreHorizontal size={15} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApiView() {
  const [keyVisible, setKeyVisible] = useState(false);
  return (
    <div>
      <PageHeading
        title="Developer API"
        description="Automate links, analytics, QR codes, and domains with REST."
        action={
          <button className="button-primary">
            <Plus size={15} /> Create API key
          </button>
        }
      />
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold">API keys</h2>
              <p className="mt-1 text-[10px] text-[var(--muted)]">
                Use scoped keys and rotate them regularly.
              </p>
            </div>
            <KeyRound size={17} className="text-[var(--brand)]" />
          </div>
          <div className="mt-6 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold">Production</p>
                <p className="mt-1 font-mono text-[10px] text-[var(--muted)]">
                  {keyVisible ? "ch_live_7H2jK8mP4xR9vN6q" : "ch_live_••••••••••••••••"}
                </p>
              </div>
              <button
                className="button-quiet !min-h-8 text-[10px]"
                onClick={() => setKeyVisible((visible) => !visible)}
              >
                {keyVisible ? "Hide" : "Reveal"}
              </button>
            </div>
          </div>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-6">
          <h2 className="text-sm font-semibold">Usage this month</h2>
          <div className="mt-6 flex items-end justify-between">
            <div>
              <p className="text-3xl font-semibold tracking-[-.04em]">84,219</p>
              <p className="mt-1 text-[10px] text-[var(--muted)]">API requests</p>
            </div>
            <span className="text-[10px] text-[var(--brand)]">99.98% success</span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[var(--line)]">
            <div className="h-full w-[42%] rounded-full bg-[var(--brand)]" />
          </div>
        </article>
      </div>
      <article className="mt-4 overflow-hidden rounded-2xl border border-[var(--line)] bg-[#090b0f]">
        <div className="flex items-center justify-between border-b border-white/8 px-5 py-3">
          <span className="text-[10px] text-[#858b98]">Quick start</span>
          <button className="flex items-center gap-1.5 text-[9px] text-[#858b98]">
            <Copy size={11} /> Copy
          </button>
        </div>
        <pre className="overflow-x-auto p-5 text-[11px] leading-6 text-[#abb1bc]">
          <code>{`const response = await fetch("https://chotaurl.pro/api/v1/links", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ch_live_••••••••",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    destination: "https://acme.studio/launch",
    alias: "launch"
  })
});`}</code>
        </pre>
      </article>
    </div>
  );
}

function CreateLinkDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (link: LinkRecord) => void;
}) {
  const [destination, setDestination] = useState("");
  const [title, setTitle] = useState("");
  const [alias, setAlias] = useState("");
  const [tab, setTab] = useState<"single" | "bulk">("single");
  const [advanced, setAdvanced] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!accepted) return;
    setLoading(true);
    const slug = alias || Math.random().toString(36).slice(2, 8);
    try {
      await fetch("/api/v1/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          title,
          alias: slug,
          acceptedTrafficShare: accepted,
        }),
      });
    } finally {
      onCreated({
        id: crypto.randomUUID(),
        title: title || new URL(destination).hostname,
        slug,
        destination,
        clicks: 0,
        uniqueClicks: 0,
        created: "Just now",
        status: "Active",
        tags: [],
      });
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-black/70 p-3 backdrop-blur-sm">
      <div
        className="my-auto w-full max-w-[650px] rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] shadow-[var(--shadow)]"
        role="dialog"
        aria-modal="true"
        aria-label="Create a smart link"
      >
        <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
          <div>
            <h2 className="text-sm font-semibold">Create a smart link</h2>
            <p className="mt-1 text-[10px] text-[var(--muted)]">
              Route, protect, and measure from one place.
            </p>
          </div>
          <button onClick={onClose} className="button-quiet size-9 !p-0">
            <X size={17} />
          </button>
        </div>
        <div className="flex border-b border-[var(--line)] px-5">
          {(["single", "bulk"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={`border-b-2 px-4 py-3 text-[10px] font-semibold capitalize ${
                tab === item
                  ? "border-[var(--brand)] text-[var(--text)]"
                  : "border-transparent text-[var(--muted)]"
              }`}
            >
              {item === "single" ? "Single link" : "Bulk shorten"}
            </button>
          ))}
        </div>
        {tab === "single" ? (
          <form onSubmit={submit}>
            <div className="grid gap-5 p-5">
              <label className="grid gap-2 text-[11px] font-medium">
                Destination URL
                <input
                  autoFocus
                  required
                  type="url"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="input"
                  placeholder="https://example.com/your-long-url"
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-[11px] font-medium">
                  Title
                  <input
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    className="input"
                    placeholder="Summer campaign"
                  />
                </label>
                <label className="grid gap-2 text-[11px] font-medium">
                  Custom alias
                  <span className="flex">
                    <span className="flex items-center rounded-l-[11px] border border-r-0 border-[var(--line)] bg-[var(--surface)] px-3 text-[10px] text-[var(--muted)]">
                      chotaurl.pro/
                    </span>
                    <input
                      value={alias}
                      onChange={(event) =>
                        setAlias(
                          event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""),
                        )
                      }
                      className="input !rounded-l-none"
                      placeholder="summer"
                    />
                  </span>
                </label>
              </div>
              <button
                type="button"
                onClick={() => setAdvanced((current) => !current)}
                className="flex items-center justify-between rounded-xl border border-[var(--line)] p-3 text-left text-[11px] font-medium"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-[var(--brand)]" />
                  Advanced routing & protection
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${advanced ? "rotate-180" : ""}`}
                />
              </button>
              {advanced && (
                <div className="grid gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 sm:grid-cols-2">
                  {[
                    [LockKeyhole, "Password protection", "Require a password"],
                    [Globe2, "Geo-targeting", "Route by country or city"],
                    [Smartphone, "Device targeting", "Route by device or OS"],
                    [QrCode, "QR code", "Generate after creation"],
                    [FileText, "UTM builder", "Attach campaign parameters"],
                    [Zap, "Expiration", "Date or click limit"],
                  ].map(([Icon, label, description]) => {
                    const FeatureIcon = Icon as typeof LockKeyhole;
                    return (
                      <button
                        type="button"
                        key={String(label)}
                        className="flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--bg-elevated)] p-3 text-left hover:border-[var(--line-strong)]"
                      >
                        <FeatureIcon size={15} className="text-[var(--brand)]" />
                        <span>
                          <span className="block text-[10px] font-semibold">
                            {String(label)}
                          </span>
                          <span className="mt-0.5 block text-[9px] text-[var(--muted)]">
                            {String(description)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
              <label className="flex cursor-pointer gap-3 rounded-xl border border-[rgba(138,124,255,.2)] bg-[rgba(138,124,255,.06)] p-4">
                <input
                  required
                  type="checkbox"
                  checked={accepted}
                  onChange={(event) => setAccepted(event.target.checked)}
                  className="mt-0.5 size-4 accent-[var(--brand)]"
                />
                <span>
                  <span className="block text-[11px] font-semibold">
                    I understand the fair traffic model
                  </span>
                  <span className="mt-1 block text-[10px] leading-5 text-[var(--muted)]">
                    At least 80% of eligible visitors go to your destination. Up to 20%
                    may be randomly redirected to a vetted platform promotion.
                  </span>
                </span>
              </label>
            </div>
            <div className="flex items-center justify-end gap-2 border-t border-[var(--line)] px-5 py-4">
              <button type="button" onClick={onClose} className="button-quiet">
                Cancel
              </button>
              <button
                disabled={!accepted || !destination || loading}
                type="submit"
                className="button-primary disabled:cursor-not-allowed disabled:opacity-45"
              >
                <Link2 size={15} /> {loading ? "Creating..." : "Create smart link"}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="p-5">
              <label className="grid gap-2 text-[11px] font-medium">
                URLs to shorten
                <textarea
                  className="input min-h-52 resize-y !py-3 font-mono text-[11px] leading-6"
                  placeholder={"https://example.com/one\nhttps://example.com/two"}
                />
              </label>
              <p className="mt-3 text-[10px] text-[var(--muted)]">
                One URL per line. Paste up to 1,000 URLs or upload a CSV.
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--line)] px-5 py-4">
              <button className="button-secondary">
                <FileText size={14} /> Upload CSV
              </button>
              <button className="button-primary">Create links</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
