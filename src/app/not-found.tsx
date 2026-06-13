import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-8xl font-bold text-gradient">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">
          Halaman Tidak Ditemukan
        </h2>
        <p className="mt-3 text-slate-500 max-w-md mx-auto">
          Maaf, halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4" />
              Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
