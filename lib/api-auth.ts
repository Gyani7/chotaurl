import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/security";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type ApiPrincipal = {
  userId: string;
  workspaceId: string;
  role: "OWNER" | "ADMIN" | "EDITOR" | "VIEWER";
};

export async function getApiPrincipal(request: Request): Promise<ApiPrincipal | null> {
  if (!process.env.DATABASE_URL) return null;

  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Bearer ch_")) {
    const token = authorization.slice(7);
    const apiKey = await prisma.apiKey.findUnique({
      where: { keyHash: hashToken(token) },
      select: {
        id: true,
        userId: true,
        workspaceId: true,
        expiresAt: true,
        revokedAt: true,
      },
    });

    if (
      apiKey &&
      !apiKey.revokedAt &&
      (!apiKey.expiresAt || apiKey.expiresAt > new Date())
    ) {
      await prisma.apiKey.update({
        where: { id: apiKey.id },
        data: { lastUsedAt: new Date() },
      });
      return {
        userId: apiKey.userId,
        workspaceId: apiKey.workspaceId,
        role: "EDITOR",
      };
    }
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!user) return null;

  const requestedWorkspace = (await headers()).get("x-workspace-id");
  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      ...(requestedWorkspace ? { workspaceId: requestedWorkspace } : {}),
    },
    orderBy: { createdAt: "asc" },
    select: { workspaceId: true, role: true },
  });

  return membership
    ? {
        userId: user.id,
        workspaceId: membership.workspaceId,
        role: membership.role,
      }
    : null;
}
