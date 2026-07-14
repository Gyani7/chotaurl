import { resolveCname, resolveTxt } from "node:dns/promises";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const domains = await prisma.domain.findMany({
    where: { status: { in: ["PENDING", "VERIFYING", "FAILED"] } },
  });
  const results = await Promise.all(
    domains.map(async (domain) => {
      try {
        const [cnames, txtRecords] = await Promise.all([
          resolveCname(domain.hostname).catch(() => []),
          resolveTxt(`_chotaurl.${domain.hostname}`).catch(() => []),
        ]);
        const cnameValid = cnames.some((value) => value.endsWith("vercel-dns.com"));
        const verificationValid = txtRecords
          .flat()
          .some((value) => value === domain.verificationId);
        const status = cnameValid && verificationValid ? "ACTIVE" : "VERIFYING";
        await prisma.domain.update({ where: { id: domain.id }, data: { status } });
        return { hostname: domain.hostname, status };
      } catch {
        await prisma.domain.update({
          where: { id: domain.id },
          data: { status: "FAILED" },
        });
        return { hostname: domain.hostname, status: "FAILED" };
      }
    }),
  );
  return NextResponse.json({ data: results });
}
