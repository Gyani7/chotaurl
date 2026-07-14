import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { createLinkSchema } from "@/lib/link-input";
import { getApiPrincipal } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/redis";
import { hashPassword } from "@/lib/security";

export const runtime = "nodejs";

function responseError(message: string, status: number, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export async function GET(request: Request) {
  const principal = await getApiPrincipal(request);
  if (!principal) return responseError("Authentication required", 401);

  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get("cursor");
  const take = Math.min(Number(searchParams.get("limit") ?? 50), 100);

  const links = await prisma.link.findMany({
    where: { workspaceId: principal.workspaceId },
    take: take + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      slug: true,
      title: true,
      destination: true,
      status: true,
      clickCount: true,
      uniqueClickCount: true,
      trafficSharePercent: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  const hasMore = links.length > take;
  const data = hasMore ? links.slice(0, take) : links;
  return NextResponse.json({
    data,
    pagination: {
      nextCursor: hasMore ? data.at(-1)?.id : null,
    },
  });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "anonymous";
  const rate = await checkRateLimit(`links:${ip}`, 60, 60);
  if (!rate.allowed) return responseError("Rate limit exceeded", 429);

  const parsed = createLinkSchema.safeParse(await request.json());
  if (!parsed.success) {
    return responseError("Invalid link configuration", 400, parsed.error.flatten());
  }

  const input = parsed.data;
  const slug = input.alias ?? nanoid(7).toLowerCase();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;

  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      {
        data: {
          id: `demo_${slug}`,
          slug,
          shortUrl: `${appUrl}/${slug}`,
          destination: input.destination,
          trafficShare: input.trafficSharePercent ?? 20,
          demo: true,
        },
      },
      { status: 201 },
    );
  }

  const principal = await getApiPrincipal(request);
  if (!principal) return responseError("Authentication required", 401);
  if (principal.role === "VIEWER") return responseError("Write access required", 403);

  const hostname = new URL(input.destination).hostname.toLowerCase();
  const blacklisted = await prisma.blacklistedDomain.findFirst({
    where: {
      OR: [
        { hostname },
        ...hostname
          .split(".")
          .slice(0, -1)
          .map((_, index, parts) => ({
            hostname: parts.slice(index + 1).join("."),
          })),
      ],
    },
  });
  if (blacklisted) return responseError("This destination is not allowed", 422);

  const existing = await prisma.link.findUnique({ where: { slug }, select: { id: true } });
  if (existing) return responseError("This custom alias is already in use", 409);

  const settings = await prisma.globalSettings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global" },
  });
  const trafficShare = Math.min(
    input.trafficSharePercent ?? settings.promoRedirectPercent,
    settings.promoRedirectPercent,
  );

  const link = await prisma.link.create({
    data: {
      workspaceId: principal.workspaceId,
      createdById: principal.userId,
      slug,
      title: input.title,
      destination: input.destination,
      passwordHash: input.password ? hashPassword(input.password) : null,
      expiresAt: input.expiresAt ? new Date(input.expiresAt) : null,
      maxClicks: input.maxClicks,
      trafficSharePercent: trafficShare,
      targeting: input.targeting,
      utm: input.utm,
      tags: input.tags,
    },
    select: {
      id: true,
      slug: true,
      destination: true,
      trafficSharePercent: true,
      expiresAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json(
    {
      data: {
        ...link,
        shortUrl: `${appUrl}/${link.slug}`,
        trafficShare: link.trafficSharePercent,
      },
    },
    { status: 201 },
  );
}
