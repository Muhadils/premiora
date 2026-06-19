"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Receipt, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/utils/constants";

export function HeroSection() {
  const router = useRouter();
  const [invoiceQuery, setInvoiceQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (invoiceQuery.trim()) {
      router.push(`/order?invoice=${invoiceQuery.trim()}`);
    } else {
      router.push("/order");
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-grid-animated" style={{ maskImage: "linear-gradient(to bottom, white 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, white 40%, transparent 100%)" }} />
      {/* Subtle Glow Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-100/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="container-custom relative z-10 w-full">
        <div className="mx-auto max-w-5xl text-center px-4 sm:px-0">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6 sm:mb-8"
          >
            <div className="relative overflow-hidden inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold text-emerald-700 shadow-sm">
              <div className="absolute inset-0 animate-shimmer pointer-events-none" />
              <ShieldCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="tracking-wider uppercase relative z-10">VERIFIED DIGITAL STORE</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Akses Akun Premium,
            <br className="hidden sm:block" />{" "}
            <span className="bg-gradient-to-r from-primary-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Instan & Bergaransi.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm leading-relaxed text-slate-500 sm:text-lg"
          >
            Nikmati layanan digital dengan harga Terbaik. <strong>Otomatis, cepat, dan bergaransi.</strong> Pilihan cerdas buat dipakai sendiri atau dijual lagi.
          </motion.p>

          {/* Smart Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-12 max-w-xl mx-auto"
          >
            <form onSubmit={handleSearch} className="bg-white rounded-2xl sm:rounded-full p-2 sm:p-2.5 shadow-xl shadow-slate-200/50 border border-slate-200 flex flex-col sm:flex-row items-center gap-2 sm:gap-4 relative z-20">
              
              {/* Invoice Tracker */}
              <div className="flex-1 w-full flex items-center px-4 py-2 sm:py-0">
                <Receipt className="h-5 w-5 text-slate-400 mr-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Lacak ID Invoice (contoh: INV-12345)..."
                  className="w-full bg-transparent border-none outline-none text-slate-900 placeholder:text-slate-400 text-sm sm:text-base focus:ring-0 uppercase"
                  value={invoiceQuery}
                  onChange={(e) => setInvoiceQuery(e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full sm:w-auto rounded-xl sm:rounded-full px-8 h-12 shadow-md shadow-primary-500/20 text-base font-semibold bg-primary-600 hover:bg-primary-700">
                Cek Status
              </Button>
            </form>
          </motion.div>

          {/* Categories / Quick Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            <Link href="/products" className="px-5 py-2 rounded-full bg-primary-600 text-white text-xs sm:text-sm font-medium shadow-md shadow-primary-500/20 hover:bg-primary-700 transition-colors">
              Semua Produk
            </Link>
            {CATEGORIES.slice(0, 3).map((cat) => (
              <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="px-5 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-xs sm:text-sm font-medium hover:border-primary-200 hover:text-primary-600 transition-colors shadow-sm">
                {cat.name}
              </Link>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
