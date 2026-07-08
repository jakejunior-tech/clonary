export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      accessCode: { select: { code: true } },
      _count: { select: { voices: true, generations: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Users</h2>
        <p className="text-sm text-muted-foreground mt-1">
          All registered users
        </p>
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Access Code</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Voices</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Generations</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No users yet
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-b border-card-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{u.name || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{u.phone || "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {u.accessCode.code}
                  </td>
                  <td className="px-4 py-3">{u._count.voices}</td>
                  <td className="px-4 py-3">{u._count.generations}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {u.createdAt.toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
