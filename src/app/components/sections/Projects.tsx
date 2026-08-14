"use client";

import { useState } from "react";
import Image from "next/image";

type Project = {
  id?: string;
  name: string;
  category: string;
  desc: string;
  tech: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
};

export default function Projects({ data }: { data?: Project[] } = {}) {
  const projects = data ?? [];
  const [activeFilter, setActiveFilter] = useState("Semua");

  const filteredProjects = projects.filter((p) => {
    if (activeFilter === "Semua") return true;
    const cat = p.category?.toLowerCase() || "";
    if (activeFilter === "AI") return cat.includes("ai");
    if (activeFilter === "Vision") {
      return cat.includes("vision") || cat.includes("cv") || cat.includes("computer vision");
    }
    if (activeFilter === "Web") {
      return cat.includes("web") || cat.includes("software") || cat.includes("app");
    }
    return false;
  });

  return (
    <section id="projects" className="space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-600 dark:text-red-500">
            04 // PORTOFOLIO UTAMA
          </span>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
            Karya Unggulan
          </h2>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 md:justify-end">
          {["Semua", "AI", "Vision", "Web"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`font-label text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                f === activeFilter
                  ? "bg-red-brand text-white shadow-sm"
                  : "bg-white/50 dark:bg-zinc-900/50 text-neutral-500 dark:text-zinc-400 hover:text-neutral-900 dark:hover:text-zinc-100 hover:bg-white dark:hover:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-800/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((p) => (
            <div
              key={p.id ?? p.name}
              className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 shadow-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-video overflow-hidden bg-zinc-100 dark:bg-zinc-950">
                {p.image ? (
                  p.image.startsWith("data:") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt={p.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      src={p.image}
                    />
                  ) : (
                    <Image
                      alt={p.name}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      src={p.image}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-600">
                    🖼️ No image
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 backdrop-blur-md">
                  <span className="font-label text-[8px] font-bold uppercase tracking-widest text-white">
                    {p.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 md:p-7">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">{p.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-zinc-300 flex-grow">{p.desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded bg-neutral-100 dark:bg-zinc-800/80 px-2 py-0.5 font-label text-[9px] font-semibold text-neutral-500 dark:text-zinc-400 border border-zinc-200/20 dark:border-zinc-700/20"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-5 border-t border-zinc-100 dark:border-zinc-800/60 bg-white/40 dark:bg-zinc-900/40 px-6 py-4">
                {p.githubUrl ? (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-zinc-400 hover:text-red-brand dark:hover:text-red-500 transition duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                    GitHub
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 dark:text-zinc-700 cursor-not-allowed select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                    GitHub
                  </span>
                )}

                {p.liveUrl ? (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 dark:text-zinc-400 hover:text-red-brand dark:hover:text-red-500 transition duration-150"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Live Demo
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-300 dark:text-zinc-700 cursor-not-allowed select-none">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    Live Demo
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-zinc-300/80 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 p-12 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/20 mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h3 className="text-base font-bold text-neutral-800 dark:text-zinc-200">Portofolio Sedang Diperbarui</h3>
          <p className="mt-2 text-sm text-neutral-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
            Proyek-proyek terbaru sedang dalam tahap finalisasi. Hubungi kami untuk informasi lebih lanjut.
          </p>
          <a
            href="#contact"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-neutral-900 dark:bg-zinc-100 hover:bg-neutral-800 dark:hover:bg-zinc-200 px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-widest text-white dark:text-zinc-950 shadow-sm transition duration-200"
          >
            Hubungi Kami
          </a>
        </div>
      )}
    </section>
  );
}
