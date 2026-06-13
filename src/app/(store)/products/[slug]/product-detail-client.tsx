"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Shield,
  Star,
  ShoppingCart,
  CheckCircle2,
  ChevronRight,
  MessageCircle,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ProductCard } from "@/components/store/product-card";
import { formatRupiah } from "@/lib/utils/format";
import { siteConfig } from "@/config/site";
import type { Product } from "@/types";

interface Props {
  product: any;
  similarProducts: any[];
}

const tabs = [
  { id: "description", label: "Deskripsi" },
  { id: "benefits", label: "Benefit" },
  { id: "activation", label: "Cara Aktivasi" },
  { id: "faq", label: "FAQ" },
  { id: "reviews", label: "Review" },
];

export function ProductDetailClient({ product, similarProducts }: Props) {
  const [activeTab, setActiveTab] = useState("description");
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  let cleanDescription = product.description || "";
  let termsText = "";
  let termsLink = ""; // for backward compatibility if ever needed

  if (cleanDescription.includes("||SNK_TEXT:")) {
    const parts = cleanDescription.split("||SNK_TEXT:");
    cleanDescription = parts[0];
    termsText = parts[1]?.trim();
  } else if (cleanDescription.includes("||SNK:")) {
    const parts = cleanDescription.split("||SNK:");
    cleanDescription = parts[0];
    termsLink = parts[1]?.trim();
  }

  let cleanShortDescription = product.short_description || "";
  if (cleanShortDescription.includes("||SNK_TEXT:")) {
    cleanShortDescription = cleanShortDescription.split("||SNK_TEXT:")[0];
  } else if (cleanShortDescription.includes("||SNK:")) {
    cleanShortDescription = cleanShortDescription.split("||SNK:")[0];
  }

  return (
    <div className="pt-16 sm:pt-20 lg:pt-24 pb-24 sm:pb-0">
      <div className="container-custom section">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-sm text-slate-500 mb-6 sm:mb-8">
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Beranda
          </Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/products" className="hover:text-primary-600 transition-colors">
            Produk
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Hero */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Thumbnail */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative w-36 h-36 sm:w-full sm:h-auto sm:aspect-square mx-auto overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
          >
            {product.thumbnail_url ? (
              <Image
                src={product.thumbnail_url}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary-50 via-violet-50 to-purple-100">
                <div className="text-center">
                  <ShoppingCart className="mx-auto h-20 w-20 text-primary-300" />
                  <p className="mt-4 text-lg font-semibold text-primary-400">
                    {product.name}
                  </p>
                </div>
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.is_best_seller && (
                <Badge className="bg-amber-500 text-white border-0">🔥 Best Seller</Badge>
              )}
              {product.is_featured && (
                <Badge className="bg-primary-600 text-white border-0">⭐ Unggulan</Badge>
              )}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Category */}
            {product.category && (
              <Badge variant="secondary" className="w-fit mb-3">
                {product.category.name}
              </Badge>
            )}

            <h1 className="text-lg font-bold text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            {product.rating_avg > 0 && (
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating_avg)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs sm:text-sm text-slate-600">
                  {product.rating_avg.toFixed(1)} ({product.rating_count} review)
                </span>
                <span className="text-xs sm:text-sm text-slate-400">•</span>
                <span className="text-xs sm:text-sm text-slate-500">
                  {product.sold_count} terjual
                </span>
              </div>
            )}

            {/* Short Description */}
            {cleanShortDescription && (
              <p className="mt-3 sm:mt-4 text-xs sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {cleanShortDescription}
              </p>
            )}

            {/* Terms Alert */}
            {(termsText || termsLink) && (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm text-amber-800 font-medium">
                  Wajib baca{" "}
                  {termsText ? (
                    <button 
                      onClick={() => setIsTermsOpen(true)}
                      className="text-blue-600 font-bold underline hover:text-blue-700 transition-colors cursor-pointer"
                    >
                      Syarat & Ketentuan
                    </button>
                  ) : (
                    <a href={termsLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline hover:text-blue-700 transition-colors">Syarat & Ketentuan</a>
                  )}
                  {" "}sebelum order.
                </p>
              </div>
            )}

            {/* Price */}
            <div className="mt-4 sm:mt-6 rounded-xl border border-primary-100 bg-primary-50/50 p-3 sm:p-4">
              <span className="text-xl sm:text-3xl font-bold text-primary-600">
                {formatRupiah(product.selling_price)}
              </span>
            </div>

            {/* Meta Info */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-2 sm:gap-3">
              <div className="flex items-center gap-2 sm:gap-3 rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500">Estimasi Proses</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    {product.estimated_process}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 rounded-lg border border-slate-200 bg-white p-2.5 sm:p-3">
                <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-500" />
                <div>
                  <p className="text-[10px] sm:text-xs text-slate-500">Garansi</p>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900">
                    {product.warranty_duration}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-5 sm:mt-8 flex flex-col gap-2.5 sm:gap-3 sm:flex-row">
              <Button className="h-10 sm:h-14 flex-1 text-sm sm:text-base font-bold" asChild>
                <Link href={`/checkout/${product.id}`}>
                  <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Beli Sekarang
                </Link>
              </Button>
              <Button variant="outline" className="h-10 sm:h-14 flex-1 text-sm sm:text-base font-bold" asChild>
                <Link
                  href={`${siteConfig.links.whatsapp}?text=${encodeURIComponent(`Halo, saya tertarik dengan ${product.name}`)}`}
                  target="_blank"
                >
                  <MessageCircle className="h-5 w-5" />
                  Tanya Admin
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex gap-1 overflow-x-auto border-b border-slate-200 pb-px scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative whitespace-nowrap px-5 py-3 text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "text-primary-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {/* Description Tab */}
            {activeTab === "description" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="prose prose-slate max-w-none"
              >
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {cleanDescription}
                </p>
              </motion.div>
            )}

            {/* Benefits Tab */}
            {activeTab === "benefits" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                {product.benefits?.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span className="text-slate-600">{benefit}</span>
                  </div>
                )) || (
                  <p className="text-slate-500">Belum ada informasi benefit.</p>
                )}
              </motion.div>
            )}

            {/* Activation Guide Tab */}
            {activeTab === "activation" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-slate-200 bg-slate-50 p-6"
              >
                <h3 className="text-lg font-semibold text-slate-900 mb-4">
                  Panduan Aktivasi
                </h3>
                <p className="text-slate-600 whitespace-pre-line leading-relaxed">
                  {product.activation_guide || "Panduan aktivasi akan diberikan setelah pembelian."}
                </p>
              </motion.div>
            )}

            {/* FAQ Tab */}
            {activeTab === "faq" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {product.faq && product.faq.length > 0 ? (
                  <Accordion type="single" collapsible className="space-y-2">
                    {product.faq.map((item, i) => (
                      <AccordionItem
                        key={i}
                        value={`faq-${i}`}
                        className="rounded-xl border border-slate-200 bg-white px-6"
                      >
                        <AccordionTrigger className="text-left hover:no-underline">
                          {item.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-600">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <p className="text-slate-500">Belum ada FAQ untuk produk ini.</p>
                )}
              </motion.div>
            )}

            {/* Reviews Tab */}
            {activeTab === "reviews" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <Star className="mx-auto h-12 w-12 text-slate-200" />
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  Belum Ada Review
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Review akan tampil di sini setelah pelanggan memberikan ulasan
                </p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16 sm:mt-20">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 sm:mb-8">
              Produk Serupa
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>



      {/* Terms & Conditions Modal */}
      {isTermsOpen && termsText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Syarat & Ketentuan</h2>
              <button 
                onClick={() => setIsTermsOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {termsText}
                </p>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <Button onClick={() => setIsTermsOpen(false)}>
                Saya Mengerti
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
