"use client";

import { skills } from "@/app/lib/data";
import SectionHeader from "@/app/components/ui/SectionHeader";

export default function Skills() {
  return (
    <section id="skills" className="space-y-10">
      <SectionHeader
        eyebrow="03 // KEMAMPUAN"
        title="Tech Stack & Kemahiran"
        align="center"
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((cat) => (
          <div 
            key={cat.title} 
            className="rounded-2xl border border-zinc-200/60 bg-white/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-zinc-300"
          >
            <div className="mb-4 pb-2.5 border-b border-zinc-100 flex items-center justify-between">
              <span className="font-label text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                {cat.title}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-red-600/65" />
            </div>
            <div className="space-y-5.5">
              {cat.items.map((it) => (
                <div key={it.name}>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-neutral-800">
                    <span>{it.name}</span>
                    <span className="text-red-brand">{it.value}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100">
                    <div 
                      className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500" 
                      style={{ width: `${it.value}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
