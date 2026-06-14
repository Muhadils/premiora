import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProductDetailClient } from "./product-detail-client";

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

  return <ProductDetailClient product={product} similarProducts={similarProducts || []} />;
}
