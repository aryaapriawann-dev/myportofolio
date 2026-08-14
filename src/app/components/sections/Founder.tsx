"use client";

import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { founderAchievements as staticFounderAchievements } from "@/app/lib/data";
import { founderCertificates as staticFounderCertificates } from "@/app/lib/data";
import { skills as staticSkills } from "@/app/lib/data";
import { clients as staticClients } from "@/app/lib/data";

type Achievement = {
  image: string;
  title: string;
  issuer: string;
  year: string;
  description?: string;
  type: "Prestasi" | "Sertifikat";
};

type Project = {
  id?: string;
  name: string;
  category: string;
  desc: string;
  tech: string[];
  image?: string;
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

const socialLinks = [
  { name: "Instagram", src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg", alt: "Instagram", href: "https://www.instagram.com/arya_wan_computervision?igsh=MWp4YnNmejZ6dzVodw==" },
  { name: "LinkedIn", src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg", alt: "LinkedIn", href: "https://www.linkedin.com/in/arya-apriawan-1446b8413?utm_source=share_via&utm_content=profile&utm_medium=member_android" },
  { name: "Facebook", src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg", alt: "Facebook", href: "https://www.facebook.com/profile.php?id=61570522649678" },
  { name: "X", src: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg", alt: "X", href: "https://x.com/AApriawan28031" },
];

/* Helper: check if an image src is a base64 data URI */
const isDataUri = (src?: string) => src?.startsWith("data:");

export default function Founder({
  certificates,
  projects,
}: {
  certificates?: Certificate[];
  projects?: Project[];
}) {
  const [showAll, setShowAll] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  /* ──── Compute stats from Firestore props ──── */
  const founderStats = (() => {
    // Projects count — use Firestore data if available
    const projectList = projects ?? [];
    const projectCount = projectList.length;

    // Tech stacks — aggregate from projects + static skills
    const techSet = new Set<string>();
    projectList.forEach((p) =>
      p.tech?.forEach((t) => {
        if (t && t.trim()) techSet.add(t.trim());
      })
    );
    staticSkills.forEach((s) =>
      s.items?.forEach((i) => {
        if (i.name && i.name.trim()) techSet.add(i.name.trim());
      })
    );
    const techCount = techSet.size;

    // Certifications count — static achievements + Firestore certificates
    const certCount = staticFounderAchievements.length + (certificates?.length ?? staticFounderCertificates.length);

    // Clients count
    const clientCount = staticClients.length + (projectCount > 0 ? Math.max(0, projectCount - 1) * 2 : 0);

    return [
      { n: String(projectCount), l: "projects" },
      { n: String(techCount), l: "tech stacks" },
      { n: String(certCount), l: "certifications" },
      { n: String(clientCount) + "+", l: "clients" },
    ];
  })();

  /* ──── Build achievements list from Firestore certificates ──── */
  const achievements: Achievement[] = (() => {
    // Always include static achievements (Prestasi)
    const list: Achievement[] = [
      ...staticFounderAchievements.map((a) => ({ ...a, type: "Prestasi" as const })),
    ];

    const seenTitles = new Set<string>();

    // If Firestore certificates are available, use them
    if (certificates !== undefined) {
      certificates.forEach((c) => {
        const titleKey = c.title.toLowerCase().trim();
        list.push({
          image: c.image,
          title: c.title,
          issuer: c.issuer || "",
          year: c.year || "",
          description: c.description || "",
          type: "Sertifikat" as const,
        });
        seenTitles.add(titleKey);
      });

      // Add static certificates that aren't already in Firestore (dedup by title)
      staticFounderCertificates.forEach((c) => {
        const titleKey = c.title.toLowerCase().trim();
        if (!seenTitles.has(titleKey)) {
          list.push({
            image: c.image,
            title: c.title,
            issuer: c.issuer || "",
            year: c.year || "",
            description: "",
            type: "Sertifikat" as const,
          });
          seenTitles.add(titleKey);
        }
      });
    } else {
      // Fallback to static certificates when Firestore hasn't loaded yet
      staticFounderCertificates.forEach((c) => {
        list.push({
          image: c.image,
          title: c.title,
          issuer: c.issuer || "",
          year: c.year || "",
          description: "",
          type: "Sertifikat" as const,
        });
      });
    }

    return list;
  })();

  const visibleItems = showAll ? achievements : achievements.slice(0, 3);

  return (
    <section className="rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 p-6 md:p-12 shadow-sm backdrop-blur-md">
      <div className="grid gap-8 md:grid-cols-12 md:gap-12">
        {/* Founder Left Image */}
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
              {/* Front - Foto Founder dengan efek HUD */}
              <div
                className="backface-hidden"
                style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg">

                  {/* Outer glow border berdenyut */}
                  <motion.div
                    className="absolute -inset-[2px] rounded-2xl z-10 pointer-events-none"
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      background: "linear-gradient(135deg, rgba(220,38,38,0.8) 0%, rgba(220,38,38,0.1) 50%, rgba(220,38,38,0.8) 100%)",
                      padding: "2px",
                    }}
                  >
                    <div className="w-full h-full rounded-2xl bg-transparent" />
                  </motion.div>

                  {/* Foto */}
                  <div className="relative rounded-2xl overflow-hidden">
                    <Image
                      src="/images/aryaapriawan.jpeg"
                      alt="Arya Apriawan"
                      width={600}
                      height={600}
                      className="h-full w-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    {/* Overlay gradient bawah */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent rounded-2xl pointer-events-none" />

                    {/* Scan line effect */}
                    <motion.div
                      className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/80 to-transparent pointer-events-none z-20"
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* HUD corner brackets */}
                    {/* Top Left */}
                    <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-red-500 rounded-tl-sm z-20 pointer-events-none" />
                    {/* Top Right */}
                    <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-red-500 rounded-tr-sm z-20 pointer-events-none" />
                    {/* Bottom Left */}
                    <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-red-500 rounded-bl-sm z-20 pointer-events-none" />
                    {/* Bottom Right */}
                    <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-red-500 rounded-br-sm z-20 pointer-events-none" />

                    {/* Status badge - top */}
                    <motion.div
                      className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 pointer-events-none"
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="font-label text-[8px] uppercase tracking-widest text-green-400 font-bold">Available</span>
                    </motion.div>

                    {/* Name badge - bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 z-30 pointer-events-none">
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <p className="font-bold text-white text-base leading-tight drop-shadow">Arya Apriawan</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-label text-[9px] uppercase tracking-widest text-red-400">Founder & Lead Engineer</span>
                        </div>
                      </motion.div>
                    </div>

                    {/* Floating particles */}
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 rounded-full bg-red-500/70 pointer-events-none z-20"
                        style={{
                          left: `${15 + i * 18}%`,
                          top: `${20 + i * 12}%`,
                        }}
                        animate={{
                          y: [-6, 6, -6],
                          opacity: [0.3, 1, 0.3],
                          scale: [0.8, 1.2, 0.8],
                        }}
                        transition={{
                          duration: 2 + i * 0.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Hint klik flip */}
                <motion.p
                  className="text-center font-label text-[8px] uppercase tracking-widest text-neutral-400 dark:text-zinc-600 mt-2"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Klik untuk lihat sosial media
                </motion.p>
              </div>

              {/* Back - Social Media */}
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-neutral-900 dark:bg-zinc-950 p-6 text-center"
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
                      <Image
                        src={social.src}
                        alt={social.alt}
                        width={28}
                        height={28}
                        className="rounded-lg object-contain"
                        unoptimized
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
        </div>
        {/* Founder Right Details */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-600 dark:text-red-500">
            02 // PENDIRI
          </span>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl lg:text-4xl leading-tight">
            Spesialisasi Sistem Kognitif & AI
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">
            Spesialis di persimpangan Software Development, Artificial Intelligence,
            dan Computer Vision. Mengembangkan sistem cerdas dan arsitektur produk digital
            skala enterprise yang andal untuk tantangan teknologi generasi baru.
          </p>

          {/* Stats Grid */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {founderStats.map((s) => (
              <div key={s.l} className="rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 bg-white/40 dark:bg-zinc-900/40 p-4 text-center">
                <span className="block text-2xl font-bold text-red-brand dark:text-red-500">{s.n}</span>
                <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500 dark:text-zinc-400 mt-1 block">
                  {s.l}
                </span>
              </div>
            ))}
          </div>

          {/* Achievements Sub-Section */}
          <div className="mt-10">
            <h3 className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-600 dark:text-red-500">
              Prestasi & Sertifikat
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleItems.map((item, idx) => (
                <button
                  key={`${item.type}-${idx}`}
                  type="button"
                  onClick={() => item.image && setPreview(item.image)}
                  className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/60 p-4 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md text-left w-full flex flex-col h-full cursor-pointer"
                >
                  {isDataUri(item.image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.image}
                      alt={item.title}
                      className="mb-3 h-28 w-full rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 object-cover select-none"
                    />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={600}
                      height={400}
                      className="mb-3 h-28 w-full rounded-xl border border-zinc-200/40 dark:border-zinc-800/40 object-cover select-none"
                    />
                  )}
                  <div className="flex-1 flex flex-col">
                    <span className="font-label text-[9px] font-semibold uppercase tracking-widest text-red-600 dark:text-red-500">
                      {item.type}
                    </span>
                    <p className="mt-1.5 text-xs font-semibold text-neutral-900 dark:text-zinc-100 line-clamp-2">
                      {item.title}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500 dark:text-zinc-400 font-medium">
                      {item.issuer}
                    </p>
                    <p className="mt-1 text-[10px] text-neutral-400 dark:text-zinc-500 line-clamp-2 leading-relaxed">
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
                  className="btn-modern inline-flex items-center justify-center rounded-lg bg-neutral-900 dark:bg-zinc-100 hover:bg-neutral-800 dark:hover:bg-zinc-200 px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-widest text-white dark:text-zinc-950 shadow-sm transition duration-200 cursor-pointer"
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
              {isDataUri(preview) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={preview}
                  alt="Preview sertifikat"
                  className="max-h-[82vh] w-full rounded-lg object-contain"
                />
              ) : (
                <Image
                  src={preview}
                  alt="Preview sertifikat"
                  width={1200}
                  height={800}
                  className="max-h-[82vh] w-full rounded-lg object-contain"
                />
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>

  );
}