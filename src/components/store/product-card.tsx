"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, Clock, Shield, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    short_description?: string | null;
    thumbnail_url?: string | null;
    selling_price: number;
    warranty_duration: string;
    estimated_process: string;
    is_featured?: boolean;
    is_best_seller?: boolean;
    stock?: number;
    rating_avg: number;
    rating_count: number;
    sold_count: number;
    category?: {
      name: string;
      slug: string;
    } | null;
  };
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <Link
      href={isOutOfStock ? "#" : `/products/${product.slug}`}
      className={cn(
        "group relative flex flex-col items-center overflow-hidden rounded-[20px] sm:rounded-[24px] border border-slate-100 bg-white p-3 sm:p-5 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 hover:border-primary-100",
        isOutOfStock && "opacity-75 cursor-not-allowed grayscale-[0.2]",
        className
      )}
      onClick={(e) => {
        if (isOutOfStock) e.preventDefault();
      }}
    >
      {/* Badges Top Right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 items-end">
        {isOutOfStock ? (
           <span className="flex items-center gap-1.5 rounded-md bg-red-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wide text-red-600 uppercase shadow-sm">
             <span className="relative flex h-1.5 w-1.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
             </span>
             HABIS
           </span>
        ) : (
          <>
            {product.is_best_seller && (
              <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wide text-rose-600 uppercase">
                HOT
              </span>
            )}
            {product.is_featured && !product.is_best_seller && (
              <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wide text-blue-600 uppercase">
                SMART
              </span>
            )}
            {product.stock !== undefined && product.stock > 0 && (
              <span className="flex items-center gap-1.5 rounded-md bg-emerald-100 px-2 py-0.5 text-[9px] sm:text-[10px] font-extrabold tracking-wide text-emerald-600 uppercase shadow-sm">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                ADA {product.stock}
              </span>
            )}
          </>
        )}
      </div>

      {/* Centered Icon wrapper */}
      <div className="relative mb-3 sm:mb-5 mt-1 sm:mt-2 flex h-[75px] w-[75px] sm:h-[110px] sm:w-[110px] items-center justify-center rounded-[20px] sm:rounded-[28px] bg-slate-50/60 p-2.5 sm:p-4 transition-transform duration-500 group-hover:scale-105">
        {product.thumbnail_url ? (
          <div className="relative h-full w-full overflow-hidden rounded-[14px] sm:rounded-[20px] shadow-sm">
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              width={110}
              height={110}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-slate-300" />
        )}
      </div>

      {/* Category */}
      <span className="mb-1 text-[8px] sm:text-[10px] font-extrabold uppercase tracking-[0.15em] text-primary-600/80">
        {product.category?.name || "UMUM"}
      </span>

      {/* Title */}
      <h3 className="mb-1 sm:mb-1.5 text-center text-[13px] sm:text-[17px] font-bold text-slate-800 line-clamp-1">
        {product.name}
      </h3>

      {/* Subtitle / Description */}
      <p className="text-center text-[9px] sm:text-xs text-slate-400 font-medium line-clamp-1">
        {product.short_description || "Akun Premium Berkualitas"}
      </p>
    </Link>
  );
}
