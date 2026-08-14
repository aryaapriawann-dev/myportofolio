"use client";

import { useEffect, useState } from "react";
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
import { supabase } from "@/app/lib/supabase";
import ScrollReveal from "@/app/components/ui/ScrollReveal";

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

type Certificate = {
  id?: string;
  image: string;
  title: string;
  issuer?: string;
  year?: string;
  description?: string;
  credentialId?: string;
  status?: string;
};

type TimelineItem = {
  id?: string;
  q: string;
  title: string;
  desc: string;
};

export default function Home() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, -40]);
  const opacity = useTransform(scrollY, [0, 700], [1, 0.85]);

  const [liveProjects, setLiveProjects] = useState<Project[] | null>(null);
  const [liveCertificates, setLiveCertificates] = useState<Certificate[] | null>(null);
  const [liveTimeline, setLiveTimeline] = useState<TimelineItem[] | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("projects").select("*");
      if (error) console.error("projects fetch:", error);
      else setLiveProjects(data);
    };

    const fetchCertificates = async () => {
      const { data, error } = await supabase.from("certificates").select("*");
      if (error) console.error("certificates fetch:", error);
      else setLiveCertificates(data);
    };

    const fetchTimeline = async () => {
      const { data, error } = await supabase.from("timeline").select("*");
      if (error) console.error("timeline fetch:", error);
      else setLiveTimeline(data);
    };

    fetchProjects();
    fetchCertificates();
    fetchTimeline();

    const channel = supabase
      .channel("db_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "projects" }, () => fetchProjects())
      .on("postgres_changes", { event: "*", schema: "public", table: "certificates" }, () => fetchCertificates())
      .on("postgres_changes", { event: "*", schema: "public", table: "timeline" }, () => fetchTimeline())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="relative min-h-screen text-neutral-900 dark:text-zinc-50 antialiased transition-colors duration-300">
      <FloatingLines3D />
      <Navbar />

      <motion.main
        className="relative mx-auto max-w-6xl px-6 pt-28 pb-20 space-y-24 md:space-y-32"
        style={{ y, opacity }}
      >
        <Hero />
        <ScrollReveal delay={0.05}>
          <About data={liveTimeline ?? undefined} />
        </ScrollReveal>
        <ScrollReveal delay={0.05} direction="left">
          <Founder certificates={liveCertificates ?? undefined} projects={liveProjects ?? undefined} />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <Skills />
        </ScrollReveal>
        <ScrollReveal delay={0.05} direction="right">
          <Projects data={liveProjects ?? undefined} />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <Services />
        </ScrollReveal>
        <ScrollReveal delay={0.05} direction="left">
          <Testimonials />
        </ScrollReveal>
        <ScrollReveal delay={0.05} direction="up">
          <Contact />
        </ScrollReveal>
        <ScrollReveal delay={0.05}>
          <Footer />
        </ScrollReveal>
      </motion.main>
    </div>
  );
}
