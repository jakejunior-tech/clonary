export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import type { Generation, User, ClonedVoice } from "@clonary/database";
import Link from "next/link";

type GenerationRow = Generation & {
  user: Pick<User, "name" | "phone">;
  voice: Pick<ClonedVoice, "name">;
};

async function getStats() {
  const [users, generations, pendingGenerations, activeCodes] =
    await Promise.all([
      prisma.user.count(),
      prisma.generation.count(),
      prisma.generation.count({ where: { status: "PENDING" } }),
      prisma.accessCode.count({ where: { isActive: true } }),
    ]);

  return { users, generations, pendingGenerations, activeCodes };
}

async function getRecentGenerations() {
  return prisma.generation.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, phone: true } },
      voice: { select: { name: true } },
    },
  });
}

function StatusBadge({ status }: { status: string }) {
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

function StatCard({
  label,
  value,
  icon,
  href,
}: {
  label: string;
  value: number;
  icon: string;
  href?: string;
}) {
  const card = (
    <div className="rounded-xl border border-card-border bg-card p-5 flex items-center gap-4 shadow-sm">
      <div className="w-11 h-11 rounded-lg bg-muted flex items-center justify-center text-lg">
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{card}</Link>;
  }

  return card;
}

export default async function DashboardPage() {
  const stats = await getStats();
  const generations = await getRecentGenerations();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Key metrics at a glance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.users} icon="👥" />
        <StatCard
          label="Total Generations"
          value={stats.generations}
          icon="🎵"
        />
        <StatCard
          label="Pending Review"
          value={stats.pendingGenerations}
          icon="⏳"
          href="/generations"
        />
        <StatCard
          label="Active Codes"
          value={stats.activeCodes}
          icon="⚙"
          href="/access-codes"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Generations</h3>
        <div className="rounded-xl border border-card-border bg-card overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  User
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Voice
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Text
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {generations.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No generations yet
                  </td>
                </tr>
              ) : (
                generations.map((g: GenerationRow) => (
                  <tr key={g.id} className="border-b border-card-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      {g.user.name || g.user.phone || "—"}
                    </td>
                    <td className="px-4 py-3">{g.voice.name}</td>
                    <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">
                      {g.text}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {g.createdAt.toLocaleDateString()}
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
