"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative -mt-8 z-20">
      <div className="container-custom">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari produk premium... (Canva, ChatGPT, Spotify, dll)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 rounded-2xl border-slate-200 bg-white pl-12 pr-4 text-base shadow-xl shadow-slate-200/50 focus:shadow-2xl focus:shadow-primary-500/10 transition-shadow"
            />
          </div>
        </form>
      </div>
    </section>
  );
}
