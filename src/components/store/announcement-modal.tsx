"use client";

import { useState, useEffect } from "react";
import { X, Megaphone, AlertTriangle, HeadphonesIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AnnouncementModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Tampilkan modal jika pengguna belum melihatnya di sesi ini
    const hasSeen = sessionStorage.getItem("hasSeenAnnouncement");
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenAnnouncement", "true");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[450px] overflow-hidden animate-in zoom-in-95 duration-300 relative">
        
        {/* Close Button Top Right */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors bg-slate-50 hover:bg-slate-100 rounded-full p-1"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-5 sm:p-7 flex flex-col items-center">
          {/* Icon Megaphone */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 rotate-[-10deg] shadow-inner border border-primary-100">
            <Megaphone className="h-7 w-7 sm:h-8 sm:w-8" />
          </div>
          
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-5 flex items-center gap-2">
            Info Penting! ✨
          </h2>

          <div className="space-y-2.5 w-full">
            {/* Red Warning Block */}
            <div className="bg-red-50/80 border border-red-100 rounded-xl p-3 sm:p-4 flex items-start gap-2.5 text-xs sm:text-sm">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-red-700">PENTING:</strong> Setelah menyelesaikan pemesanan, <strong>Anda WAJIB menyimpan (Copy) URL Invoice</strong> atau men-<em>screenshot</em> ID Pesanan Anda. URL Invoice tersebut adalah satu-satunya cara Anda untuk melacak pesanan dan mengambil detail akun yang Anda beli!
              </p>
            </div>

            {/* Blue Info Block */}
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 sm:p-4 flex items-start gap-2.5 text-xs sm:text-sm">
              <HeadphonesIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-blue-700">INFO LAYANAN:</strong> Transaksi berjalan normal 24 Jam. Untuk info ketersediaan stok terbaru, promo diskon, atau bantuan kendala pesanan, silakan bergabung ke Group WhatsApp resmi kami.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 w-full mt-5">
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="flex-1 rounded-xl h-10 sm:h-11 font-medium border-slate-200 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm"
            >
              Tutup
            </Button>
            <Button 
              asChild
              className="flex-1 rounded-xl h-10 sm:h-11 font-medium bg-[#25D366] hover:bg-[#1DA851] text-white shadow-lg shadow-[#25D366]/20 border-0 text-xs sm:text-sm"
            >
              <a href="https://chat.whatsapp.com/FN8OxtNm2CYF6eG887WWSH" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 sm:gap-2 justify-center">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                Join Grup WA
              </a>
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
