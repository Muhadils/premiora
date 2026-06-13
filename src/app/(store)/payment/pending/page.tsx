import Link from "next/link";
import { Clock, ChevronRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/shared/copy-button";

export default async function PaymentPendingPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 min-h-[80vh]">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="relative mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-amber-100">
          <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 border-t-amber-500 animate-spin"></div>
          <Clock className="h-8 w-8 sm:h-12 sm:w-12 text-amber-600 animate-pulse" />
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Menunggu Pembayaran</h1>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
          Silakan selesaikan pembayaran sesuai dengan metode yang kamu pilih.
        </p>

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
              Cek Status Pesanan
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
