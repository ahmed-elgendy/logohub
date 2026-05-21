import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "LogoHub",
  description: "Browse and search logos of the world's biggest brands.",
  openGraph: {
    title: "LogoHub",
    description: "Browse and search logos of the world's biggest brands.",
    type: "website",
    images: [
      "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3ba00cdf-4f47-4dc1-9513-7befc2e63055/id-preview-5805b6fc--72d7b02f-1800-4ad0-8c24-187d55c81ea6.lovable.app-1775723560161.png",
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Lovable",
    title: "LogoHub",
    description: "Browse and search logos of the world's biggest brands.",
  },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
