import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Premiora",
  description: "Kebijakan privasi dan perlindungan data Premiora",
};

export default function PrivacyPage() {
  return (
    <div className="container-custom py-24 sm:py-32">
      <div className="max-w-3xl mx-auto prose prose-slate sm:prose-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Kebijakan Privasi</h1>
        
        <p className="text-slate-500 mb-8">Pembaruan Terakhir: 19 Juni 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Informasi yang Kami Kumpulkan</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Saat Anda melakukan pembelian di Premiora, kami mengumpulkan informasi identitas dasar untuk keperluan pemrosesan pesanan, di antaranya:
          </p>
          <ul className="list-disc pl-5 text-slate-600 leading-relaxed space-y-2">
            <li>Nama lengkap atau nama panggilan.</li>
            <li>Alamat Email yang aktif.</li>
            <li>Nomor WhatsApp untuk pengiriman notifikasi dan kredensial akun.</li>
            <li>Data transaksi pembayaran (hanya referensi transaksi, kami <strong>tidak</strong> menyimpan nomor kartu kredit/debit Anda, data tersebut diproses secara aman oleh Payment Gateway resmi).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Penggunaan Data</h2>
          <p className="text-slate-600 leading-relaxed">
            Kami menggunakan data pribadi Anda semata-mata untuk memproses pesanan, memverifikasi pembayaran, mengirimkan detail akun premium, serta memberikan bantuan teknis (customer support). Kami dapat menggunakan email atau nomor WhatsApp Anda untuk menginformasikan masa aktif yang akan habis atau pembaruan layanan kami.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Keamanan dan Perlindungan Data</h2>
          <p className="text-slate-600 leading-relaxed">
            Premiora berkomitmen penuh untuk melindungi informasi pribadi Anda. Kami mengimplementasikan sistem keamanan enkripsi standar industri untuk mencegah akses yang tidak sah, penyalahgunaan, kebocoran, atau perubahan data Anda. Kami tidak akan pernah menjual, menyewakan, atau menukar data pribadi Anda kepada pihak ketiga.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Kebijakan Cookies</h2>
          <p className="text-slate-600 leading-relaxed">
            Website kami menggunakan "cookies" untuk memberikan pengalaman berbelanja yang lebih lancar, seperti menyimpan sesi login atau barang di keranjang belanja. Anda dapat mengatur browser Anda untuk menolak semua cookies, tetapi hal ini mungkin membuat beberapa fitur website tidak berfungsi maksimal.
          </p>
        </section>
      </div>
    </div>
  );
}
