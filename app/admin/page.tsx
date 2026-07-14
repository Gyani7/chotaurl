import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminApp } from "@/components/admin-app";
import { prisma } from "@/lib/prisma";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Platform administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (process.env.DATABASE_URL) {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
    if (!user) redirect("/login?next=/admin");
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: { isAdmin: true, isSuspended: true },
    });
    if (!profile?.isAdmin || profile.isSuspended) redirect("/dashboard");
  }

  return <AdminApp />;
}
