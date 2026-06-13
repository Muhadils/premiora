"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Settings, LogOut, BarChart3, MessageSquareWarning } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: BarChart3, label: "Pendapatan", href: "/admin/revenue" },
  { icon: MessageSquareWarning, label: "Keluhan", href: "/admin/complaints" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export function Sidebar({ className = "", onClose, pendingComplaintsCount = 0 }: { className?: string; onClose?: () => void; pendingComplaintsCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className={`w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-50 ${className}`}>
      <div className="h-16 flex items-center justify-between px-6 bg-slate-950 border-b border-slate-800">
        <div className="scale-90 origin-left">
          <Logo />
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      
      <div className="p-4 flex-1">
        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-3">
          Menu Utama
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary-600 text-white font-medium shadow-md shadow-primary-900/20" 
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "text-primary-200" : "text-slate-400"}`} />
                <span className="truncate">{item.label}</span>
                {item.label === "Keluhan" && pendingComplaintsCount > 0 && (
                  <span className={`ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                    isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    ADA {pendingComplaintsCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 text-center">
          Premiora Admin v1.0
        </div>
      </div>
    </aside>
  );
}
