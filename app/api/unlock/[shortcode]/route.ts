import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { verifyPassword } from "@/lib/security";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ shortcode: string }> },
) {
  const { shortcode } = await context.params;
  const form = await request.formData();
  const password = form.get("password");
  const supabase = createSupabaseAdminClient();

  if (typeof password !== "string" || !supabase) {
    return NextResponse.redirect(new URL(`/unlock/${shortcode}?error=1`, request.url));
  }

  const { data } = await supabase
    .from("links")
    .select("password_hash")
    .eq("slug", shortcode)
    .single();
  const valid =
    typeof data?.password_hash === "string" &&
    verifyPassword(password, data.password_hash);

  if (!valid) {
    return NextResponse.redirect(new URL(`/unlock/${shortcode}?error=1`, request.url));
  }

  const secret = process.env.IP_HASH_SALT;
  if (!secret) {
    return NextResponse.json({ error: "Unlock signing is not configured" }, { status: 503 });
  }

  const response = NextResponse.redirect(new URL(`/${shortcode}`, request.url));
  response.cookies.set(
    `cu_unlock_${shortcode}`,
    createHmac("sha256", secret).update(shortcode).digest("hex"),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 12,
      path: `/${shortcode}`,
    },
  );
  return response;
}
