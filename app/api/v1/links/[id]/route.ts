import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/api-auth";
import { destinationSchema } from "@/lib/link-input";
import { prisma } from "@/lib/prisma";

const updateSchema = z.object({
  title: z.string().trim().max(120).nullable().optional(),
  destination: destinationSchema.optional(),
  status: z.enum(["ACTIVE", "PAUSED"]).optional(),
  expiresAt: z.iso.datetime().nullable().optional(),
  trafficSharePercent: z.number().int().min(0).max(20).optional(),
  tags: z.array(z.string().trim().min(1).max(32)).max(20).optional(),
});

type Context = { params: Promise<{ id: string }> };

export async function GET(request: Request, context: Context) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const { id } = await context.params;
  const link = await prisma.link.findFirst({
    where: { id, workspaceId: principal.workspaceId },
    include: {
      clicks: {
        orderBy: { occurredAt: "desc" },
        take: 100,
      },
    },
  });
  return link
    ? NextResponse.json({ data: link })
    : NextResponse.json({ error: "Link not found" }, { status: 404 });
}

export async function PATCH(request: Request, context: Context) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (principal.role === "VIEWER") {
    return NextResponse.json({ error: "Write access required" }, { status: 403 });
  }
  const parsed = updateSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid link configuration", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { id } = await context.params;
  const current = await prisma.link.findFirst({
    where: { id, workspaceId: principal.workspaceId },
    select: { id: true },
  });
  if (!current) return NextResponse.json({ error: "Link not found" }, { status: 404 });

  const data = parsed.data;
  const link = await prisma.link.update({
    where: { id },
    data: {
      ...data,
      expiresAt:
        data.expiresAt === undefined
          ? undefined
          : data.expiresAt === null
            ? null
            : new Date(data.expiresAt),
    },
  });
  return NextResponse.json({ data: link });
}

export async function DELETE(request: Request, context: Context) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (principal.role === "VIEWER") {
    return NextResponse.json({ error: "Write access required" }, { status: 403 });
  }
  const { id } = await context.params;
  const deleted = await prisma.link.deleteMany({
    where: { id, workspaceId: principal.workspaceId },
  });
  return deleted.count
    ? new NextResponse(null, { status: 204 })
    : NextResponse.json({ error: "Link not found" }, { status: 404 });
}
