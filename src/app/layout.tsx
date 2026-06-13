import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Softvision — Crafted Digital",
  description:
    "Software house yang menggabungkan sistem clean, cinematic UI, dan AI-first.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="min-h-screen bg-[#f4f4f5] text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
