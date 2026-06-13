"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const floatingIcons = [
  { icon: "🎨", label: "Canva", x: "10%", y: "20%", delay: 0 },
  { icon: "🤖", label: "ChatGPT", x: "85%", y: "15%", delay: 0.5 },
  { icon: "🎵", label: "Spotify", x: "5%", y: "70%", delay: 1 },
  { icon: "🎬", label: "Netflix", x: "90%", y: "65%", delay: 1.5 },
  { icon: "💎", label: "Premium", x: "75%", y: "85%", delay: 2 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-hero">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary-600/20 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-violet-500/15 blur-[120px]" />

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden">
        {floatingIcons.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-3xl opacity-15 sm:opacity-20"
            style={{ left: item.x, top: item.y }}
            animate={{ y: [0, -15, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: item.delay,
              ease: "easeInOut",
            }}
          >
            {item.icon}
          </motion.div>
        ))}
      </div>

      <div className="container-custom relative z-10 pt-12 sm:pt-20 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center px-4 sm:px-0">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-white/80 backdrop-blur-sm">
              <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" />
              <span>Proses instan • Garansi resmi</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Akun Premium Digital
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Instan & Terpercaya
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-4 sm:mt-6 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-lg"
          >
            Dapatkan akses ke Canva Pro, ChatGPT Plus, Spotify Premium, Netflix,
            dan 50+ layanan premium lainnya. Harga terbaik, proses otomatis,
            garansi penuh.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col items-center gap-3 sm:gap-4 sm:flex-row sm:justify-center"
          >
            <Button size="xl" asChild>
              <Link href="/products">
                Jelajahi Produk
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link href="/order">Lacak Order</Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-10"
          >
            {[
              { icon: <Zap className="h-4 w-4 text-amber-400" />, label: "Proses 1-5 Menit" },
              { icon: <Shield className="h-4 w-4 text-emerald-400" />, label: "Garansi Resmi" },
              { icon: <Star className="h-4 w-4 text-yellow-400" />, label: "4.9/5 Rating" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-white font-medium bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-white/10 backdrop-blur-md shadow-sm"
              >
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
