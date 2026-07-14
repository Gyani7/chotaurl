import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";

const inviteSchema = z.object({
  email: z.email(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).default("EDITOR"),
});

export async function GET(request: Request) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const [members, invitations] = await Promise.all([
    prisma.membership.findMany({
      where: { workspaceId: principal.workspaceId },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        role: true,
        createdAt: true,
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
      },
    }),
    prisma.workspaceInvitation.findMany({
      where: {
        workspaceId: principal.workspaceId,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
      select: { id: true, email: true, role: true, expiresAt: true, createdAt: true },
    }),
  ]);
  return NextResponse.json({ data: { members, invitations } });
}

export async function POST(request: Request) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (!["OWNER", "ADMIN"].includes(principal.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const parsed = inviteSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid invitation", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const token = randomBytes(32).toString("base64url");
  const invitation = await prisma.workspaceInvitation.create({
    data: {
      workspaceId: principal.workspaceId,
      email: parsed.data.email.toLowerCase(),
      role: parsed.data.role,
      tokenHash: hashToken(token),
      createdById: principal.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    select: { id: true, email: true, role: true, expiresAt: true },
  });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? new URL(request.url).origin;
  return NextResponse.json(
    {
      data: invitation,
      inviteUrl: `${appUrl}/invite/${token}`,
    },
    { status: 201 },
  );
}
