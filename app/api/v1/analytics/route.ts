import { NextResponse } from "next/server";
import { getApiPrincipal } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(Number(searchParams.get("days") ?? 30), 1), 365);
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const linkId = searchParams.get("linkId") ?? undefined;
  const where = {
    occurredAt: { gte: since },
    link: {
      workspaceId: principal.workspaceId,
      ...(linkId ? { id: linkId } : {}),
    },
  };

  const [total, promoVisits, countries, devices, browsers, recent] = await Promise.all([
    prisma.click.count({ where }),
    prisma.click.count({ where: { ...where, isPromo: true } }),
    prisma.click.groupBy({
      by: ["country"],
      where,
      _count: { _all: true },
      orderBy: { _count: { country: "desc" } },
      take: 20,
    }),
    prisma.click.groupBy({
      by: ["device"],
      where,
      _count: { _all: true },
      orderBy: { _count: { device: "desc" } },
    }),
    prisma.click.groupBy({
      by: ["browser"],
      where,
      _count: { _all: true },
      orderBy: { _count: { browser: "desc" } },
    }),
    prisma.click.findMany({
      where,
      orderBy: { occurredAt: "desc" },
      take: 100,
      select: {
        occurredAt: true,
        country: true,
        city: true,
        browser: true,
        device: true,
        referrer: true,
        isPromo: true,
        link: { select: { id: true, slug: true, title: true } },
      },
    }),
  ]);

  return NextResponse.json({
    data: {
      total,
      promoVisits,
      destinationVisits: total - promoVisits,
      countries: countries.map((item) => ({
        name: item.country ?? "Unknown",
        clicks: item._count._all,
      })),
      devices: devices.map((item) => ({
        name: item.device ?? "Unknown",
        clicks: item._count._all,
      })),
      browsers: browsers.map((item) => ({
        name: item.browser ?? "Unknown",
        clicks: item._count._all,
      })),
      recent,
    },
  });
}
