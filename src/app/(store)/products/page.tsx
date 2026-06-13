import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductCatalogClient } from "./catalog-client";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/server";
import { PremkuService } from "@/lib/supplier/premku.service";

export const metadata: Metadata = {
  title: "Semua Produk",
  description:
    "Temukan akun premium digital yang kamu butuhkan. Canva Pro, ChatGPT Plus, Spotify Premium, Netflix, dan lainnya.",
};

function CatalogSkeleton() {
  return (
    <div className="pt-20 lg:pt-24">
      <div className="container-custom section">
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-64 mx-auto" />
          <Skeleton className="h-5 w-80 mx-auto mt-3" />
        </div>
        <Skeleton className="h-11 w-full mb-8" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProductCatalogPage() {
  const supabase = await createClient();
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*, categories(slug, name)")
    .order("created_at", { ascending: false });

  // Fetch live supplier stock
  let supplierProducts: any[] = [];
  try {
    const res = await PremkuService.getProducts();
    if (res.success && res.products) {
      supplierProducts = res.products;
    }
  } catch (error) {
    console.error("Failed to fetch supplier products for catalog", error);
  }

  // Inject live stock and format category
  const products = dbProducts?.map((prod) => {
    const formattedProd = { ...prod, category: prod.categories || null };
    if (formattedProd.supplier_product_code) {
      const supplierData = supplierProducts.find(sp => String(sp.id) === formattedProd.supplier_product_code);
      if (supplierData) {
        return { ...formattedProd, stock: Number(supplierData.stock) };
      }
    }
    return formattedProd;
  }) || [];

  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <ProductCatalogClient initialProducts={products} />
    </Suspense>
  );
}
