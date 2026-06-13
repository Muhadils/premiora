"use client";

import Link from "next/link";
import {
  Brain,
  Palette,
  Play,
  Music,
  Briefcase,
  GraduationCap,
  Shield,
  Share2,
} from "lucide-react";
import { MotionSection, MotionStaggerItem } from "@/lib/motion";

const iconMap: Record<string, React.ReactNode> = {
  Brain: <Brain className="h-5 w-5 sm:h-6 sm:w-6" />,
  Palette: <Palette className="h-5 w-5 sm:h-6 sm:w-6" />,
  Play: <Play className="h-5 w-5 sm:h-6 sm:w-6" />,
  Music: <Music className="h-5 w-5 sm:h-6 sm:w-6" />,
  Briefcase: <Briefcase className="h-5 w-5 sm:h-6 sm:w-6" />,
  GraduationCap: <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />,
  Shield: <Shield className="h-5 w-5 sm:h-6 sm:w-6" />,
  Share2: <Share2 className="h-5 w-5 sm:h-6 sm:w-6" />,
};

const categories = [
  { name: "AI", slug: "ai", icon: "Brain", color: "from-violet-500 to-purple-600", count: 5 },
  { name: "Design", slug: "design", icon: "Palette", color: "from-pink-500 to-rose-600", count: 4 },
  { name: "Streaming", slug: "streaming", icon: "Play", color: "from-red-500 to-orange-600", count: 3 },
  { name: "Music", slug: "music", icon: "Music", color: "from-emerald-500 to-green-600", count: 2 },
  { name: "Productivity", slug: "productivity", icon: "Briefcase", color: "from-blue-500 to-indigo-600", count: 4 },
  { name: "Education", slug: "education", icon: "GraduationCap", color: "from-amber-500 to-orange-600", count: 3 },
  { name: "VPN", slug: "vpn", icon: "Shield", color: "from-cyan-500 to-teal-600", count: 2 },
  { name: "Social Media", slug: "social-media", icon: "Share2", color: "from-fuchsia-500 to-pink-600", count: 2 },
];

export function CategoryGrid({ counts }: { counts?: Record<string, number> }) {
  return (
    <section className="section">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-4xl">
            Kategori Produk
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 max-w-lg mx-auto">
            Temukan akun premium yang kamu butuhkan dari berbagai kategori
          </p>
        </div>

        <MotionSection className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
          {categories.map((cat) => {
            const productCount = counts?.[cat.slug] || 0;
            return (
              <MotionStaggerItem key={cat.slug}>
                <Link
                  href={`/products?category=${cat.slug}`}
                  className="group relative flex flex-col items-center gap-2 sm:gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 text-center transition-all duration-300 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-500/5 hover:-translate-y-1"
                >
                  <div
                    className={`flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${cat.color} text-white shadow-md sm:shadow-lg transition-transform duration-300 group-hover:scale-110`}
                  >
                    {iconMap[cat.icon]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {productCount > 0 ? `${productCount} Produk` : "Jelajahi"}
                    </p>
                  </div>
                </Link>
              </MotionStaggerItem>
            );
          })}
        </MotionSection>
      </div>
    </section>
  );
}
