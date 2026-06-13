"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Package } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/products", label: "Produk" },
  { href: "/order", label: "Lacak Order" },
  { href: "/bantuan", label: "Pusat Bantuan" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-gradient-to-r from-slate-950 via-blue-950/90 to-slate-950 backdrop-blur-md border-b border-blue-500/20 shadow-lg shadow-blue-900/10"
          : "bg-transparent"
      )}
    >
      <nav className="container-custom">
        <div className="flex h-14 items-center justify-between lg:h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                  pathname === link.href
                    ? "text-blue-400"
                    : "text-slate-300 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-500 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" asChild>
              <Link href="/products">
                <Search className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white" asChild>
              <Link href="/order">
                <Package className="h-4 w-4" />
                Lacak Order
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 lg:hidden"
            aria-label="Toggle menu"
          >
            {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/10 bg-slate-900 lg:hidden"
          >
            <div className="container-custom py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-white/10">
                <Button variant="outline" size="sm" className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10" asChild>
                  <Link href="/order">
                    <Package className="h-4 w-4" />
                    Lacak Order
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
