export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";

type StatusBadgeProps = { status: string };

function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
    APPROVED: "bg-green-50 text-green-700 ring-green-600/20",
    REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status] || styles.PENDING}`}
    >
      {status}
    </span>
  );
}

export default async function DashboardPage() {
  const session = await requireAuth();
  const userId = session.sub as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      voices: true,
      generations: {
        orderBy: { createdAt: "desc" },
        include: { voice: { select: { name: true } } },
      },
    },
  });

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">
          Welcome{user.name ? `, ${user.name}` : ""}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your cloned voices and generations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Cloned Voices</p>
          <p className="text-2xl font-semibold mt-1">{user.voices.length}</p>
        </div>
        <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Generations</p>
          <p className="text-2xl font-semibold mt-1">{user.generations.length}</p>
        </div>
        <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-semibold mt-1">
            {user.generations.filter((g) => g.status === "PENDING").length}
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/dashboard/clone"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Clone New Voice
        </Link>
        <Link
          href="/dashboard/generate"
          className="border border-border px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Generate Speech
        </Link>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
        <div className="rounded-xl border border-card-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Voice</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Text</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Audio</th>
              </tr>
            </thead>
            <tbody>
              {user.generations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No generations yet.{" "}
                    <Link href="/dashboard/generate" className="text-primary hover:underline">
                      Create one
                    </Link>
                  </td>
                </tr>
              ) : (
                user.generations.map((g) => (
                  <tr key={g.id} className="border-b border-card-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">{g.voice.name}</td>
                    <td className="px-4 py-3 max-w-[250px] truncate text-muted-foreground">
                      {g.text}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {g.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {g.audioUrl && g.status === "APPROVED" ? (
                        <audio controls className="h-8 w-32">
                          <source src={g.audioUrl} type="audio/mpeg" />
                        </audio>
                      ) : g.audioUrl ? (
                        <audio controls className="h-8 w-32">
                          <source src={g.audioUrl} type="audio/mpeg" />
                        </audio>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
