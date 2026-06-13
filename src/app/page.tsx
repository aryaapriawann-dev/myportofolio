"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/app/components/layout/Navbar";
import Hero from "@/app/components/sections/Hero";
import About from "@/app/components/sections/About";
import Founder from "@/app/components/sections/Founder";
import Skills from "@/app/components/sections/Skills";
import Projects from "@/app/components/sections/Projects";
import Services from "@/app/components/sections/Services";
import Testimonials from "@/app/components/sections/Testimonials";
import Contact from "@/app/components/sections/Contact";
import Footer from "@/app/components/layout/Footer";
import FloatingLines3D from "@/app/components/backgrounds/FloatingLines3D";

export default function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -40]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0.85]);

  return (
    <div className="relative min-h-screen bg-surface-light text-neutral-900 antialiased">
      <FloatingLines3D />
      <Navbar />

      <motion.main
        className="relative mx-auto max-w-6xl px-6 pt-28 pb-20 space-y-24 md:space-y-32"
        style={{ y, opacity }}
      >
        <Hero />
        <About />
        <Founder />
        <Skills />
        <Projects />
        <Services />
        {/* <Testimonials /> */}
        <Contact />
        <Footer />
      </motion.main>
    </div>
  );
}
