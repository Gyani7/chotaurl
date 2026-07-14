import type { Metadata } from "next";
import { DashboardApp } from "@/components/dashboard-app";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  return <DashboardApp userEmail={user?.email ?? "alex@acme.studio"} />;
}
