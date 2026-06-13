"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MotionSection, MotionStaggerItem } from "@/lib/motion";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { getFeaturedProducts, getBestSellerProducts, getLatestProducts } from "@/lib/data/mock-products";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: ReturnType<typeof getFeaturedProducts>;
  viewAllHref?: string;
}

function ProductSection({ title, subtitle, products, viewAllHref }: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="section">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-slate-500">{subtitle}</p>
            )}
          </div>
          {viewAllHref && (
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link href={viewAllHref}>
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>

        <MotionSection className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <MotionStaggerItem key={product.id}>
              <ProductCard product={product} />
            </MotionStaggerItem>
          ))}
        </MotionSection>

        {viewAllHref && (
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href={viewAllHref}>
                Lihat Semua Produk
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export function FeaturedProducts() {
  const products = getFeaturedProducts();
  return (
    <ProductSection
      title="Produk Unggulan"
      subtitle="Pilihan terbaik yang paling diminati"
      products={products}
      viewAllHref="/products?filter=featured"
    />
  );
}

export function BestSellerProducts() {
  const products = getBestSellerProducts();
  return (
    <div className="bg-slate-50">
      <ProductSection
        title="Best Seller 🔥"
        subtitle="Produk terlaris yang paling banyak dibeli"
        products={products}
        viewAllHref="/products?sort=best-seller"
      />
    </div>
  );
}

export function LatestProducts() {
  const products = getLatestProducts();
  return (
    <ProductSection
      title="Produk Terbaru"
      subtitle="Koleksi terbaru yang baru tersedia"
      products={products}
      viewAllHref="/products?sort=newest"
    />
  );
}
