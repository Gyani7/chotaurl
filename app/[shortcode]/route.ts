import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export const runtime = "edge";

type Targeting = {
  countries?: Record<string, string>;
  devices?: Record<string, string>;
  languages?: Record<string, string>;
  fallback?: string;
};

type Utm = {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
};

type LinkRow = {
  id: string;
  slug: string;
  destination: string;
  status: "ACTIVE" | "PAUSED" | "BLOCKED" | "EXPIRED";
  password_hash: string | null;
  expires_at: string | null;
  max_clicks: number | null;
  click_count: number;
  traffic_share_percent: number | null;
  targeting: Targeting | null;
  utm: Utm | null;
};

type PromoRow = {
  id: string;
  destination: string;
  weight: number;
  country_allowlist: string[];
};

const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function supabaseRest<T>(path: string, init?: RequestInit): Promise<T | null> {
  if (!baseUrl || !serviceKey) return null;
  const response = await fetch(`${baseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!response.ok) return null;
  if (response.status === 204) return null;
  return (await response.json()) as T;
}

async function getLink(slug: string) {
  const redis = getRedis();
  const cacheKey = `redirect:${slug}`;
  const cached = await redis?.get<LinkRow>(cacheKey);
  if (cached) return cached;

  const rows = await supabaseRest<LinkRow[]>(
    `links?slug=eq.${encodeURIComponent(slug)}&select=id,slug,destination,status,password_hash,expires_at,max_clicks,click_count,traffic_share_percent,targeting,utm&limit=1`,
  );
  const link = rows?.[0] ?? null;
  if (link) await redis?.set(cacheKey, link, { ex: 60 });
  return link;
}

function deviceFromAgent(userAgent: string) {
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

function browserFromAgent(userAgent: string) {
  if (/edg\//i.test(userAgent)) return "Edge";
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/chrome\//i.test(userAgent)) return "Chrome";
  if (/safari\//i.test(userAgent)) return "Safari";
  return "Other";
}

function osFromAgent(userAgent: string) {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/iphone|ipad|ios/i.test(userAgent)) return "iOS";
  if (/android/i.test(userAgent)) return "Android";
  if (/mac os/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Other";
}

function applyTargeting(
  link: LinkRow,
  country: string,
  device: string,
  language: string,
) {
  const targeting = link.targeting;
  return (
    targeting?.countries?.[country] ??
    targeting?.devices?.[device] ??
    targeting?.languages?.[language] ??
    targeting?.fallback ??
    link.destination
  );
}

function applyUtm(destination: string, utm: Utm | null) {
  if (!utm) return destination;
  const url = new URL(destination);
  const fields = {
    utm_source: utm.source,
    utm_medium: utm.medium,
    utm_campaign: utm.campaign,
    utm_term: utm.term,
    utm_content: utm.content,
  };
  Object.entries(fields).forEach(([key, value]) => {
    if (value && !url.searchParams.has(key)) url.searchParams.set(key, value);
  });
  return url.toString();
}

function randomPercent() {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return (values[0] / 0xffffffff) * 100;
}

async function hashIp(ip: string) {
  const salt = process.env.IP_HASH_SALT;
  if (!salt || !ip) return null;
  const value = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", value);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function selectWeightedPromo(promos: PromoRow[]) {
  const total = promos.reduce((sum, promo) => sum + Math.max(1, promo.weight), 0);
  let cursor = (randomPercent() / 100) * total;
  for (const promo of promos) {
    cursor -= Math.max(1, promo.weight);
    if (cursor <= 0) return promo;
  }
  return promos.at(-1);
}

async function validUnlockCookie(request: NextRequest, slug: string) {
  const token = request.cookies.get(`cu_unlock_${slug}`)?.value;
  const secret = process.env.IP_HASH_SALT;
  if (!token || !secret) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(slug),
  );
  const expected = Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
  return token === expected;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ shortcode: string }> },
) {
  const { shortcode } = await context.params;
  const link = await getLink(shortcode);
  if (!link) {
    return NextResponse.redirect(new URL(`/link-not-found?slug=${shortcode}`, request.url));
  }

  const isExpired =
    link.status !== "ACTIVE" ||
    (link.expires_at ? new Date(link.expires_at) <= new Date() : false) ||
    (link.max_clicks ? link.click_count >= link.max_clicks : false);
  if (isExpired) {
    return NextResponse.redirect(new URL(`/expired?slug=${shortcode}`, request.url));
  }

  if (link.password_hash && !(await validUnlockCookie(request, shortcode))) {
    return NextResponse.redirect(new URL(`/unlock/${shortcode}`, request.url));
  }

  const userAgent = request.headers.get("user-agent") ?? "";
  const isBot = /bot|crawler|spider|preview|slackbot|discordbot/i.test(userAgent);
  const country = request.headers.get("x-vercel-ip-country") ?? "Unknown";
  const city = request.headers.get("x-vercel-ip-city") ?? "Unknown";
  const language = (request.headers.get("accept-language") ?? "en")
    .split(",")[0]
    .split("-")[0]
    .toLowerCase();
  const device = deviceFromAgent(userAgent);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "";
  const ipHash = await hashIp(ip);
  let destination = applyUtm(
    applyTargeting(link, country, device, language),
    link.utm,
  );
  let promoId: string | null = null;

  const settings = await supabaseRest<Array<{ promo_redirect_percent: number }>>(
    "global_settings?id=eq.global&select=promo_redirect_percent&limit=1",
  );
  const promoPercent = Math.min(
    link.traffic_share_percent ?? settings?.[0]?.promo_redirect_percent ?? 20,
    settings?.[0]?.promo_redirect_percent ?? 20,
  );

  if (!isBot && promoPercent > 0 && randomPercent() < promoPercent) {
    const now = new Date().toISOString();
    const promos = await supabaseRest<PromoRow[]>(
      `promo_urls?active=eq.true&or=(starts_at.is.null,starts_at.lte.${encodeURIComponent(now)})&or=(ends_at.is.null,ends_at.gte.${encodeURIComponent(now)})&select=id,destination,weight,country_allowlist`,
    );
    const eligible = (promos ?? []).filter(
      (promo) =>
        promo.country_allowlist.length === 0 ||
        promo.country_allowlist.includes(country),
    );
    const promo = selectWeightedPromo(eligible);
    if (promo) {
      destination = promo.destination;
      promoId = promo.id;
    }
  }

  await supabaseRest("rpc/record_click", {
    method: "POST",
    body: JSON.stringify({
      p_link_id: link.id,
      p_ip_hash: ipHash,
      p_destination: destination,
      p_country: country,
      p_city: decodeURIComponent(city),
      p_browser: browserFromAgent(userAgent),
      p_os: osFromAgent(userAgent),
      p_device: device,
      p_referrer: request.headers.get("referer"),
      p_user_agent: userAgent.slice(0, 500),
      p_is_promo: Boolean(promoId),
      p_is_bot: isBot,
      p_promo_id: promoId,
    }),
  });

  return NextResponse.redirect(destination, {
    status: 302,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
