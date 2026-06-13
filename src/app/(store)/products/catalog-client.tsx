"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/store/product-card";
import { MotionDiv, fadeInUp } from "@/lib/motion";
import { CATEGORIES } from "@/lib/utils/constants";
import { cn } from "@/lib/utils/cn";

type SortOption = "newest" | "price-low" | "price-high" | "best-seller" | "popular";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "popular", label: "Populer" },
  { value: "newest", label: "Terbaru" },
  { value: "price-low", label: "Harga Terendah" },
  { value: "price-high", label: "Harga Tertinggi" },
  { value: "best-seller", label: "Terlaris" },
];

export function ProductCatalogClient({ initialProducts }: { initialProducts: any[] }) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = [...initialProducts];

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.short_description?.toLowerCase().includes(query) ||
          p.category?.name?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory) {
      products = products.filter((p) => p.category?.slug === selectedCategory);
    }

    // Sort
    switch (sortBy) {
      case "newest":
        products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case "price-low":
        products.sort((a, b) => a.selling_price - b.selling_price);
        break;
      case "price-high":
        products.sort((a, b) => b.selling_price - a.selling_price);
        break;
      case "best-seller":
        products.sort((a, b) => b.sold_count - a.sold_count);
        break;
      case "popular":
      default:
        products.sort((a, b) => (b.rating_avg || 0) * (b.rating_count || 0) - (a.rating_avg || 0) * (a.rating_count || 0));
        break;
    }

    return products;
  }, [searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSortBy("popular");
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className="pt-20 lg:pt-24">
      <div className="container-custom section">
        {/* Header */}
        <MotionDiv variants={fadeInUp}>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Semua Produk
            </h1>
            <p className="mt-2 text-slate-500">
              Temukan akun premium digital yang kamu butuhkan
            </p>
          </div>
        </MotionDiv>

        {/* Search & Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Cari produk..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(showFilters && "border-primary-300 bg-primary-50 text-primary-700")}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <MotionDiv variants={fadeInUp} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="space-y-4">
                {/* Categories */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Kategori
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={cn(
                        "rounded-full px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer",
                        !selectedCategory
                          ? "bg-primary-600 text-white border-primary-600"
                          : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                      )}
                    >
                      Semua
                    </button>
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => setSelectedCategory(cat.slug === selectedCategory ? "" : cat.slug)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer",
                          cat.slug === selectedCategory
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">
                    Urutkan
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer",
                          option.value === sortBy
                            ? "bg-primary-600 text-white border-primary-600"
                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </MotionDiv>
          )}

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Filter aktif:</span>
              {selectedCategory && (
                <Badge variant="outline" className="gap-1 cursor-pointer" onClick={() => setSelectedCategory("")}>
                  {CATEGORIES.find((c) => c.slug === selectedCategory)?.name}
                  <X className="h-3 w-3" />
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="outline" className="gap-1 cursor-pointer" onClick={() => setSearchQuery("")}>
                  &quot;{searchQuery}&quot;
                  <X className="h-3 w-3" />
                </Badge>
              )}
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:underline cursor-pointer"
              >
                Hapus semua
              </button>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-900">{filteredProducts.length}</span> produk
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">
              Produk tidak ditemukan
            </h3>
            <p className="mt-2 text-sm text-slate-500 max-w-md">
              Coba ubah kata kunci pencarian atau filter kategori kamu
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Reset Filter
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
