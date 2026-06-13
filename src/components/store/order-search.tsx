"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function OrderSearch({ initialValue = "" }: { initialValue?: string }) {
  const [invoice, setInvoice] = useState(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoice.trim()) return;

    setIsLoading(true);
    // Push ke URL dengan parameter invoice
    router.push(`/order?invoice=${encodeURIComponent(invoice.trim())}`);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
          <Input
            value={invoice}
            onChange={(e) => setInvoice(e.target.value)}
            placeholder="Masukkan Invoice ID (contoh: INV-12345...)"
            className="pl-9 sm:pl-10 h-10 sm:h-12 text-sm sm:text-base rounded-xl"
            required
          />
        </div>
        <Button type="submit" className="h-10 sm:h-12 text-sm sm:text-base rounded-xl px-4 sm:px-8" disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" /> : null}
          Lacak Pesanan
        </Button>
      </form>
      <p className="text-xs sm:text-sm text-slate-500 mt-3 text-center px-4 sm:px-0">
        Invoice ID dapat ditemukan di halaman sukses pembayaran atau hubungi admin.
      </p>
    </div>
  );
}
