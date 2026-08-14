import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/app/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60 pt-12 pb-16">
      <div className="grid gap-10 md:grid-cols-4">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Image
              src="/images/mentah-logo-softvesion.png"
              alt="SOFTVISION Logo"
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="brand-retro text-sm text-neutral-900 dark:text-zinc-100 tracking-wider">
              {siteConfig.name}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">
            {siteConfig.description}
          </p>
          <div className="space-y-2">
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 text-neutral-400 hover:text-red-brand transition">
              <Mail size={13} />
              <span className="text-xs font-semibold">{siteConfig.email}</span>
            </a>
            <a href={`https://wa.me/62${siteConfig.phone}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-neutral-400 hover:text-red-brand transition">
              <Phone size={13} />
              <span className="text-xs font-semibold">{siteConfig.phone}</span>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-label text-[10px] font-bold uppercase tracking-widest text-red-600">
            Navigasi
          </h4>
          <ul className="mt-4 space-y-2">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-xs font-medium text-neutral-500 hover:text-red-brand transition duration-150"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Sosial Media */}
        <div>
          <h4 className="font-label text-[10px] font-bold uppercase tracking-widest text-red-600">
            Sosial Media
          </h4>
          <ul className="mt-4 space-y-2">
            <li>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-red-brand transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                Instagram
              </a>
            </li>
            <li>
              <a href={siteConfig.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-red-brand transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                Facebook
              </a>
            </li>
            <li>
              <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-red-brand transition duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                GitHub
              </a>
            </li>
          </ul>
        </div>

        {/* Kontak */}
        <div>
          <h4 className="font-label text-[10px] font-bold uppercase tracking-widest text-red-600">
            Lokasi
          </h4>
          <p className="mt-4 text-xs leading-relaxed text-neutral-500 font-medium">
            Indonesia 🇮🇩 <br />
            Remote / Global
          </p>
          <a
            href="#contact"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 px-4 py-2 font-label text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition duration-200"
          >
            Konsultasi Gratis
          </a>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="mt-12 pt-6 border-t border-zinc-200/40 dark:border-zinc-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-label text-[9px] uppercase tracking-widest text-neutral-400">
          © {new Date().getFullYear()} {siteConfig.name}. Semua hak dilindungi.
        </p>
        <p className="font-label text-[9px] uppercase tracking-widest text-neutral-400">
          Built with Next.js · Firebase · Framer Motion
        </p>
      </div>
    </footer>
  );
}
