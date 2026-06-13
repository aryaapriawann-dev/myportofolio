"use client";

import SectionHeader from "@/app/components/ui/SectionHeader";

export default function Testimonials() {
  return (
    <section className="space-y-10">
      <SectionHeader 
        eyebrow="06 // RECOGNITION" 
        title="Ulasan Klien" 
        description="Kami bangga dengan hasil rekayasa teknis yang selalu melampaui ekspektasi klien kami."
      />
      
      <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-6 md:p-8 backdrop-blur-sm shadow-sm transition duration-300 hover:border-zinc-300">
        <div className="flex items-center gap-2 text-red-brand">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 5V21"/></svg>
          <span className="font-label text-[9px] font-bold uppercase tracking-widest">Testimonial</span>
        </div>
        <p className="mt-4 text-base italic leading-relaxed text-neutral-700 font-medium">
          &quot;Solusi computer vision dari SOFTVISION mentransformasi akurasi Manufaktur Kami. Kami melihat reduksi 40% waktu deteksi error dalam bulan pertama. Kepintaran sejati.&quot;
        </p>
        <div className="mt-6 flex items-center gap-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 border border-red-200/50 text-xs font-bold text-red-brand">JD</div>
          <div>
            <p className="text-sm font-bold text-neutral-900 leading-none">Julian Draxler</p>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500 mt-1">CTO, Aero-Tech Systems</p>
          </div>
        </div>
      </div>
    </section>
  );
}
