import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { destinationSchema } from "@/lib/link-input";
import { prisma } from "@/lib/prisma";

const promoSchema = z.object({
  name: z.string().trim().min(2).max(120),
  destination: destinationSchema,
  weight: z.number().int().min(1).max(10000).default(100),
  countryAllowlist: z.array(z.string().length(2).toUpperCase()).max(100).default([]),
  startsAt: z.iso.datetime().optional(),
  endsAt: z.iso.datetime().optional(),
});

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const promos = await prisma.promoUrl.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ data: promos });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const parsed = promoSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid promotion", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const promo = await prisma.promoUrl.create({
    data: {
      name: parsed.data.name,
      destination: parsed.data.destination,
      weight: parsed.data.weight,
      countryAllowlist: parsed.data.countryAllowlist,
      startsAt: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
      endsAt: parsed.data.endsAt ? new Date(parsed.data.endsAt) : null,
    },
  });
  await prisma.auditEvent.create({
    data: {
      actorId: admin.userId,
      action: "promo.create",
      resource: "promo_url",
      resourceId: promo.id,
    },
  });
  return NextResponse.json({ data: promo }, { status: 201 });
}
