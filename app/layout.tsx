import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JetBrains_Mono, Noto_Sans_Thai, Sora } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const notoThai = Noto_Sans_Thai({
  variable: "--font-body",
  subsets: ["thai", "latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://soulplatform.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SOUL — Digital Memory Platform",
    template: "%s · SOUL",
  },
  description:
    "A card you tap. A lifetime you unlock. ประสบการณ์ความทรงจำดิจิทัลสำหรับมหาวิทยาลัย",
  applicationName: "SOUL",
  keywords: ["SOUL", "NFC collectible", "digital memory", "phygital", "soulplatform"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "SOUL — A lifetime you unlock",
    description: "The Digital Memory Platform for Universities.",
    type: "website",
    locale: "th_TH",
    url: siteUrl,
    siteName: "SOUL",
    images: [{ url: "/assets/og-soul.webp", width: 1200, height: 655 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOUL — A lifetime you unlock",
    description: "The Digital Memory Platform for Universities.",
    images: ["/assets/og-soul.webp"],
  },
  // Public marketing prototype may be discovered; admin/tap remain noindex via headers.
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className={`${sora.variable} ${notoThai.variable} ${jetbrainsMono.variable}`}>
        <a className="skip-link" href="#main-content">
          ข้ามไปยังเนื้อหาหลัก
        </a>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
