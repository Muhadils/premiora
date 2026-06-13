import { Navbar } from "@/components/store/navbar";
import { Footer } from "@/components/store/footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Modern Dotted Background with Subtle Glows */}
      <div className="fixed inset-0 -z-50 bg-slate-50 overflow-hidden pointer-events-none">
        {/* Dot Pattern */}
        <div className="absolute inset-0 bg-dots-slate"></div>
        {/* Top Right Glow */}
        <div className="absolute top-0 right-0 w-[500px] sm:w-[800px] h-[500px] sm:h-[800px] bg-primary-200/20 rounded-full blur-[80px] sm:blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        {/* Bottom Left Glow */}
        <div className="absolute bottom-0 left-0 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-200/20 rounded-full blur-[80px] sm:blur-[120px] translate-y-1/3 -translate-x-1/4"></div>
      </div>

      <Navbar />
      <main className="flex-1 relative">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
