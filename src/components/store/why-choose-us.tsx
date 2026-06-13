"use client";

import { Zap, Shield, Clock, Headphones } from "lucide-react";
import { MotionSection, MotionStaggerItem } from "@/lib/motion";

const features = [
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Proses Instan",
    description:
      "Pesanan diproses otomatis dalam 1-5 menit setelah pembayaran dikonfirmasi. Tanpa perlu menunggu lama.",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Garansi Resmi",
    description:
      "Setiap produk dilengkapi garansi penuh. Jika terjadi masalah, kami ganti tanpa biaya tambahan.",
    color: "from-emerald-400 to-green-500",
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Harga Terbaik",
    description:
      "Kami menawarkan harga paling kompetitif di pasar. Bandingkan sendiri dan buktikan.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    icon: <Headphones className="h-6 w-6" />,
    title: "Support 24/7",
    description:
      "Tim support kami siap membantu kapan saja melalui WhatsApp. Fast response dijamin.",
    color: "from-violet-400 to-purple-500",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section bg-slate-50">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            Mengapa Memilih Kami?
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Kami berkomitmen memberikan layanan terbaik untuk setiap pelanggan
          </p>
        </div>

        <MotionSection className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
          {features.map((feature, i) => (
            <MotionStaggerItem key={i}>
              <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 text-center transition-all duration-300 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1">
                <div
                  className={`mx-auto flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-md sm:shadow-lg transition-transform duration-300 group-hover:scale-110`}
                >
                  <div className="[&>svg]:w-5 [&>svg]:h-5 sm:[&>svg]:w-6 sm:[&>svg]:h-6">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="mt-3 sm:mt-4 text-xs sm:text-base font-semibold text-slate-900">
                  {feature.title}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-sm text-slate-500 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {feature.description}
                </p>
              </div>
            </MotionStaggerItem>
          ))}
        </MotionSection>
      </div>
    </section>
  );
}
