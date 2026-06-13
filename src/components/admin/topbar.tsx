"use client";

import { LogOut, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/actions/auth.actions";
import { useTransition, useState } from "react";
import { Sidebar } from "./sidebar";

export function Topbar({ pendingComplaintsCount = 0 }: { pendingComplaintsCount?: number }) {
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAdmin();
    });
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
        <div className="flex items-center gap-4">
          {/* Mobile menu button (hidden on desktop) */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        <h2 className="font-semibold text-slate-800 hidden sm:block">Dashboard Administrator</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 py-1.5 px-3 rounded-full text-sm font-medium text-slate-700">
          <div className="h-6 w-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="hidden sm:inline">Admin</span>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout} 
          disabled={isPending}
          className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
        >
          <LogOut className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">{isPending ? "Keluar..." : "Logout"}</span>
        </Button>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    {isMobileMenuOpen && (
      <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
        <div onClick={(e) => e.stopPropagation()} className="h-full">
          <Sidebar onClose={() => setIsMobileMenuOpen(false)} pendingComplaintsCount={pendingComplaintsCount} />
        </div>
      </div>
    )}
    </>
  );
}
