"use client";

import { services } from "@/app/lib/data";
import SectionHeader from "@/app/components/ui/SectionHeader";
import { Brain, Eye, Code2 } from "lucide-react";

const iconMap: { [key: string]: React.ComponentType<any> } = {
  Brain: Brain,
  Eye: Eye,
  Code2: Code2,
};

export default function Services() {
  return (
    <section id="services" className="space-y-12">
      <SectionHeader 
        eyebrow="05 // SERVICES & EXPERTISE" 
        title="Layanan & Keahlian" 
        description="Building intelligent systems that combine AI, vision, and modern web technology."
        align="center"
      />
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => {
          const IconComponent = iconMap[s.iconName || ""] || Code2;
          return (
            <div
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/70 p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-red-500/25 hover:shadow-lg hover:shadow-red-500/[0.02] backdrop-blur-md flex flex-col"
            >
              {/* Subtle card accent gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/[0.01] via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              {/* Icon Container */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 group-hover:border-red-500/30 group-hover:bg-red-50 group-hover:text-red-600 text-neutral-700 mb-6">
                <IconComponent size={20} className="transition-transform duration-300 group-hover:scale-110" />
              </div>
              
              {/* Title & Description */}
              <div className="relative z-10 flex-grow flex flex-col">
                <h3 className="text-base font-bold text-neutral-900 group-hover:text-red-700 transition-colors duration-200">
                  {s.title}
                </h3>
                <p className="mt-2.5 text-xs leading-relaxed text-neutral-500 font-medium flex-grow">
                  {s.body}
                </p>
              </div>

              {/* Minimalist modern indicator line */}
              <div className="relative z-10 mt-6 h-[2px] w-0 bg-red-600 transition-all duration-300 group-hover:w-8" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
