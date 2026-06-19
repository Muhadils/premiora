import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";
import { createClient } from "@supabase/supabase-js";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;

  let status = "pending_payment";

  if (order_id) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase
      .from("orders")
      .select("status")
      .eq("invoice_id", order_id)
      .single();

    if (data) {
      status = data.status;
    }
  }

  const isSuccess = status === "processing" || status === "completed";
  const isCanceled = status === "canceled";

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 min-h-[80vh]">
      <div className="w-full max-w-md mx-auto text-center">
        {isSuccess ? (
          <>
            <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 sm:h-12 sm:w-12 text-emerald-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Pembayaran Berhasil!</h1>
            <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
              Terima kasih, pembayaran kamu telah kami terima. Pesanan sedang diproses secara otomatis.
            </p>
          </>
        ) : isCanceled ? (
          <>
            <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-600" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Pembayaran Dibatalkan</h1>
            <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
              Transaksi ini telah dibatalkan atau kadaluarsa. Silakan buat pesanan baru.
            </p>
          </>
        ) : (
          <>
            <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-amber-100">
              <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-amber-600 animate-pulse" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Menunggu Pembayaran</h1>
            <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
              Sistem kami belum menerima konfirmasi pembayaran Anda. Silakan selesaikan pembayaran, atau klik tombol Lacak Pesanan untuk status terbaru.
            </p>
          </>
        )}

        {order_id && (
          <div className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500 mb-1">Invoice ID</p>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono font-bold text-slate-900">{order_id}</span>
              <CopyButton text={order_id} />
            </div>
          </div>
        )}

        <div className="space-y-3">
          <Button className="h-10 sm:h-14 w-full text-sm sm:text-base" asChild>
            <Link href={`/order?invoice=${order_id}`}>
              Lacak Pesanan
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="h-10 sm:h-14 w-full text-sm sm:text-base" asChild>
            <Link href="/">
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
