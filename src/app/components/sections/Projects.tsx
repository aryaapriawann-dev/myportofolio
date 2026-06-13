"use client";

import { projects } from "@/app/lib/data";

export default function Projects() {
  return (
    <section id="projects" className="space-y-10">
      {/* Projects Header with Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-600">
            04 // PORTOFOLIO
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
            Karya Unggulan
          </h2>
        </div>
        
        {/* Modern Filter Pill Buttons */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:justify-end">
          {["Semua", "AI", "Vision", "Web"].map((f) => {
            const active = f === "Semua";
            return (
              <button 
                key={f} 
                className={`font-label text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-200 ${
                  active 
                    ? "bg-red-brand text-white shadow-sm" 
                    : "bg-white/50 text-neutral-500 hover:text-neutral-900 hover:bg-white border border-zinc-200/50"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.name} className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/70 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-md">
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden bg-zinc-100">
                <img 
                  alt={p.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" 
                  src={p.image} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 backdrop-blur-md">
                  <span className="font-label text-[8px] font-bold uppercase tracking-widest text-white">
                    {p.category}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className="text-base font-bold text-neutral-900">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 flex-grow">{p.desc}</p>
                
                {/* Technology Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t: string) => (
                    <span 
                      key={t} 
                      className="rounded bg-neutral-100 px-2 py-0.5 font-label text-[9px] font-semibold text-neutral-500 border border-zinc-200/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-5 border-t border-zinc-100 bg-white/40 px-6 py-4">
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-red-brand transition duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                  GitHub
                </a>
                <a 
                  href="#" 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-red-brand transition duration-150"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  Live Demo
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300/80 bg-white/40 p-12 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 className="text-base font-bold text-neutral-800">Portofolio Sedang Diperbarui</h3>
          <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
            Proyek-proyek terbaru sedang dalam tahap finalisasi. Hubungi kami untuk informasi lebih lanjut tentang portofolio dan layanan kami.
          </p>
          <a 
            href="#contact" 
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition duration-200"
          >
            Hubungi Kami
          </a>
        </div>
      )}
    </section>
  );
}
