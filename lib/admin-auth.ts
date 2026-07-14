import { getApiPrincipal } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin(request: Request) {
  const principal = await getApiPrincipal(request);
  if (!principal) return null;
  const user = await prisma.user.findUnique({
    where: { id: principal.userId },
    select: { isAdmin: true, isSuspended: true },
  });
  return user?.isAdmin && !user.isSuspended ? principal : null;
}
