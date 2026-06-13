"use client";

import { Search, CreditCard, Zap, CheckCircle2 } from "lucide-react";
import { MotionSection, MotionStaggerItem } from "@/lib/motion";

const steps = [
  {
    step: 1,
    icon: <Search className="h-6 w-6" />,
    title: "Pilih Produk",
    description: "Cari dan pilih produk premium yang kamu butuhkan dari katalog kami.",
  },
  {
    step: 2,
    icon: <CreditCard className="h-6 w-6" />,
    title: "Checkout & Bayar",
    description: "Isi data diri, pilih metode pembayaran, dan selesaikan transaksi.",
  },
  {
    step: 3,
    icon: <Zap className="h-6 w-6" />,
    title: "Proses Otomatis",
    description: "Pesanan langsung diproses secara otomatis setelah pembayaran berhasil.",
  },
  {
    step: 4,
    icon: <CheckCircle2 className="h-6 w-6" />,
    title: "Produk Diterima",
    description: "Dapatkan akses akun premium kamu. Cek di halaman tracking order.",
  },
];

export function HowToOrder() {
  return (
    <section id="how-to-order" className="section">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            Cara Pemesanan
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            4 langkah mudah untuk mendapatkan akun premium kamu
          </p>
        </div>

        <MotionSection className="relative mx-auto max-w-4xl">
          {/* Timeline Line — desktop only */}
          <div className="absolute top-8 left-[calc(12.5%)] right-[calc(12.5%)] hidden h-0.5 bg-slate-200 lg:block" />

          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <MotionStaggerItem key={item.step}>
                <div className="relative flex flex-col items-center text-center">
                  {/* Step Circle */}
                  <div className="relative z-10 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-primary text-white shadow-md sm:shadow-lg shadow-primary-500/25">
                    <div className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                      {item.icon}
                    </div>
                  </div>
                  {/* Step Number */}
                  <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-bold text-primary-600">
                    STEP {item.step}
                  </div>
                  <h3 className="mt-1 sm:mt-2 text-sm sm:text-base font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed px-4 sm:px-0">
                    {item.description}
                  </p>
                </div>
              </MotionStaggerItem>
            ))}
          </div>
        </MotionSection>
      </div>
    </section>
  );
}
