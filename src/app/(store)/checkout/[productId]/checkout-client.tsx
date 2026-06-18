"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, CreditCard, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkoutSchema, type CheckoutInput } from "@/lib/validators/checkout.schema";
import { createOrder } from "@/lib/actions/order.actions";
import { formatRupiah } from "@/lib/utils/format";
import type { Product } from "@/types";

interface Props {
  product: Product;
}



export function CheckoutClient({ product }: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();


  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      product_id: product.id,
      dynamic_fields: {},
    },
  });

  const onSubmit = async (data: CheckoutInput) => {
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const result = await createOrder(data);

      if (!result.success || !result.redirectUrl) {
        throw new Error(result.error || "Gagal membuat transaksi");
      }

      // Redirect to Duitku payment page
      window.location.href = result.redirectUrl;
    } catch (err: any) {
      setErrorMsg(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  };

  return (
    <>


      <div className="pt-24 sm:pt-28 lg:pt-32 min-h-[90vh] bg-slate-50">
        <div className="container-custom section">
          <div className="mx-auto max-w-4xl">
            {/* Header */}
            <div className="mb-6 sm:mb-8 flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-3xl font-bold text-slate-900">Checkout</h1>
                <p className="text-xs sm:text-base text-slate-500">Selesaikan pesanan kamu</p>
              </div>
              <Button variant="ghost" className="h-8 sm:h-10 px-2 sm:px-4 text-xs sm:text-sm text-slate-500" onClick={() => router.back()}>
                <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Kembali
              </Button>
            </div>

            <div className="grid gap-8 lg:grid-cols-12">
              {/* Form Section */}
              <div className="lg:col-span-7">
                <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {errorMsg && (
                    <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                    <div className="mb-4">
                      <h2 className="text-base sm:text-lg font-semibold text-slate-900">1. Data Pembeli</h2>
                      <div className="mt-2 flex items-start gap-2 rounded-lg bg-indigo-50 p-2.5 sm:p-3 text-[11px] sm:text-sm text-indigo-700 border border-indigo-100">
                        <Shield className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
                        <p>
                          Mohon isi semua data dengan benar. Data ini diperlukan untuk proses pembayaran di Payment Gateway dan memudahkan admin kami dalam melacak serta mengirimkan pesanan Anda.
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="space-y-1.5">
                          <label htmlFor="name" className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">Nama Lengkap / Panggilan <span className="text-red-500">*</span></label>
                          <Input
                            id="name"
                            placeholder="Masukkan nama kamu"
                            {...register("name")}
                            className={`h-10 sm:h-12 text-sm sm:text-base ${errors.name ? "border-red-500 focus:ring-red-500/20" : ""}`}
                          />
                        </div>
                        {errors.name && (
                          <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                          Nomor WhatsApp *
                        </label>
                        <Input
                          placeholder="081234567890"
                          type="tel"
                          {...register("whatsapp")}
                          className={`h-10 sm:h-12 text-sm sm:text-base ${errors.whatsapp ? "border-red-500 focus:ring-red-500/20" : ""}`}
                        />
                        <p className="mt-1 text-xs text-slate-500">
                          Pastikan nomor aktif untuk pengiriman notifikasi order
                        </p>
                        {errors.whatsapp && (
                          <p className="mt-1 text-xs text-red-500">{errors.whatsapp.message}</p>
                        )}
                      </div>

                      <div>
                        <div className="space-y-1.5">
                          <label htmlFor="email" className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">Email <span className="text-red-500">*</span></label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="email@example.com"
                            {...register("email")}
                            className={`h-10 sm:h-12 text-sm sm:text-base ${errors.email ? "border-red-500 focus:ring-red-500/20" : ""}`}
                          />
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Fields (if any) */}
                  {product.dynamic_fields && product.dynamic_fields.length > 0 && (
                    <div className="rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                      <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-900">2. Data Akun</h2>
                      <div className="space-y-4">
                        {product.dynamic_fields.map((field) => (
                          <div key={field.name}>
                            <label className="mb-1 block text-xs sm:text-sm font-medium text-slate-700">
                              {field.label} {field.required && "*"}
                            </label>
                            <Input
                              type={field.type}
                              placeholder={field.placeholder || ""}
                              className="h-10 sm:h-12 text-sm sm:text-base"
                              {...register(`dynamic_fields.${field.name}` as any, {
                                required: field.required ? `${field.label} wajib diisi` : false,
                              })}
                            />
                            {/* We can access nested errors conditionally but since dynamic fields vary, 
                                we might need to cast errors for display or rely on HTML5 validation for simplicity here */}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-5">
                <div className="sticky top-20 sm:top-28 rounded-xl sm:rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
                  <h2 className="mb-4 text-base sm:text-lg font-semibold text-slate-900">Ringkasan Order</h2>
                  
                  <div className="flex gap-3 sm:gap-4 border-b border-slate-100 pb-3 sm:pb-4">
                    <div className="relative h-12 w-12 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {product.thumbnail_url && (
                        <Image
                          src={product.thumbnail_url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-medium text-slate-900 line-clamp-2">{product.name}</h3>
                      <p className="mt-0.5 sm:mt-1 text-[10px] sm:text-xs text-slate-500">{product.warranty_duration}</p>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 space-y-2 sm:space-y-3 border-b border-slate-100 pb-3 sm:pb-4">
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="font-medium text-slate-900">{formatRupiah(product.selling_price)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="text-slate-500">Biaya Layanan</span>
                      <span className="font-medium text-emerald-600">Gratis</span>
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 flex items-center justify-between">
                    <span className="text-sm sm:text-base font-bold text-slate-900">Total Pembayaran</span>
                    <span className="text-lg sm:text-xl font-bold text-primary-600">{formatRupiah(product.selling_price)}</span>
                  </div>

                  <div className="mt-5 sm:mt-6">
                    <Button 
                      type="submit" 
                      form="checkout-form" 
                      className="h-11 sm:h-14 w-full text-sm sm:text-base font-bold rounded-xl"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-5 w-5" />
                          Bayar Sekarang
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>Pembayaran aman & terenkripsi oleh Duitku</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
