import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/api-auth";
import { destinationSchema } from "@/lib/link-input";
import { prisma } from "@/lib/prisma";

const bulkSchema = z.object({
  destinations: z.array(destinationSchema).min(1).max(1000),
  acceptedTrafficShare: z.literal(true),
  trafficSharePercent: z.number().int().min(0).max(20).optional(),
  tags: z.array(z.string().trim().min(1).max(32)).max(20).default([]),
});

export async function POST(request: Request) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (principal.role === "VIEWER") {
    return NextResponse.json({ error: "Write access required" }, { status: 403 });
  }
  const parsed = bulkSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid bulk request", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const settings = await prisma.globalSettings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global" },
  });
  const trafficShare = Math.min(
    parsed.data.trafficSharePercent ?? settings.promoRedirectPercent,
    settings.promoRedirectPercent,
  );
  const links = await prisma.$transaction(
    parsed.data.destinations.map((destination) =>
      prisma.link.create({
        data: {
          workspaceId: principal.workspaceId,
          createdById: principal.userId,
          destination,
          slug: nanoid(8).toLowerCase(),
          trafficSharePercent: trafficShare,
          tags: parsed.data.tags,
        },
        select: { id: true, slug: true, destination: true },
      }),
    ),
  );
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  return NextResponse.json(
    {
      data: links.map((link) => ({
        ...link,
        shortUrl: `${appUrl}/${link.slug}`,
      })),
    },
    { status: 201 },
  );
}
