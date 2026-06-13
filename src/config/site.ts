export const siteConfig = {
  name: "Premiora",
  description:
    "Marketplace akun premium digital terpercaya. Dapatkan Canva Pro, ChatGPT Plus, Spotify Premium, Netflix, dan lainnya dengan harga terbaik dan proses instan.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/images/og-image.png",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890",
  keywords: [
    "akun premium",
    "canva pro",
    "chatgpt plus",
    "spotify premium",
    "netflix",
    "youtube premium",
    "akun premium murah",
    "jual akun premium",
    "marketplace digital",
  ],
  links: {
    whatsapp: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "6281234567890"}`,
  },
};

export type SiteConfig = typeof siteConfig;
