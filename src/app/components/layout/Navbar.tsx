"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/app/lib/constants";
import Button from "@/app/components/ui/Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-200/50 bg-white/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 transition hover:opacity-90">
          <img 
            src="/images/mentah-logo-softvesion.png" 
            alt="OFTVISION" 
            className="h-8 w-8 object-contain" 
          />
          <span className="brand-retro text-xs tracking-wider text-neutral-900 md:text-sm">
            SOFTVISION
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {siteConfig.nav.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              className="font-label text-[11px] font-semibold uppercase tracking-widest text-neutral-500 hover:text-red-brand transition duration-150"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" href="/admin/login" className="px-3.5 py-1.5 text-xs text-neutral-600 hover:text-neutral-950">
            Admin
          </Button>
          <Button variant="primary" href="#contact" className="px-4 py-2 text-xs">
            Hubungi Kami
          </Button>
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setOpen((s) => !s)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/80 bg-white/50 text-neutral-800 hover:bg-zinc-50 transition md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={16} /> : <Menu size={16} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-zinc-200 bg-white/95 px-6 py-5 shadow-lg backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[14px] font-medium tracking-wide text-neutral-700 hover:text-red-brand transition py-1"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="h-px bg-zinc-100 my-1" />
            <div className="flex items-center gap-3">
              <Button 
                variant="secondary" 
                href="/admin/login" 
                className="flex-1 text-xs py-2" 
                onClick={() => setOpen(false)}
              >
                Admin
              </Button>
              <Button 
                variant="primary" 
                href="#contact" 
                className="flex-1 text-xs py-2" 
                onClick={() => setOpen(false)}
              >
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
