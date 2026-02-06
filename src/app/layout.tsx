import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "KnowledgeShare — Learn together",
    template: "%s | KnowledgeShare",
  },
  description:
    "Share knowledge and get matched with experts. Report issues, get matched via AI, and learn in real time.",
  openGraph: {
    title: "KnowledgeShare — Learn together",
    description: "Share knowledge and get matched with experts in real time.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0284c7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <a
          href="#main-content"
          className="absolute -left-[9999px] top-4 z-50 rounded bg-brand-600 px-3 py-2 text-white transition-[left] focus:left-4 focus:outline-none focus:ring-2 focus:ring-brand-400"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
