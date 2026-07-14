import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const blacklistSchema = z.object({
  hostname: z.string().trim().toLowerCase().min(4).max(253),
  reason: z.string().trim().max(500).optional(),
});

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const domains = await prisma.blacklistedDomain.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
  });
  return NextResponse.json({ data: domains });
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const parsed = blacklistSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid domain", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const domain = await prisma.blacklistedDomain.upsert({
    where: { hostname: parsed.data.hostname },
    create: parsed.data,
    update: { reason: parsed.data.reason },
  });
  await prisma.link.updateMany({
    where: {
      destination: { contains: parsed.data.hostname },
      status: "ACTIVE",
    },
    data: { status: "BLOCKED" },
  });
  await prisma.auditEvent.create({
    data: {
      actorId: admin.userId,
      action: "blacklist.upsert",
      resource: "blacklisted_domain",
      resourceId: domain.id,
      metadata: parsed.data,
    },
  });
  return NextResponse.json({ data: domain }, { status: 201 });
}
