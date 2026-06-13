import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CheckoutClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Premiora",
  description: "Selesaikan pembelian produk premium digital Anda",
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("id", productId)
    .single();

  if (!product) {
    notFound();
  }

  return <CheckoutClient product={product} />;
}
