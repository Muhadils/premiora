import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailClient } from "./product-detail-client";
import { PremkuService } from "@/lib/supplier/premku.service";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, short_description, description")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: product.name,
    description: product.short_description || product.description || "",
    openGraph: {
      title: product.name,
      description: product.short_description || "",
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();

  if (!product) {
    notFound();
  }

  // Fetch similar products
  const { data: similarProducts } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("category_id", product.category_id)
    .neq("id", product.id)
    .eq("is_active", true)
    .limit(4);

  // Fetch live supplier stock
  let supplierProducts: any[] = [];
  try {
    const res = await PremkuService.getProducts();
    if (res.success && res.products) {
      supplierProducts = res.products;
    }
  } catch (error) {
    console.error("Failed to fetch supplier products", error);
  }

  // Inject stock for main product
  let finalProduct = { ...product };
  if (finalProduct.supplier_product_code) {
    const supplierData = supplierProducts.find(sp => String(sp.id) === finalProduct.supplier_product_code);
    if (supplierData) {
      finalProduct.stock = Number(supplierData.stock);
    }
  }

  // Inject stock for similar products
  const finalSimilarProducts = (similarProducts || []).map((prod) => {
    const formattedProd = { ...prod, category: prod.categories || prod.category };
    if (formattedProd.supplier_product_code) {
      const supplierData = supplierProducts.find(sp => String(sp.id) === formattedProd.supplier_product_code);
      if (supplierData) {
        return { ...formattedProd, stock: Number(supplierData.stock) };
      }
    }
    return formattedProd;
  });

  return <ProductDetailClient product={finalProduct} similarProducts={finalSimilarProducts} />;
}
