"use client";

import SectionHeader from "@/app/components/ui/SectionHeader";

type TimelineItem = {
  q: string;
  title: string;
  desc: string;
};

export default function About({ data }: { data?: TimelineItem[] } = {}) {
  const timeline = data ?? [];
  return (
    <section id="about" className="space-y-12">
      <SectionHeader 
        eyebrow="01 // LANDASAN" 
        title="Misi & Visi" 
        description="SOFTVISION dibangun dengan semangat inovasi dan rekayasa perangkat lunak untuk menciptakan solusi digital yang modern, cerdas, dan berdampak bagi bisnis maupun masyarakat." 
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 p-7 md:p-8 transition-all duration-300 hover:border-red-500/20 hover:shadow-sm">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 mb-4 font-mono text-sm font-bold">M</div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Misi Kami</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">Mengembangkan website, aplikasi, dan solusi berbasis Artificial Intelligence yang membantu organisasi meningkatkan produktivitas, efisiensi operasional, serta pengalaman pengguna melalui teknologi yang inovatif, aman, dan scalable.</p>
        </div>
        <div className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 p-7 md:p-8 transition-all duration-300 hover:border-red-500/20 hover:shadow-sm">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500 mb-4 font-mono text-sm font-bold">V</div>
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Visi Kami</h3>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">Menjadi perusahaan teknologi terpercaya yang menghadirkan solusi digital berkualitas tinggi melalui pengembangan web, aplikasi, dan sistem cerdas yang mampu menjawab tantangan masa depan.</p>
        </div>
      </div>

      <div className="relative py-4 pl-4 md:pl-6">
        <div className="absolute left-6 md:left-8 top-0 h-full w-[2px] bg-zinc-200/80 dark:bg-zinc-800" />
        
        <div className="space-y-8 relative">
          {timeline.map((item, idx) => (
            <div key={item.q + idx} className="relative pl-8 md:pl-10 group">
              {/* Timeline dot */}
              <div className="absolute left-[-6px] md:left-[-6px] top-2 z-10 h-3 w-3 rounded-full bg-white dark:bg-zinc-950 border-2 border-red-600 shadow-[0_0_8px_rgba(220,38,38,0.3)] transition-transform duration-300 group-hover:scale-125" />
              
              <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-8">
                <div className="flex-shrink-0 md:w-32">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/20 border border-red-200/55 dark:border-red-900/30 px-2.5 py-1 rounded-full uppercase">
                    {item.q}
                  </span>
                </div>
                <div className="flex-grow rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-zinc-900/80 p-5 md:p-6 transition duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm">
                  <h4 className="text-base font-semibold text-neutral-900 dark:text-white">{item.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

