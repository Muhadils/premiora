import { createClient } from "@/lib/supabase/server";
import { OrderSearch } from "@/components/store/order-search";
import { PackageSearch, Clock, CircleCheck, AlertCircle, Copy, ArrowRight, RefreshCcw, LoaderCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/utils/format";
import Link from "next/link";
import { orderStatuses } from "@/lib/utils/constants";

export const metadata = {
  title: "Lacak Pesanan | Premiora",
  description: "Lacak status pesanan akun premium Anda dan dapatkan detail akses login.",
};

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;

  // Jika tidak ada parameter invoice, tampilkan form pencarian kosong
  if (!invoice) {
    return (
      <div className="container px-4 sm:px-6 py-16 md:py-24 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary-100">
            <PackageSearch className="h-8 w-8 sm:h-10 sm:w-10 text-primary-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Lacak Pesanan</h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
            Masukkan Nomor Invoice Anda untuk melihat status pesanan dan mendapatkan akun premium yang telah dibeli.
          </p>
        </div>
        
        <OrderSearch />
      </div>
    );
  }

  // Jika ada invoice, fetch data dari Supabase
  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      *,
      order_items (*),
      payments (*)
    `)
    .eq("invoice_id", invoice)
    .single();

  if (error || !order) {
    return (
      <div className="container px-4 sm:px-6 py-16 md:py-24 min-h-[70vh] flex flex-col items-center justify-center">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 sm:mb-3">Pesanan Tidak Ditemukan</h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
            Kami tidak dapat menemukan pesanan dengan invoice <strong>{invoice}</strong>. Pastikan invoice yang Anda masukkan sudah benar.
          </p>
        </div>
        
        <OrderSearch initialValue={invoice} />
      </div>
    );
  }

  // Pesanan Ditemukan
  const statusDef = orderStatuses.find(s => s.id === order.status) || orderStatuses[0];
  const StatusIcon = statusDef.icon;

  return (
    <div className="container px-5 sm:px-8 pt-24 pb-8 sm:pt-32 sm:pb-12 md:py-24 max-w-5xl min-h-[80vh]">
      <div className="mb-6 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 border-b border-slate-200/70 pb-5 sm:pb-8 relative">
        {/* Decorative ambient light */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        
        <div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-slate-900 mb-2 sm:mb-3 tracking-tight">Detail Pesanan</h1>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="font-mono font-medium text-[10px] sm:text-sm bg-blue-50 text-blue-700 border border-blue-200/50 px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-lg shadow-sm">{order.invoice_id}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-start sm:items-end gap-2">
          <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold shadow-sm ${statusDef.color} border-opacity-50`}>
            <StatusIcon className="h-3 w-3 sm:h-4 sm:w-4" />
            {statusDef.label}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8 xl:gap-12">
        {/* Kolom Kiri: Detail Produk & Kredensial */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Box Kredensial jika Completed */}
          {order.status === "completed" && (
            <div className="relative overflow-hidden rounded-3xl border border-emerald-300/60 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm group">
              {/* Confetti / Glow effect ambient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl -z-10 group-hover:bg-emerald-400/20 transition-colors duration-700 pointer-events-none"></div>
              
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 sm:px-8 py-5 text-white flex items-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 w-full h-full transform -skew-x-12 -translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm shrink-0 border border-white/20 shadow-inner">
                  <CircleCheck className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg tracking-tight">Pesanan Berhasil Diselesaikan!</h3>
                  <p className="text-emerald-50 text-sm font-medium">Berikut adalah detail akun premium Anda yang siap digunakan.</p>
                </div>
              </div>
              
              <div className="p-6 sm:p-8 space-y-8">
                {order.order_items.map((item: any) => (
                  <div key={item.id} className="space-y-4">
                    <h4 className="font-bold text-slate-900 text-lg border-b border-emerald-200/60 pb-3 flex items-center gap-2">
                      <span className="h-6 w-1.5 rounded-full bg-emerald-500"></span>
                      {item.product_name}
                    </h4>
                    
                    {item.credentials && item.credentials.length > 0 ? (
                      <div className="space-y-4">
                        {item.credentials.map((cred: any, idx: number) => (
                          <div key={idx} className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4 relative group/cred">
                            <div className="absolute left-0 top-0 h-full w-1 bg-emerald-400 opacity-0 group-hover/cred:opacity-100 transition-opacity rounded-l-2xl"></div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                              <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                <span className="bg-emerald-100 text-emerald-700 p-1 rounded-md">👤</span>
                                Email / Username
                              </span>
                              <span className="font-mono font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 select-all">{cred.username || cred.email || "-"}</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pt-4 border-t border-dashed border-slate-200/80">
                              <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                                <span className="bg-emerald-100 text-emerald-700 p-1 rounded-md">🔑</span>
                                Password
                              </span>
                              <span className="font-mono font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60 select-all">{cred.password || "-"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/60 p-4 rounded-xl border border-dashed border-emerald-200">
                        <p className="text-sm text-slate-600 font-medium">Detail akun sedang disinkronkan atau terdapat instruksi khusus (cek email).</p>
                      </div>
                    )}
                  </div>
                ))}
                
                <div className="bg-white rounded-2xl p-5 border border-emerald-200/60 shadow-sm flex gap-3 items-start">
                  <AlertCircle className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-emerald-800 leading-relaxed">
                    <strong>Penting:</strong> Segera amankan akun ini dan jangan membagikan password kepada siapapun. Garansi berlaku sesuai deskripsi produk yang tertera.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Box Peringatan jika Pending */}
          {order.status === "pending_payment" && (
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border border-amber-300/60 bg-gradient-to-br from-amber-50 to-orange-50/40 p-3 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-6 shadow-sm group">
              <div className="absolute inset-0 bg-amber-400/5 animate-pulse pointer-events-none"></div>
              
              {/* Sweeping Loading Animation Background */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none"></div>

              <div className="flex items-start gap-2.5 sm:gap-3 relative z-10">
                <div className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-amber-100/80 flex items-center justify-center shrink-0 border border-amber-200/50 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 border-2 border-amber-400 border-t-transparent animate-spin opacity-30 rounded-lg sm:rounded-xl"></div>
                  <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-amber-600 animate-pulse" />
                </div>
                <div className="pt-0 sm:pt-0.5">
                  <h3 className="text-sm sm:text-lg font-bold text-amber-950 mb-0.5 sm:mb-1 flex items-center gap-1.5 sm:gap-2">
                    Menunggu Pembayaran
                    <LoaderCircle className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-500 animate-spin" />
                  </h3>
                  <p className="text-[10px] sm:text-sm text-amber-700/90 leading-relaxed max-w-sm">Selesaikan pembayaran agar pesanan diproses otomatis.</p>
                </div>
              </div>
              
              <Button asChild className="shrink-0 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02] border-0 font-semibold h-9 sm:h-11 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg w-full sm:w-auto relative z-10 text-xs sm:text-base">
                <Link href={order.payments?.[0]?.raw_response?.payment_url || `/payment/pending?order_id=${order.invoice_id}`}>
                  Lanjutkan Pembayaran
                </Link>
              </Button>
            </div>
          )}

          {/* Box Peringatan jika Processing */}
          {order.status === "processing" && (
            <div className="relative overflow-hidden rounded-2xl border border-blue-300/60 bg-gradient-to-br from-blue-50 to-indigo-50/40 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-sm group">
              <div className="absolute inset-0 bg-blue-400/5 animate-pulse pointer-events-none"></div>
              
              {/* Sweeping Loading Animation */}
              <div className="absolute inset-0 animate-shimmer pointer-events-none opacity-70"></div>
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-100/80 flex items-center justify-center shrink-0 border border-blue-200/50 shadow-inner relative overflow-hidden">
                  <div className="absolute inset-0 border-2 border-blue-400 border-t-transparent animate-spin opacity-40 rounded-xl"></div>
                  <LoaderCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 animate-spin" />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-base sm:text-lg font-bold text-blue-950 mb-1 flex items-center gap-2">
                    Pesanan Diproses
                    <span className="flex gap-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-700/90 leading-relaxed max-w-sm">Sistem sedang memproses akun/lisensi Anda. Mohon tunggu sebentar.</p>
                </div>
              </div>
              
              <Button variant="outline" className="shrink-0 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 shadow-sm transition-all duration-300 hover:shadow hover:-translate-y-0.5 font-semibold px-5 py-2.5 sm:py-3 rounded-lg w-full sm:w-auto relative z-10 group-hover:border-blue-300 text-sm sm:text-base" asChild>
                <Link href={`/order?invoice=${order.invoice_id}`}>
                  <RefreshCcw className="mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                  Refresh Status
                </Link>
              </Button>
            </div>
          )}

          {/* Box Peringatan jika Cancelled / Expired */}
          {order.status === "cancelled" && (
            <div className="relative overflow-hidden rounded-2xl border border-red-200/70 bg-gradient-to-br from-red-50 to-rose-50/40 p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 shadow-sm group hover:shadow-md transition-all duration-300">
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-400/10 rounded-full blur-3xl -z-10 group-hover:bg-red-400/20 transition-colors duration-500 pointer-events-none"></div>
              
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-red-100/80 flex items-center justify-center shrink-0 border border-red-200/50 shadow-inner">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div className="pt-0.5">
                  <h3 className="text-base sm:text-lg font-bold text-red-950 mb-1">Pesanan Dibatalkan</h3>
                  <p className="text-xs sm:text-sm text-red-700/90 leading-relaxed max-w-sm">Waktu pembayaran habis atau dibatalkan sistem. Silakan buat pesanan baru.</p>
                </div>
              </div>
              
              <Button asChild className="shrink-0 bg-white hover:bg-red-50 text-red-700 border border-red-200 shadow-sm transition-all duration-300 hover:shadow hover:-translate-y-0.5 font-semibold px-5 py-2.5 sm:py-3 rounded-lg w-full sm:w-auto relative z-10 group-hover:border-red-300 text-sm sm:text-base">
                <Link href="/">
                  Buat Pesanan Baru
                </Link>
              </Button>
            </div>
          )}

          {/* Item List */}
          <div className="bg-white rounded-xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="bg-slate-50/80 px-4 sm:px-8 py-3 sm:py-5 border-b border-slate-200/80 flex items-center gap-2 sm:gap-3">
              <PackageSearch className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400" />
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Rincian Produk</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {order.order_items.map((item: any) => (
                <div key={item.id} className="p-4 sm:p-8 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm sm:text-lg group-hover:text-blue-600 transition-colors">{item.product_name}</h4>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1 sm:mt-1.5 flex items-center gap-1.5">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded-md">Qty: {item.quantity}</span>
                    </p>
                  </div>
                  <div className="text-right font-bold text-slate-900 text-base sm:text-lg">
                    {formatRupiah(item.subtotal)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Summary */}
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-xl sm:rounded-3xl border border-slate-200/80 p-4 sm:p-8 shadow-sm">
            <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
              Ringkasan Pembayaran
            </h3>
            <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal Produk</span>
                <span className="text-slate-900">{formatRupiah(order.subtotal)}</span>
              </div>
              <div className="pt-4 sm:pt-5 border-t border-dashed border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-900">Total Tagihan</span>
                <span className="font-extrabold text-blue-600 text-base sm:text-xl tracking-tight">{formatRupiah(order.total)}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-b from-slate-50 to-slate-100/50 rounded-3xl p-6 sm:p-8 border border-slate-200/80 text-center shadow-sm">
            <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
              <span className="text-xl">💬</span>
            </div>
            <h4 className="font-bold text-slate-900 mb-2">Butuh Bantuan?</h4>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">Jangan ragu menghubungi tim support kami jika Anda mengalami kendala.</p>
            <Button variant="outline" className="w-full bg-white hover:bg-slate-50 border-slate-200 shadow-sm text-slate-700 font-semibold rounded-xl h-12" asChild>
              <Link href={`${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` : "#"}`} target="_blank">
                Hubungi Support Kami
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
