import type { Metadata } from "next";
import { HeroSection } from "@/components/store/hero-section";
import { SearchBar } from "@/components/store/search-bar";
import { CategoryGrid } from "@/components/store/category-grid";
import { WhyChooseUs } from "@/components/store/why-choose-us";
import { HowToOrder } from "@/components/store/how-to-order";
import { FAQSection } from "@/components/store/faq-section";
import { createClient } from "@/lib/supabase/server";
import { ProductCard } from "@/components/store/product-card";
import { AnnouncementModal } from "@/components/store/announcement-modal";

import { PremkuService } from "@/lib/supplier/premku.service";

export const metadata: Metadata = {
  title: { absolute: "Premiora — Akun Premium Digital Instan & Terpercaya" },
  description:
    "Marketplace akun premium digital terpercaya. Dapatkan Canva Pro, ChatGPT Plus, Spotify Premium, Netflix, dan lainnya dengan harga terbaik dan proses instan.",
  openGraph: {
    title: "Premiora — Akun Premium Digital Instan & Terpercaya",
    description:
      "Marketplace akun premium digital terpercaya. Harga terbaik, proses instan, garansi penuh.",
    type: "website",
  },
};

export default async function HomePage() {
  const supabase = await createClient();
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*, categories(slug, name)")
    .order("created_at", { ascending: false })
    .limit(16);

  // Fetch live supplier stock
  let supplierProducts: any[] = [];
  try {
    const res = await PremkuService.getProducts();
    if (res.success && res.products) {
      supplierProducts = res.products;
    }
  } catch (error) {
    console.error("Failed to fetch supplier products for homepage", error);
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

  // Get category counts
  const { data: categoriesData } = await supabase
    .from("categories")
    .select("slug, products(id)");
    
  const categoryCounts: Record<string, number> = {};
  if (categoriesData) {
    categoriesData.forEach((cat: any) => {
      categoryCounts[cat.slug] = cat.products?.length || 0;
    });
  }

  return (
    <>
      <AnnouncementModal />
      <HeroSection />
      <SearchBar />
      <CategoryGrid counts={categoryCounts} />
      
      <section className="py-10 sm:py-16 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-8 sm:mb-10 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
              Katalog Produk
            </h2>
            <p className="mt-2 sm:mt-4 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto px-4 sm:px-0">
              Pilihan terbaik akun premium bergaransi untuk menunjang produktivitas dan hiburan Anda.
            </p>
          </div>
          
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-lg font-medium text-slate-700">Katalog masih kosong</p>
              <p className="mt-1">Silakan tambahkan produk melalui Dasbor Admin.</p>
            </div>
          )}
        </div>
      </section>

      <WhyChooseUs />
      <HowToOrder />
      <FAQSection />
    </>
  );
}
