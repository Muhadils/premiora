"use client";

import { MotionDiv } from "@/lib/motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Apakah akun premium ini legal dan aman?",
    answer:
      "Ya, semua akun premium yang kami jual adalah resmi dan legal. Kami menggunakan metode upgrade yang disetujui oleh masing-masing platform.",
  },
  {
    question: "Berapa lama proses aktivasi?",
    answer:
      "Proses aktivasi umumnya 1-5 menit setelah pembayaran dikonfirmasi. Untuk beberapa produk tertentu, bisa memakan waktu hingga 15 menit.",
  },
  {
    question: "Apakah ada garansi?",
    answer:
      "Ya, setiap produk dilengkapi garansi sesuai durasi yang tertera. Jika terjadi masalah selama masa garansi, kami akan memberikan pengganti gratis.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menerima pembayaran melalui QRIS, E-Wallet (GoPay, ShopeePay, Dana), dan Virtual Account (BCA, BNI, BRI, Mandiri).",
  },
  {
    question: "Bagaimana cara melacak pesanan saya?",
    answer:
      'Kamu bisa melacak pesanan melalui halaman "Lacak Order" dengan memasukkan Invoice ID dan nomor WhatsApp yang digunakan saat pemesanan.',
  },
  {
    question: "Apakah saya perlu membuat akun?",
    answer:
      "Tidak perlu! Kamu bisa langsung checkout tanpa perlu membuat akun. Cukup masukkan nama, email, dan nomor WhatsApp.",
  },
  {
    question: "Bagaimana jika produk tidak sesuai?",
    answer:
      "Hubungi tim support kami melalui WhatsApp. Kami akan membantu menyelesaikan masalah atau memberikan refund sesuai kebijakan kami.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="section bg-slate-50">
      <div className="container-custom">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">
            Pertanyaan Umum
          </h2>
          <p className="mt-2 sm:mt-3 text-sm sm:text-base text-slate-500 max-w-lg mx-auto px-4 sm:px-0">
            Temukan jawaban untuk pertanyaan yang sering diajukan
          </p>
        </div>

        <MotionDiv className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="rounded-xl border border-slate-200 bg-white px-4 sm:px-6 data-[state=open]:shadow-md data-[state=open]:border-primary-200 transition-all"
              >
                <AccordionTrigger className="text-left text-sm sm:text-base font-medium hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </MotionDiv>
      </div>
    </section>
  );
}
