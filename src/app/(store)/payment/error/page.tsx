import Link from "next/link";
import { XCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PaymentErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;

  return (
    <div className="pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 min-h-[80vh]">
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mx-auto mb-4 sm:mb-6 flex h-16 w-16 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-red-100">
          <XCircle className="h-8 w-8 sm:h-12 sm:w-12 text-red-600" />
        </div>
        
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Pembayaran Gagal</h1>
        <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">
          Maaf, terjadi kesalahan saat memproses pembayaran kamu. Waktu pembayaran mungkin telah habis atau transaksi dibatalkan.
        </p>

        <div className="space-y-3">
          <Button className="h-10 sm:h-14 w-full text-sm sm:text-base" asChild>
            <Link href={`/`}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Coba Pesan Ulang
            </Link>
          </Button>
          <Button variant="outline" className="h-10 sm:h-14 w-full text-sm sm:text-base" asChild>
            <Link href={`${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}` : "#"}`} target="_blank">
              Hubungi Bantuan
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
