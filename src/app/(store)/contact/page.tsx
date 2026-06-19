import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hubungi Kami | Premiora",
  description: "Kontak layanan pelanggan dan bantuan Premiora",
};

export default function ContactPage() {
  return (
    <div className="container-custom py-24 sm:py-32">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Hubungi Kami</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg">
          Ada pertanyaan atau kendala mengenai produk? Tim layanan pelanggan kami siap membantu Anda 24/7.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Email Support</h3>
          <p className="text-slate-500 mb-6">Kirimkan keluhan atau pertanyaan Anda melalui surel resmi kami.</p>
          <a href="mailto:premiora9@gmail.com" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
            premiora9@gmail.com
          </a>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">WhatsApp</h3>
          <p className="text-slate-500 mb-6">Layanan chat cepat untuk pertanyaan darurat mengenai order Anda.</p>
          <a href="https://wa.me/6285654590758" target="_blank" rel="noopener noreferrer" className="text-[#25D366] font-semibold hover:text-[#20ba59] transition-colors">
            +62 856-5459-0758
          </a>
        </div>
      </div>

      <div className="mt-16 max-w-3xl mx-auto text-center">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Informasi Operasional</h2>
        <div className="text-slate-600">
          <p className="mb-2"><strong>Jam Kerja:</strong> Setiap Hari, 08:00 - 23:00 WITA</p>
          <p><strong>Alamat:</strong> Makassar, Sulawesi Selatan, Indonesia</p>
        </div>
      </div>
    </div>
  );
}
