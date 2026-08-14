"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { skills } from "@/app/lib/data";
import SectionHeader from "@/app/components/ui/SectionHeader";

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <section id="skills" className="space-y-10">
      <SectionHeader
        eyebrow="03 // KEAHLIAN"
        title="Tech Stack & Kemahiran"
        align="center"
      />
      <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((cat, i) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: 0.55,
              delay: i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-1"
          >
            <div className="mb-4 pb-2.5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="font-label text-[10px] font-bold tracking-widest text-neutral-400 dark:text-zinc-500 uppercase">
                {cat.title}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-red-600/65" />
            </div>
            <div className="space-y-5">
              {cat.items.map((it, j) => (
                <div key={it.name}>
                  <div className="mb-2 flex items-center justify-between text-xs font-semibold text-neutral-800 dark:text-zinc-200">
                    <span>{it.name}</span>
                    <span className="text-red-brand dark:text-red-500">{it.value}%</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-950">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-red-600 to-red-500"
                      initial={{ width: 0 }}
                      animate={inView ? { width: `${it.value}%` } : {}}
                      transition={{
                        duration: 0.8,
                        delay: i * 0.1 + j * 0.1 + 0.3,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

