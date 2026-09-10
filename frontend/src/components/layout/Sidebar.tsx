import { NavLink } from "react-router-dom";
import { LayoutDashboard, Factory, Globe2, Crosshair, Table2, Info, Radar, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutDashboard },
  { to: "/sectors", label: "Sector Intelligence", icon: Factory },
  { to: "/geography", label: "Geographic Intelligence", icon: Globe2 },
  { to: "/risk-matrix", label: "Risk Matrix", icon: Crosshair },
  { to: "/explorer", label: "Data Explorer", icon: Table2 },
  { to: "/about", label: "About Dataset", icon: Info },
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onMobileClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200/70 bg-surface transition-all duration-200 dark:border-slate-800 dark:bg-surface-dark",
          "lg:static lg:translate-x-0",
          collapsed ? "lg:w-[76px]" : "lg:w-64",
          "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200/70 px-4 dark:border-slate-800">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-sm">
              <Radar size={18} strokeWidth={2.2} />
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <div className="truncate text-sm font-bold leading-tight text-slate-900 dark:text-white">
                  Strategic Insights
                </div>
                <div className="truncate text-[11px] leading-tight text-slate-500 dark:text-slate-400">Intelligence</div>
              </div>
            )}
          </div>
          <button
            onClick={onMobileClose}
            className="focus-ring rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={onMobileClose}
              className={({ isActive }) =>
                cn(
                  "focus-ring group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                )
              }
            >
              <item.icon size={18} className="shrink-0" strokeWidth={2} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {!collapsed && (
          <div className="border-t border-slate-200/70 p-4 text-[11px] text-slate-400 dark:border-slate-800 dark:text-slate-500">
            Data-driven analysis of global strategic signals.
          </div>
        )}
      </aside>
    </>
  );
}
