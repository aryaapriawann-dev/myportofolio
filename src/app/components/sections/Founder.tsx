"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

import { projects as staticProjects } from "@/app/lib/data";
import { founderAchievements as staticFounderAchievements } from "@/app/lib/data";
import { founderCertificates as staticFounderCertificates } from "@/app/lib/data";
import { skills as staticSkills } from "@/app/lib/data";
import { clients as staticClients } from "@/app/lib/data";

import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

type Achievement = {
  image: string;
  title: string;
  issuer: string;
  year: string;
  description?: string;
  type: "Prestasi" | "Sertifikat";
};

type Project = {
  name: string;
  category: string;
  desc: string;
  tech: string[];
  image?: string;
};

type Certificate = {
  image: string;
  title: string;
  issuer?: string;
  year?: string;
  description?: string;
  credentialId?: string;
  status?: string;
};

const socialLinks = [
  { name: "Instagram", src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg", alt: "Instagram", href: "https://www.instagram.com/arya_wan_computervision?igsh=MWp4YnNmejZ6dzVodw==" },
  { name: "LinkedIn", src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg", alt: "LinkedIn", href: "https://www.linkedin.com/in/arya-apriawan-1446b8413?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
  { name: "Facebook", src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg", alt: "Facebook", href: "https://www.facebook.com/profile.php?id=61570522649678" },
  { name: "X", src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg", alt: "X", href: "https://x.com/AApriawan28031" },
];

const readSession = <T,>(key: string, fallback: T): T => {
  try {
    if (typeof window === "undefined") return fallback;
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const computeStats = () => {
  const projects = readSession<Project[]>("admin_projects", staticProjects);
  const certificates = readSession<Certificate[]>("admin_certificates", []);
  const adminAchievements = readSession<Achievement[]>("admin_achievements", []);

  const projectCount = projects.length;

  const techSet = new Set<string>();
  projects.forEach((p) => p.tech?.forEach((t) => {
    if (t && t.trim()) techSet.add(t.trim());
  }));
  staticSkills.forEach((s) => s.items?.forEach((i) => {
    if (i.name && i.name.trim()) techSet.add(i.name.trim());
  }));
  const techCount = techSet.size;

  const staticAchievements: Achievement[] = [
    ...staticFounderAchievements.map((a) => ({ ...a, type: "Prestasi" as const })),
    ...staticFounderCertificates.map((a) => ({ ...a, type: "Sertifikat" as const })),
  ];
  const allAchievements = adminAchievements.length > 0 ? adminAchievements : staticAchievements;

  const certCount = allAchievements.length;

  const clientCount = staticClients.length + (projects.length - staticProjects.length) * 2;

  return [
    { n: String(projectCount), l: "projects" },
    { n: String(techCount), l: "tech stacks" },
    { n: String(certCount), l: "certifications" },
    { n: String(clientCount) + "+", l: "clients" },
  ];
};

export default function Founder() {
  const [showAll, setShowAll] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const [founderStats, setFounderStats] = useState(() => {
    const projectCount = staticProjects.length;
    const techSet = new Set<string>();
    staticProjects.forEach((p: any) => p.tech?.forEach((t: string) => {
      if (t && t.trim()) techSet.add(t.trim());
    }));
    staticSkills.forEach((s: any) => s.items?.forEach((i: any) => {
      if (i.name && i.name.trim()) techSet.add(i.name.trim());
    }));
    const techCount = techSet.size;
    const staticAchievementsCount = staticFounderAchievements.length + staticFounderCertificates.length;
    const clientCount = staticClients.length;

    return [
      { n: String(projectCount), l: "projects" },
      { n: String(techCount), l: "tech stacks" },
      { n: String(staticAchievementsCount), l: "certifications" },
      { n: String(clientCount) + "+", l: "clients" },
    ];
  });

  useEffect(() => {
    let active = true;

    async function fetchStats() {
      try {
        // Fetch projects from Firestore
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        if (!active) return;

        // Fetch certifications from Firestore
        const certSnapshot = await getDocs(collection(db, "certifications"));
        if (!active) return;

        const projectDocs = projectsSnapshot.docs.map(doc => doc.data() as Project);

        const projectCount = projectsSnapshot.size;
        const certCount = certSnapshot.size;

        // Tech stacks calculation
        const techSet = new Set<string>();
        // Add tech from Firestore projects
        projectDocs.forEach((p) => p.tech?.forEach((t) => {
          if (t && t.trim()) techSet.add(t.trim());
        }));
        // Fallback to static skills list to ensure a healthy base tech count
        staticSkills.forEach((s) => s.items?.forEach((i) => {
          if (i.name && i.name.trim()) techSet.add(i.name.trim());
        }));
        const techCount = techSet.size;

        // Clients calculation
        const clientsSet = new Set<string>();
        projectDocs.forEach((p: any) => {
          if (p.client && typeof p.client === "string" && p.client.trim()) {
            clientsSet.add(p.client.trim());
          }
        });
        
        let clientCount = clientsSet.size;
        if (clientCount === 0) {
          // Fallback to mock value if no clients found in projects
          clientCount = staticClients.length + (projectCount > staticProjects.length ? (projectCount - staticProjects.length) * 2 : 0);
        }

        setFounderStats([
          { n: String(projectCount), l: "projects" },
          { n: String(techCount), l: "tech stacks" },
          { n: String(certCount), l: "certifications" },
          { n: String(clientCount) + "+", l: "clients" },
        ]);
      } catch (error) {
        console.error("Error fetching Firestore stats:", error);
        // Fallback to local session storage / static computation if Firestore fails
        setFounderStats(computeStats());
      }
    }

    fetchStats();

    // Listen to local session storage storage/focus changes as fallback
    const handleStorageChange = () => setFounderStats(computeStats());
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      active = false;
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  const staticAchievements: Achievement[] = [
    ...staticFounderAchievements.map((a) => ({ ...a, type: "Prestasi" as const })),
    ...staticFounderCertificates.map((a) => ({ ...a, type: "Sertifikat" as const })),
  ];
  const adminAchievements = readSession<Achievement[]>("admin_achievements", []);
  const achievements = adminAchievements.length > 0 ? adminAchievements : staticAchievements;
  const visibleItems = showAll ? achievements : achievements.slice(0, 3);

  return (
    <section className="rounded-3xl border border-zinc-200/60 bg-white/70 p-6 md:p-12 shadow-sm backdrop-blur-md">
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        {/* Founder Left Image - 3D Flip */}
        <div className="relative md:col-span-5 flex flex-col justify-start">
          <div
            className="relative cursor-pointer group"
            style={{ perspective: "1200px" }}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className="relative w-full transition-transform duration-700 ease-out"
              style={{
                transformStyle: "preserve-3d",
                transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
              }}
            >
              {/* Front - Foto Founder */}
              <div
                className="backface-hidden"
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2.5 shadow-sm transition-transform duration-300 group-hover:shadow-md">
                  <img
                    alt="Arya Apriawan"
                    className="h-full w-full object-cover rounded-xl"
                    src="/images/aryaapriawan.jpeg"
                  />
                </div>
              </div>

              {/* Back - Social Media */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 bg-neutral-900 p-6 text-center"
                style={{
                  transform: "rotateY(180deg)",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div>
                  <p className="font-semibold text-base text-white">Arya Apriawan</p>
                  <p className="font-label text-[9px] uppercase tracking-widest text-neutral-400 mt-1">
                    Founder & Lead Engineer
                  </p>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      onClick={(e) => e.stopPropagation()}
                      className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-3 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/10"
                      aria-label={social.name}
                    >
                      <img
                        src={social.src}
                        alt={social.alt}
                        width={28}
                        height={28}
                        className="rounded-lg object-contain"
                      />
                      <span className="font-label text-[9px] uppercase tracking-wider text-neutral-400">
                        {social.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="mt-4 rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-lg">
              <p className="font-semibold text-sm text-neutral-900">Arya Apriawan</p>
              <p className="font-label text-[9px] uppercase tracking-widest text-neutral-500 mt-0.5">
                Founder & Lead Engineer
              </p>
            </div>
          </div>
        </div>

        {/* Founder Right Details */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-600">
            02 // THE ARCHITECT
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl lg:text-4xl leading-tight">
            Expertise in Cognitive Systems
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600">
            Spesialis di persimpangan Software Development, Artificial Intelligence,
            dan Computer Vision. Mengembangkan sistem cerdas dan arsitektur produk digital
            skala enterprise yang andal untuk tantangan teknologi generasi baru.
          </p>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {founderStats.map((s) => (
              <div key={s.l} className="rounded-xl border border-zinc-200/40 bg-white/40 p-4 text-center">
                <span className="block text-2xl font-bold text-red-brand">{s.n}</span>
                <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500 mt-1 block">
                  {s.l}
                </span>
              </div>
            ))}
          </div>

          {/* Achievements Sub-Section */}
          <div className="mt-10">
            <h3 className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-600">
              Prestasi & Sertifikat
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item, idx) => (
                <button
                  key={`${item.type}-${idx}`}
                  type="button"
                  onClick={() => item.image && setPreview(item.image)}
                  className="rounded-2xl border border-zinc-200/60 bg-white/60 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-zinc-300 hover:shadow-md text-left w-full flex flex-col h-full"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="mb-3 h-28 w-full rounded-xl border border-zinc-200/40 object-cover select-none"
                  />
                  <div className="flex-1 flex flex-col">
                    <span className="font-label text-[9px] font-semibold uppercase tracking-widest text-red-600">
                      {item.type}
                    </span>
                    <p className="mt-1.5 text-xs font-semibold text-neutral-900 line-clamp-2">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500 font-medium">
                      {item.issuer}
                    </p>
                    <p className="mt-1 text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            {achievements.length > 3 && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="btn-modern inline-flex items-center justify-center rounded-lg bg-neutral-900 hover:bg-neutral-800 px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-widest text-white shadow-sm transition duration-200"
                >
                  {showAll ? "Tampilkan Lebih Sedikit" : "Lihat Semua"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {preview ? (
          <motion.div
            className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreview(null)}
          >
            <motion.div
              className="relative max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-zinc-950 p-2 shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setPreview(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition shadow-md border border-white/10"
                aria-label="Close preview"
              >
                <X size={16} />
              </button>
              <Image
                src={preview}
                alt="Preview sertifikat"
                width={1200}
                height={800}
                className="max-h-[82vh] w-full rounded-lg object-contain"
              />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}