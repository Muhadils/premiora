"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function AdminOrderSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search")?.toString() || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      // Reset to page 1 when searching
      params.set("page", "1");
      
      router.push(`${pathname}?${params.toString()}`);
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, router, pathname, searchParams]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <Input
        type="text"
        placeholder="Cari Invoice, Nama, atau WhatsApp..."
        className="pl-9"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
