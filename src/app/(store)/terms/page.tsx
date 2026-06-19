import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Premiora",
  description: "Syarat dan ketentuan penggunaan layanan Premiora",
};

export default function TermsPage() {
  return (
    <div className="container-custom py-24 sm:py-32">
      <div className="max-w-3xl mx-auto prose prose-slate sm:prose-lg">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-8">Syarat & Ketentuan</h1>
        
        <p className="text-slate-500 mb-8">Pembaruan Terakhir: 19 Juni 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">1. Pendahuluan</h2>
          <p className="text-slate-600 leading-relaxed">
            Selamat datang di Premiora. Dengan mengakses dan menggunakan layanan kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan ini. Jika Anda tidak menyetujui salah satu bagian dari syarat ini, Anda tidak diperkenankan menggunakan layanan kami.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">2. Layanan dan Produk</h2>
          <p className="text-slate-600 leading-relaxed">
            Premiora adalah platform yang menyediakan layanan aktivasi, lisensi, dan penyediaan akun premium digital (seperti layanan streaming, desain, dan edukasi). Seluruh produk yang kami sediakan adalah resmi dan mematuhi aturan platform masing-masing.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">3. Transaksi dan Pembayaran</h2>
          <ul className="list-disc pl-5 text-slate-600 leading-relaxed space-y-2">
            <li>Harga yang tertera di website adalah harga final kecuali ada penyesuaian khusus yang disepakati bersama.</li>
            <li>Pembayaran dilakukan melalui Payment Gateway resmi yang bekerja sama dengan kami (termasuk namun tidak terbatas pada QRIS, Virtual Account, dan E-Wallet).</li>
            <li>Transaksi yang sudah berhasil dibayar tidak dapat dibatalkan secara sepihak oleh pembeli kecuali memenuhi ketentuan pada Kebijakan Pengembalian Dana.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">4. Penggunaan Akun</h2>
          <ul className="list-disc pl-5 text-slate-600 leading-relaxed space-y-2">
            <li>Pengguna dilarang keras mengubah kata sandi, email, atau pengaturan profil (billing) pada akun tipe "Shared" atau akun langganan bersama.</li>
            <li>Pelanggaran terhadap poin di atas akan mengakibatkan hangusnya masa garansi dan pemutusan akses akun tanpa pengembalian dana.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">5. Perubahan Syarat & Ketentuan</h2>
          <p className="text-slate-600 leading-relaxed">
            Premiora berhak untuk mengubah, memodifikasi, menambah, atau menghapus bagian mana pun dari Syarat & Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. Penggunaan berkelanjutan atas layanan kami berarti Anda menerima perubahan tersebut.
          </p>
        </section>
      </div>
    </div>
  );
}
