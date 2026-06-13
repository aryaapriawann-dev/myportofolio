import { Mail } from "lucide-react";
import { siteConfig } from "@/app/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200/60 pt-12 pb-16">
      <div className="grid gap-10 md:grid-cols-4">
        {/* Brand Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <img 
              src="/images/mentah-logo-softvesion.png" 
              alt="SOFTVISION Logo" 
              className="h-8 w-8 object-contain" 
            />
            <span className="brand-retro text-sm text-neutral-900 tracking-wider">
              {siteConfig.name}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-neutral-500">
            {siteConfig.description}
          </p>
          <div className="flex items-center gap-2 text-neutral-400 hover:text-red-brand transition cursor-pointer">
            <Mail size={14} />
            <span className="text-xs font-semibold">{siteConfig.email}</span>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-label text-[10px] font-bold uppercase tracking-widest text-red-600">
            Navigation
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

        {/* Legal */}
        <div>
          <h4 className="font-label text-[10px] font-bold uppercase tracking-widest text-red-600">
            Legal
          </h4>
          <ul className="mt-4 space-y-2">
            <li>
              <a href="#" className="text-xs font-medium text-neutral-500 hover:text-red-brand transition duration-150">
                Kebijakan Privasi
              </a>
            </li>
            <li>
              <a href="#" className="text-xs font-medium text-neutral-500 hover:text-red-brand transition duration-150">
                Syarat Layanan
              </a>
            </li>
            <li>
              <a href="#" className="text-xs font-medium text-neutral-500 hover:text-red-brand transition duration-150">
                Pengaturan Cookie
              </a>
            </li>
          </ul>
        </div>

        {/* Address */}
        <div>
          <h4 className="font-label text-[10px] font-bold uppercase tracking-widest text-red-600">
            Address
          </h4>
          <p className="mt-4 text-xs leading-relaxed text-neutral-500 font-medium">
            Laboratorium Pusat: 500 Terabyte St. <br />
            Silicon Peak, Cloud 9
          </p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="mt-12 pt-6 border-t border-zinc-200/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-label text-[9px] uppercase tracking-widest text-neutral-400">
          © {new Date().getFullYear()} SOFTVISION. Semua hak dilindungi.
        </p>
        <div className="flex gap-4 text-[9px] font-bold uppercase tracking-widest text-neutral-400">
          <a href="#" className="hover:text-red-brand transition">Status</a>
          <span>•</span>
          <a href="#" className="hover:text-red-brand transition">Security</a>
        </div>
      </div>
    </footer>
  );
}
