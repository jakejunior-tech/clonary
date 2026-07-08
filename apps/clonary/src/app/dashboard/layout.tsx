import Link from "next/link";
import { logout } from "@/lib/actions";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: "⊞" },
  { label: "Clone Voice", href: "/dashboard/clone", icon: "🎤" },
  { label: "Generate", href: "/dashboard/generate", icon: "✨" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-60 shrink-0 border-r border-card-border bg-muted/30 flex flex-col">
        <div className="flex items-center gap-2 px-5 h-14 border-b border-card-border">
          <Link href="/" className="text-lg font-semibold">Clonary</Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-card-border">
          <form action={logout}>
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full">
              <span className="text-base">🚪</span>
              Logout
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="h-14 border-b border-card-border flex items-center px-6 bg-white">
          <h1 className="text-sm font-medium text-muted-foreground">
            Clonary Dashboard
          </h1>
        </div>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
