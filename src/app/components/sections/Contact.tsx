"use client";

import { Mail, Rocket, Phone } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="relative">
      <div className="overflow-hidden rounded-3xl border border-zinc-200/60 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="grid md:grid-cols-2">
          {/* Contact Details Panel */}
          <div className="p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-600">
                Hubungi Kami
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
                Mulai Proyek Baru
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">
                Punya tantangan teknis atau ingin membangun produk digital masa depan? Hubungi kami untuk konsultasi awal.
              </p>
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3.5 text-sm text-neutral-600">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Mail size={16} />
                </div>
                <a href="mailto:aryaapriawan77@gmail.com" className="font-medium hover:text-red-brand transition">
                  aryaapriawan77@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3.5 text-sm text-neutral-600">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Phone size={16} />
                </div>
                <a href="https://wa.me/6285946056552" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-red-brand transition">
                  085946056552
                </a>
              </div>
              <div className="flex items-center gap-3.5 text-sm text-neutral-600">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <Rocket size={16} />
                </div>
                <span className="font-medium">Global / Remote Intelligence Lab</span>
              </div>
            </div>
          </div>

          {/* Form Panel */}
          <form
            className="space-y-5 border-t border-zinc-200/50 bg-white/40 p-8 md:p-12 md:border-t-0 md:border-l"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Pesan diterima (simulasi). Sambungkan backend untuk kirim.");
            }}
          >
            <div>
              <span className="font-label text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                Nama Lengkap
              </span>
              <input 
                type="text" 
                className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-red-brand focus:ring-2 focus:ring-red-500/15" 
                placeholder="John Doe" 
                required
              />
            </div>
            <div>
              <span className="font-label text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                Alamat Email
              </span>
              <input 
                type="email" 
                className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-red-brand focus:ring-2 focus:ring-red-500/15" 
                placeholder="john@company.com" 
                required
              />
            </div>
            <div>
              <span className="font-label text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                Pesan
              </span>
              <textarea 
                rows={4} 
                className="mt-2 w-full rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-red-brand focus:ring-2 focus:ring-red-500/15 resize-none" 
                placeholder="Rincian proyek..." 
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-modern w-full rounded-lg bg-neutral-900 hover:bg-neutral-800 px-5 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm border border-neutral-950 transition duration-200 cursor-pointer"
            >
              Kirim Transmisi
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
