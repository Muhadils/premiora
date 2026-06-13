import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function WhatsAppButton() {
  return (
    <Link
      href={siteConfig.links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md sm:shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:bg-emerald-600 hover:shadow-lg sm:hover:shadow-xl hover:shadow-emerald-500/40 hover:scale-110 active:scale-95"
      aria-label="Hubungi via WhatsApp"
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
    </Link>
  );
}
