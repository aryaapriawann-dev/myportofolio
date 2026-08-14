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
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/images/mentah-logo-softvesion.png", type: "image/png" },
    ],
    shortcut: "/images/mentah-logo-softvesion.png",
    apple: "/images/mentah-logo-softvesion.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${display.variable} ${body.variable} antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-[#f4f4f5] dark:bg-[#09090b] text-neutral-900 dark:text-zinc-50 transition-colors duration-300 antialiased">
        {children}
      </body>
    </html>
  );
}

