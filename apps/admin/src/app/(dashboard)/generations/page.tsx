export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { approveGeneration, rejectGeneration, markAsPaid } from "@/lib/actions";

type SearchParams = Promise<{ status?: string; payment?: string }>;

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700 ring-amber-600/20",
    APPROVED: "bg-green-50 text-green-700 ring-green-600/20",
    REJECTED: "bg-red-50 text-red-700 ring-red-600/20",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    UNPAID: "bg-amber-50 text-amber-700 ring-amber-600/20",
    PAID: "bg-green-50 text-green-700 ring-green-600/20",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${styles[status] || styles.UNPAID}`}>
      {status}
    </span>
  );
}

function FilterTab({
  label,
  value,
  current,
  param,
}: {
  label: string;
  value: string | undefined;
  current: string | undefined;
  param: string;
}) {
  const isActive = current === value || (!current && !value);
  const href = value ? `?${param}=${value}` : `?`;
  return (
    <a
      href={href}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
        isActive
          ? "bg-black text-white"
          : "text-muted-foreground hover:bg-muted"
      }`}
    >
      {label}
    </a>
  );
}

export default async function GenerationsPage(props: { searchParams: SearchParams }) {
  const { status, payment } = await props.searchParams;

  const where: Record<string, any> = {};
  if (status) where.status = status;
  if (payment) where.paymentStatus = payment;

  const generations = await prisma.generation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, phone: true } },
      voice: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Generations</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Review and manage voice generations
        </p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <FilterTab label="All" value={undefined} current={status} param="status" />
        <FilterTab label="Pending" value="PENDING" current={status} param="status" />
        <FilterTab label="Approved" value="APPROVED" current={status} param="status" />
        <FilterTab label="Rejected" value="REJECTED" current={status} param="status" />
        <span className="text-muted-foreground mx-1">|</span>
        <FilterTab label="Unpaid" value="UNPAID" current={payment} param="payment" />
        <FilterTab label="Paid" value="PAID" current={payment} param="payment" />
      </div>

      <div className="rounded-xl border border-card-border bg-card overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Voice</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Text</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Payment</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {generations.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                  No generations found
                </td>
              </tr>
            ) : (
              generations.map((g) => (
                <tr key={g.id} className="border-b border-card-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3">{g.user.name || g.user.phone || "—"}</td>
                  <td className="px-4 py-3">{g.voice.name}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate text-muted-foreground">{g.text}</td>
                  <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                  <td className="px-4 py-3"><PaymentBadge status={g.paymentStatus} /></td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {g.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {g.status === "PENDING" && (
                        <>
                          <form action={approveGeneration.bind(null, g.id)}>
                            <button className="px-2.5 py-1 text-xs font-medium rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors">
                              Approve
                            </button>
                          </form>
                          <form action={rejectGeneration.bind(null, g.id)}>
                            <button className="px-2.5 py-1 text-xs font-medium rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                              Reject
                            </button>
                          </form>
                        </>
                      )}
                      {g.paymentStatus === "UNPAID" && (
                        <form action={markAsPaid.bind(null, g.id)}>
                          <button className="px-2.5 py-1 text-xs font-medium rounded-md bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                            Mark Paid
                          </button>
                        </form>
                      )}
                    </div>
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
