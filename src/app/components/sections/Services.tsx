"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { services } from "@/app/lib/data";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { Brain, Eye, Code2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: { [key: string]: LucideIcon } = {
  Brain: Brain,
  Eye: Eye,
  Code2: Code2,
};

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  return (
    <section id="services" className="space-y-12">
      <SectionHeader
        eyebrow="05 // LAYANAN & SPESIALISASI"
        title="Layanan & Keahlian"
        description="Building intelligent systems that combine AI, vision, and modern web technology."
        align="center"
      />

      <div ref={ref} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => {
          const IconComponent = iconMap[s.iconName || ""] || Code2;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.55,
                delay: i * 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/25 hover:shadow-lg hover:shadow-red-500/[0.02] backdrop-blur-md flex flex-col"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.01] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 group-hover:border-red-500/30 group-hover:bg-red-50 dark:group-hover:bg-red-950/20 group-hover:text-red-600 dark:group-hover:text-red-400 text-neutral-700 dark:text-zinc-300 mb-6">
                <IconComponent size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="relative z-10 flex-grow flex flex-col">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-550 transition-colors duration-200">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-neutral-500 dark:text-zinc-400 font-medium flex-grow">
                  {s.body}
                </p>
              </div>
              <div className="relative z-10 mt-6 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-8" />
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

