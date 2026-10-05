"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  BarChart3,
  Image as ImageIcon,
  Users,
  LogOut,
  Menu,
  X,
  FileText,
  Megaphone,
  Settings,
  Activity,
  ExternalLink,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Resource, Role } from "@/lib/types";
import { Spinner } from "./ui";

type Ctx = { resources: Resource[]; user: { name: string; email: string; role: Role } };
const AdminContext = createContext<Ctx | null>(null);

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin outside AdminShell");
  return ctx;
}

export function useResource(key: string) {
  return useAdmin().resources.find((r) => r.key === key);
}

const groupIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Content: FileText,
  "Lead generation": Megaphone,
  Settings: Settings,
  Tracking: Activity,
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ctx, setCtx] = useState<Ctx | null>(null);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    Promise.all([api<{ user: Ctx["user"] }>("auth/me"), api<{ resources: Resource[] }>("admin/schema")])
      .then(([me, schema]) => setCtx({ user: me.user, resources: schema.resources }))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="p-10 text-red-700">{error}</p>;
  if (!ctx) return <Spinner />;

  const { user, resources } = ctx;
  const can = (roles: Role[]) => user.role === "owner" || roles.includes(user.role);
  const groups = [...new Set(resources.map((r) => r.group))];

  const link = (href: string, label: string, Icon?: React.ComponentType<{ className?: string }>) => {
    const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");
    return (
      <Link
        key={href}
        href={href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
          active ? "bg-white/10 text-white" : "text-white/60 hover:bg-white/5 hover:text-white"
        }`}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        {label}
      </Link>
    );
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <AdminContext.Provider value={ctx}>
      <div className="lg:grid lg:grid-cols-[260px_1fr]">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-charcoal-900 px-4 py-3 text-white lg:hidden">
          <span className="font-extrabold">Momentum superadmin</span>
          <button
            onClick={() => {
              setOpenedAt(pathname);
              setOpen((o) => !o);
            }}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="grid size-10 place-items-center rounded-lg bg-white/10"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </header>

        <aside
          className={`${open ? "block" : "hidden"} fixed inset-0 top-16 z-20 overflow-y-auto bg-charcoal-900 p-4 lg:sticky lg:top-0 lg:block lg:h-dvh`}
        >
          <div className="mb-6 hidden items-center gap-2.5 px-3 pt-2 lg:flex">
            <svg viewBox="0 0 64 52" className="h-7 w-auto" aria-hidden>
              <path d="M2 38 L14 18 L19 29 L27 13 L31 22 L62 2 L42 30 L36 18 Z" fill="#33CBCC" />
              <path d="M16 50 L27 24 Q29 20 33 20 Q36 20 37 24 L40 34 L46 23 Q48 20 51 20 Q55 20 55 25 L56 50 L49 50 L48.5 33 L42 46 Q41 48 39 48 Q37 48 36 46 L31.5 33 L24 50 Z" fill="white" />
            </svg>
            <span className="text-sm leading-tight font-extrabold text-white">
              Momentum
              <span className="block text-xs font-medium text-white/50">Superadmin</span>
            </span>
          </div>

          <nav className="space-y-6" aria-label="Superadmin">
            <div className="space-y-0.5">
              {link("/", "Dashboard", LayoutDashboard)}
              {can(["leads"]) && link("/leads", "Leads", Inbox)}
              {can(["leads"]) && link("/reports", "Reports", BarChart3)}
            </div>
            {groups.map((g) => {
              const Icon = groupIcons[g];
              return (
                <div key={g}>
                  <p className="mb-1.5 flex items-center gap-2 px-3 text-xs font-semibold tracking-wide text-white/40 uppercase">
                    {Icon && <Icon className="size-3.5" />}
                    {g}
                  </p>
                  <div className="space-y-0.5">
                    {resources.filter((r) => r.group === g).map((r) => link(`/content/${r.key}`, r.label))}
                    {g === "Content" && can(["editor"]) && link("/media", "Media library", ImageIcon)}
                    {g === "Settings" && user.role === "owner" && link("/users", "Users", Users)}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="mt-8 border-t border-white/10 pt-4">
            <a href={process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000"} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:text-white">
              <ExternalLink className="size-4" /> View website
            </a>
            <div className="mt-2 px-3 text-sm text-white">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-white/50 capitalize">{user.role}</p>
            </div>
            <button onClick={logout} className="mt-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 py-8 sm:px-8 lg:px-10">{children}</main>
      </div>
    </AdminContext.Provider>
  );
}
