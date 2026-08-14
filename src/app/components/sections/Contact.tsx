"use client";

import { Mail, Rocket, Phone, Camera, Globe } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";

// ── EmailJS config ──────────────────────────────────────────
// Menggunakan environment variables Next.js, dengan fallback default yang aman
const EMAILJS_SERVICE_ID  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "service_softvision";
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "template_contact";
const EMAILJS_PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";
// ────────────────────────────────────────────────────────────

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    // 1. Kirim email via EmailJS
    try {
      if (EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== "YOUR_PUBLIC_KEY") {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name:    formData.name,
            from_email:   formData.email,
            message:      formData.message,
            to_email:     "aryaapriawan77@gmail.com",
          },
          EMAILJS_PUBLIC_KEY
        );
      } else {
        console.warn("EmailJS key is placeholder. Skipping email dispatch.");
      }
    } catch (err) {
      console.error("EmailJS error:", err);
      // Tetap lanjut buka WA meskipun email gagal
    }

    // 2. Buka WhatsApp ke nomor admin
    const waText =
      `Halo, saya ${formData.name}.\n\n` +
      `Email saya: ${formData.email}\n\n` +
      `Pesan:\n${formData.message}`;
    window.open(`https://wa.me/6285946056552?text=${encodeURIComponent(waText)}`, "_blank");

    setFormData({ name: "", email: "", message: "" });
    setIsLoading(false);
    setSubmitStatus({
      type: "success",
      message: "✓ Transmisi terkirim & WhatsApp telah dibuka!",
    });
  };

  return (
    <section id="contact" className="relative">
      <div className="overflow-hidden rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md shadow-sm">
        <div className="grid md:grid-cols-2">

          {/* ── Kiri: Info Kontak ── */}
          <div className="p-8 md:p-12 flex flex-col justify-between dark:bg-zinc-900/10">
            <div>
              <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-red-600 dark:text-red-500">
                07 // HUBUNGI KAMI
              </span>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white md:text-3xl">
                Mulai Proyek Baru
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400">
                Punya tantangan teknis atau ingin membangun produk digital masa depan?
                Hubungi kami untuk konsultasi awal.
              </p>
            </div>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3.5 text-sm text-neutral-600 dark:text-zinc-350">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500">
                  <Mail size={16} />
                </div>
                <a href="mailto:aryaapriawan77@gmail.com" className="font-medium hover:text-red-brand dark:hover:text-red-500 transition">
                  aryaapriawan77@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3.5 text-sm text-neutral-600 dark:text-zinc-350">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500">
                  <Phone size={16} />
                </div>
                <a href="https://wa.me/6285946056552" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-red-brand dark:hover:text-red-500 transition">
                  085946056552
                </a>
              </div>
              <div className="flex items-center gap-3.5 text-sm text-neutral-600 dark:text-zinc-350">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-500">
                  <Rocket size={16} />
                </div>
                <span className="font-medium">Global / Remote Intelligence Lab</span>
              </div>
              <div className="pt-4 flex items-center gap-3">
                <a
                  href="https://www.instagram.com/arya_wan_sfvsn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-zinc-100 shadow-sm transition duration-200 hover:border-red-500/60 dark:hover:border-red-500/60 hover:bg-red-50 dark:hover:bg-red-950/25"
                >
                  <Camera size={14} className="mr-2" />
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61570522649678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-900 dark:text-zinc-100 shadow-sm transition duration-200 hover:border-red-500/60 dark:hover:border-red-500/60 hover:bg-red-50 dark:hover:bg-red-950/25"
                >
                  <Globe size={14} className="mr-2" />
                  Facebook
                </a>
              </div>
            </div>
          </div>

          {/* ── Kanan: Form ── */}
          <form
            className="space-y-5 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 p-8 md:p-12 md:border-t-0 md:border-l"
            onSubmit={handleSubmit}
          >
            <div>
              <span className="font-label text-[9px] font-bold uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                Nama Lengkap
              </span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm dark:text-zinc-50 outline-none transition focus:border-red-brand focus:ring-2 focus:ring-red-500/15"
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <span className="font-label text-[9px] font-bold uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                Alamat Email
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm dark:text-zinc-50 outline-none transition focus:border-red-brand focus:ring-2 focus:ring-red-500/15"
                placeholder="john@company.com"
                required
                disabled={isLoading}
              />
            </div>
            <div>
              <span className="font-label text-[9px] font-bold uppercase tracking-widest text-neutral-500 dark:text-zinc-400">
                Pesan
              </span>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2.5 text-sm dark:text-zinc-50 outline-none transition focus:border-red-brand focus:ring-2 focus:ring-red-500/15 resize-none"
                placeholder="Rincian proyek..."
                required
                disabled={isLoading}
              />
            </div>

            {submitStatus && (
              <div
                className={`rounded-lg p-3 text-xs font-medium ${
                  submitStatus.type === "success"
                    ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900/30"
                    : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/30"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`btn-modern w-full rounded-lg px-5 py-3.5 text-xs font-bold uppercase tracking-widest shadow-sm border transition duration-200 cursor-pointer ${
                isLoading
                  ? "bg-neutral-600 text-white border-neutral-600 cursor-not-allowed opacity-70"
                  : "bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-950 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 dark:border-zinc-100"
              }`}
            >
              {isLoading ? "MENGIRIM..." : "Kirim Transmisi"}
            </button>
          </form>

        </div>
      </div>
    </section>
  );
}

