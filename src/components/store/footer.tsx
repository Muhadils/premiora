import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { CATEGORIES } from "@/lib/utils/constants";
import { Mail, MapPin, Clock } from "lucide-react";

const footerLinks = {
  products: CATEGORIES.slice(0, 6).map((cat) => ({
    label: cat.name,
    href: `/products?category=${cat.slug}`,
  })),
  company: [
    { label: "Tentang Kami", href: "#" },
    { label: "Kebijakan Privasi", href: "#" },
    { label: "Syarat & Ketentuan", href: "#" },
    { label: "FAQ", href: "#faq" },
  ],
  support: [
    { label: "Lacak Order", href: "/order" },
    { label: "Cara Pemesanan", href: "#how-to-order" },
    { label: "Hubungi Kami", href: "#" },
    { label: "WhatsApp Support", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="container-custom py-8 sm:py-16">
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3 sm:space-y-4">
            <div className="scale-90 sm:scale-100 origin-left">
              <Logo textClassName="text-slate-900" />
            </div>
            <p className="text-[11px] sm:text-sm text-slate-500 leading-relaxed max-w-xs">
              Marketplace akun premium digital terpercaya. Proses instan,
              garansi resmi, dan harga terbaik.
            </p>
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-slate-500">
                <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                <span>premiora9@gmail.com</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-slate-500">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-sm text-slate-500">
                <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-400" />
                <span>Indonesia, Sulawesi Selatan, Makassar</span>
              </div>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-slate-900">
              Kategori
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[11px] sm:text-sm text-slate-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Perusahaan */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-slate-900">
              Perusahaan
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[11px] sm:text-sm text-slate-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-3 sm:mb-4 text-xs sm:text-sm font-semibold text-slate-900">
              Bantuan
            </h3>
            <ul className="space-y-2 sm:space-y-2.5">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-[11px] sm:text-sm text-slate-500 transition-colors hover:text-primary-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 sm:mt-12 flex flex-col items-center justify-between gap-3 sm:gap-4 border-t border-slate-200 pt-6 sm:pt-8 sm:flex-row">
          <p className="text-[10px] sm:text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Premiora. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[9px] sm:text-xs text-slate-400">Powered by</span>
            <span className="text-[10px] sm:text-xs font-semibold text-gradient">
              Premiora
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
