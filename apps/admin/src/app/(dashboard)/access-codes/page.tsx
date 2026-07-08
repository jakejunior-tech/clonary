export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { createAccessCode, toggleAccessCode } from "@/lib/actions";

function ActiveBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset bg-green-50 text-green-700 ring-green-600/20">
        Active
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset bg-zinc-50 text-zinc-500 ring-zinc-600/20">
      Inactive
    </span>
  );
}

function TypeBadge({ type }: { type: string }) {
  const styles: Record<string, string> = {
    ADMIN: "bg-purple-50 text-purple-700 ring-purple-600/20",
    USER: "bg-blue-50 text-blue-700 ring-blue-600/20",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[type] || styles.USER}`}>
      {type}
    </span>
  );
}

export default async function AccessCodesPage() {
  const codes = await prisma.accessCode.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { users: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Access Codes</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage registration access codes
        </p>
      </div>

      <div className="rounded-xl border border-card-border bg-card p-5 shadow-sm">
        <h3 className="text-sm font-semibold mb-3">Create New Code</h3>
        <form action={createAccessCode} className="flex items-end gap-3">
          <div className="flex-1">
            <label htmlFor="code" className="block text-xs font-medium text-muted-foreground mb-1">
              Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              placeholder="e.g. CLONARY-LAUNCH-2024"
              className="w-full rounded-lg border border-card-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label htmlFor="type" className="block text-xs font-medium text-muted-foreground mb-1">
              Type
            </label>
            <select
              id="type"
              name="type"
              required
              className="rounded-lg border border-card-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <button className="px-4 py-2 text-sm font-medium rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors">
            Create
          </button>
        </form>
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Code</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Users</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Created</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {codes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                  No access codes yet
                </td>
              </tr>
            ) : (
              codes.map((c) => (
                <tr key={c.id} className="border-b border-card-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-sm">{c.code}</td>
                  <td className="px-4 py-3"><TypeBadge type={c.type} /></td>
                  <td className="px-4 py-3"><ActiveBadge isActive={c.isActive} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{c._count.users}</td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {c.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <form action={toggleAccessCode.bind(null, c.id, c.isActive)}>
                      <button className="px-2.5 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted-foreground/20 transition-colors">
                        {c.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </form>
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
