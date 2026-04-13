"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ScanLine,
  IndianRupee,
  UserCircle,
  Bell,
  Settings,
  ChevronRight,
  X,
  Wine,
} from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/scan", label: "Scan", icon: ScanLine },
  { href: "/admin/sales", label: "Sales", icon: IndianRupee },
  { href: "/admin/profile", label: "Profile", icon: UserCircle },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

function SidebarContent({ pathname, onClose }) {
  const matching = adminLinks.filter((item) => {
    if (pathname === item.href) return true;
    if (item.href !== "/admin" && pathname.startsWith(item.href + "/")) return true;
    return false;
  });

  const activeHref = matching.length
    ? matching.reduce((a, b) => (b.href.length > a.href.length ? b : a)).href
    : "/admin";

  return (
    <div className="flex h-full flex-col bg-white text-slate-800">
      {/* Header */}
      <div className="border-b border-slate-200 px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg">
              <Wine size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-bold text-slate-900">
                Janhavi
              </h2>
              <p className="truncate text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                Beer Shop
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Admin Badge */}
      <div className="px-4 pt-4">
        <div className="rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3">
          <div className="inline-flex items-center rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
            Admin Panel
          </div>
          <p className="mt-2 text-xs text-slate-600">
            Manage stock, scan products and monitor daily sales
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-3 px-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Main Navigation
          </p>
        </div>

        <nav className="space-y-1.5">
          {adminLinks.map((item) => {
            const Icon = item.icon;
            const active = activeHref === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${active
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${active
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600 group-hover:bg-amber-100 group-hover:text-amber-700"
                    }`}
                >
                  <Icon size={18} />
                </div>

                <span className="truncate">{item.label}</span>

                <ChevronRight
                  size={16}
                  className={`ml-auto transition ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                />
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 p-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-800">© 2026 Janhavi Beer Shop</p>
          <p className="mt-1">Inventory & sales management dashboard</p>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({
  isMobileOpen = false,
  onClose = () => { },
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <SidebarContent pathname={pathname} onClose={() => { }} />
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-[80] flex w-[86%] max-w-[320px] flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 lg:hidden ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <SidebarContent pathname={pathname} onClose={onClose} />
      </aside>
    </>
  );
}