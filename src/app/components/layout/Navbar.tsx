"use client";

import { useState, useRef, useEffect } from "react";
import { Menu, X, Sun, Moon, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/app/lib/constants";
import Button from "@/app/components/ui/Button";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Buat audio element sekali
    const audio = new Audio("/night-mode.mp4");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    // Kalau sudah dark saat load, langsung play
    if (document.documentElement.classList.contains("dark")) {
      audio.play().catch(() => {/* autoplay blocked */});
    }

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, []);

  const toggleTheme = () => {
    const goingDark = !document.documentElement.classList.contains("dark");

    if (goingDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
      // Play musik saat masuk dark mode
      if (audioRef.current && !isMuted) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
      // Stop musik saat keluar dark mode
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = 0.35;
      setIsMuted(false);
      if (isDark) audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-6 md:px-8">
        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 transition hover:opacity-90">
          <Image 
            src="/images/mentah-logo-softvesion.png" 
            alt="OFTVISION" 
            width={32}
            height={32}
            className="h-8 w-8 object-contain" 
          />
          <span className="brand-retro text-xs tracking-wider text-neutral-900 dark:text-white md:text-sm">
            SOFTVISION
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex">
          {siteConfig.nav.map((item) => (
            <a 
              key={item.href} 
              href={item.href} 
              className="font-label text-[11px] font-semibold uppercase tracking-widest text-neutral-500 dark:text-zinc-400 hover:text-red-brand dark:hover:text-red-500 transition duration-150"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Mute button — hanya muncul saat dark mode */}
          {isDark && (
            <button
              onClick={toggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 transition duration-150 cursor-pointer"
              aria-label="Toggle music"
              title={isMuted ? "Aktifkan musik" : "Matikan musik"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-neutral-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-neutral-950 dark:hover:text-zinc-100 transition duration-150 cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Button variant="ghost" href="/admin/login" className="px-3.5 py-1.5 text-xs text-neutral-600 dark:text-zinc-450 hover:text-neutral-950 dark:hover:text-zinc-100">
            Admin
          </Button>
          <Button variant="primary" href="#contact" className="px-4 py-2 text-xs">
            Hubungi Kami
          </Button>
        </div>

        {/* Mobile Action Controls */}
        <div className="flex items-center gap-2 md:hidden">
          {isDark && (
            <button
              onClick={toggleMute}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-zinc-100 transition cursor-pointer"
              aria-label="Toggle music"
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-neutral-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition cursor-pointer"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setOpen((s) => !s)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/50 text-neutral-800 dark:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-850 transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="absolute inset-x-0 top-16 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-950/95 px-6 py-5 shadow-lg backdrop-blur-lg md:hidden">
          <div className="flex flex-col gap-4">
            {siteConfig.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[14px] font-medium tracking-wide text-neutral-700 dark:text-zinc-300 hover:text-red-brand dark:hover:text-red-500 transition py-1"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="h-px bg-zinc-100 dark:bg-zinc-800/60 my-1" />
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

