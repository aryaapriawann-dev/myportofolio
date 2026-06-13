"use client";

import { motion } from "framer-motion";
import Button from "@/app/components/ui/Button";

export default function Hero() {
  return (
    <section id="home" className="grid items-center gap-12 md:grid-cols-12 md:gap-16 pt-8 md:pt-12">
      {/* Hero Left Content */}
      <div className="md:col-span-7 flex flex-col items-start text-left">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-red-500/10 bg-red-500/5 px-3.5 py-1 transition-colors hover:bg-red-500/10">
          <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse" />
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-700">
            DI LUAR BATAS INTELEGENSI
          </span>
        </div>
        
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl md:text-6xl lg:text-7xl">
          Mengubah Ide Menjadi <br />
          <span className="text-red-brand bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            Solusi Digital Cerdas
          </span>
        </h1>
        
        <p className="mt-5 max-w-xl text-sm leading-relaxed text-neutral-600 sm:text-base">
          Pengembangan Software House modern dengan sistem clean, cinematic UI, dan integrasi Artificial Intelligence. Kami merancang masa depan bisnis Anda dengan teknologi paling mutakhir.
        </p>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button 
            variant="primary" 
            onClick={() => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full sm:w-auto px-6 py-3"
          >
            Lihat Portofolio
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
            className="w-full sm:w-auto px-6 py-3"
          >
            Hubungi Kami
          </Button>
        </div>
      </div>

      {/* Hero Right Graphic */}
      <div className="md:col-span-5 flex items-center justify-center">
        <motion.div
          className="relative flex items-center justify-center p-4 w-full max-w-[320px] md:max-w-none aspect-square"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        >
          {/* Subtle background glow */}
          <div className="absolute -inset-4 rounded-full bg-gradient-to-tr from-red-500/10 via-transparent to-neutral-200/20 blur-2xl" />

          {/* Radial gradient rings */}
          <motion.div
            className="absolute h-[85%] w-[85%] rounded-full border border-red-500/5 bg-radial-gradient"
            animate={{
              scale: [0.95, 1.05, 0.95],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="relative flex flex-col items-center"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img
              src="/images/mentah-logo-softvesion.png"
              alt="Logo SOFTVISION"
              className="h-40 w-auto drop-shadow-[0_0_30px_rgba(220,38,38,0.25)] md:h-56 select-none"
            />

            <motion.div
              className="mt-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              <span className="font-label text-sm font-bold tracking-[0.25em] text-neutral-800">
                SOFTVISION
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
