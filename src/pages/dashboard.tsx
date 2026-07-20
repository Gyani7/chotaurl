import { useEffect, useState } from "react";
import { DashboardApp } from "@/components/dashboard-app";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function DashboardPage() {
  const [userEmail, setUserEmail] = useState("alex@acme.studio");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  return <DashboardApp userEmail={userEmail} />;
}
