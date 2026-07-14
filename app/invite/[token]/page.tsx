import { Users2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Logo } from "@/components/logo";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  if (!process.env.DATABASE_URL) redirect("/login");

  const invitation = await prisma.workspaceInvitation.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { workspace: { select: { name: true } } },
  });
  if (!invitation || invitation.acceptedAt || invitation.expiresAt <= new Date()) {
    redirect("/link-not-found");
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!user) redirect(`/login?next=/invite/${token}`);

  return (
    <main className="grid min-h-screen place-items-center p-5">
      <div className="w-full max-w-[440px] text-center">
        <Logo />
        <div className="mt-10 rounded-2xl border border-[var(--line)] bg-[var(--bg-elevated)] p-7 shadow-[var(--shadow)]">
          <span className="mx-auto grid size-12 place-items-center rounded-xl bg-[rgba(146,235,40,.1)] text-[var(--brand)]">
            <Users2 size={21} />
          </span>
          <p className="mt-6 text-xs uppercase tracking-[.14em] text-[var(--brand)]">
            Workspace invitation
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-[-.04em]">
            Join {invitation.workspace.name}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
            You have been invited as {invitation.role.toLowerCase()} using{" "}
            {invitation.email}.
          </p>
          {user.email?.toLowerCase() === invitation.email.toLowerCase() ? (
            <form action={`/api/invite/${token}`} method="post" className="mt-7">
              <button className="button-primary h-12 w-full">Accept invitation</button>
            </form>
          ) : (
            <p className="mt-7 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-xs leading-5 text-[var(--warning)]">
              Sign in with {invitation.email} to accept this invitation.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
