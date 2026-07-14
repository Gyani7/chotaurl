import { nanoid } from "nanoid";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getApiPrincipal } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const domainSchema = z.object({
  hostname: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^(?=.{4,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/,
      "Enter a valid domain or subdomain",
    ),
});

export async function GET(request: Request) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const domains = await prisma.domain.findMany({
    where: { workspaceId: principal.workspaceId },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { links: true } } },
  });
  return NextResponse.json({ data: domains });
}

export async function POST(request: Request) {
  const principal = await getApiPrincipal(request);
  if (!principal) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  if (!["OWNER", "ADMIN"].includes(principal.role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const parsed = domainSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid domain", details: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const verificationId = `chotaurl-verify=${nanoid(32)}`;
  try {
    const domain = await prisma.domain.create({
      data: {
        workspaceId: principal.workspaceId,
        hostname: parsed.data.hostname,
        verificationId,
        status: "VERIFYING",
      },
    });
    return NextResponse.json(
      {
        data: domain,
        dns: {
          type: "CNAME",
          name: parsed.data.hostname,
          value: "cname.vercel-dns.com",
          verification: {
            type: "TXT",
            name: `_chotaurl.${parsed.data.hostname}`,
            value: verificationId,
          },
        },
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "This domain is already connected" }, { status: 409 });
  }
}
