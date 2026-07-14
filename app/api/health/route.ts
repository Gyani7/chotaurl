import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

export async function GET() {
  const redis = getRedis();
  const checks = {
    application: "ok",
    database: process.env.DATABASE_URL ? "configured" : "demo",
    supabase:
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
        ? "configured"
        : "demo",
    redis: redis ? "configured" : "optional",
  };
  return NextResponse.json({
    status: "ok",
    checks,
    timestamp: new Date().toISOString(),
  });
}
