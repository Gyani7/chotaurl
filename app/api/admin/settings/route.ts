import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

const settingsSchema = z.object({
  promoRedirectPercent: z.number().int().min(0).max(20),
  anonymousLinksEnabled: z.boolean().optional(),
  abuseThreshold: z.number().int().min(1).max(100).optional(),
});

export async function GET(request: Request) {
  if (!(await requireAdmin(request))) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const settings = await prisma.globalSettings.upsert({
    where: { id: "global" },
    update: {},
    create: { id: "global" },
  });
  return NextResponse.json({ data: settings });
}

export async function PATCH(request: Request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  const parsed = settingsSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid settings", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const settings = await prisma.globalSettings.upsert({
    where: { id: "global" },
    update: parsed.data,
    create: { id: "global", ...parsed.data },
  });
  await prisma.auditEvent.create({
    data: {
      actorId: admin.userId,
      action: "settings.update",
      resource: "global_settings",
      resourceId: "global",
      metadata: parsed.data,
    },
  });
  return NextResponse.json({ data: settings });
}
