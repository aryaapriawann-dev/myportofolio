"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import SectionHeader from "@/app/components/ui/SectionHeader";

type Review = {
  id?: string;
  name: string;
  role?: string;
  text: string;
  stars: number;
  createdAt?: { seconds: number } | null;
};

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(s)}
          className="transition-transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill={(hovered || value) >= s ? "#dc2626" : "none"}
            stroke="#dc2626" strokeWidth="1.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-60px" });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [form, setForm] = useState({ name: "", role: "", text: "", stars: 5 });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) console.error("reviews fetch:", error);
      else setReviews(data || []);
    };

    fetchReviews();

    const channel = supabase
      .channel("public:reviews")
      .on("postgres_changes", { event: "*", schema: "public", table: "reviews" }, () => fetchReviews())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.text.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert([
        {
          id: `rev-${Date.now()}`,
          name: form.name.trim(),
          role: form.role.trim() || null,
          text: form.text.trim(),
          stars: form.stars,
        },
      ]);
      if (error) throw error;
      setForm({ name: "", role: "", text: "", stars: 5 });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error("submit review error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "mt-1.5 w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-neutral-900 dark:text-zinc-100 px-3.5 py-2.5 text-sm outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/15 placeholder:text-neutral-400 dark:placeholder:text-zinc-600";
  const labelClass = "font-label text-[9px] font-bold uppercase tracking-widest text-neutral-500 dark:text-zinc-400";

  return (
    <section id="testimonials" className="space-y-12">
      <SectionHeader
        eyebrow="06 // ULASAN"
        title="Apa Kata Mereka?"
        description="Tinggalkan ulasan atau komentar kamu setelah bekerja sama dengan kami."
        align="center"
      />

      {/* Form Komentar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, margin: "-60px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 p-6 md:p-8 shadow-sm backdrop-blur-md"
      >
        <h3 className="text-sm font-bold text-neutral-900 dark:text-zinc-100 mb-5">✍️ Tulis Ulasan Kamu</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nama *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                placeholder="Nama kamu"
                required
                disabled={submitting}
              />
            </div>
            <div>
              <label className={labelClass}>Profesi / Peran (opsional)</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputClass}
                placeholder="Contoh: Pemilik Usaha"
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Rating *</label>
            <div className="mt-2">
              <StarPicker value={form.stars} onChange={(v) => setForm({ ...form, stars: v })} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Komentar *</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Ceritakan pengalaman kamu..."
              required
              disabled={submitting}
            />
          </div>
          {submitted && (
            <p className="text-xs text-green-600 dark:text-green-400 font-medium bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/40 rounded-lg px-3 py-2">
              ✓ Ulasan berhasil dikirim! Terima kasih.
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-neutral-900 dark:bg-zinc-100 hover:bg-neutral-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 disabled:opacity-60 px-5 py-2.5 font-label text-[10px] font-bold uppercase tracking-widest shadow-sm transition duration-200 cursor-pointer"
          >
            {submitting ? "Mengirim..." : "Kirim Ulasan"}
          </button>
        </form>
      </motion.div>

      {/* Tampilan Reviews */}
      {reviews.length > 0 && (
        <div ref={ref} className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-900/70 p-6 shadow-sm backdrop-blur-md"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <svg key={s} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    fill={s < r.stars ? "#dc2626" : "#3f3f46"} stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-neutral-600 dark:text-zinc-400 italic">&ldquo;{r.text}&rdquo;</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/30 text-xs font-bold text-red-600 dark:text-red-400">
                  {r.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-neutral-900 dark:text-zinc-100 leading-none">{r.name}</p>
                  {r.role && <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-zinc-500 mt-0.5">{r.role}</p>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {reviews.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300/80 dark:border-zinc-700/60 bg-white/40 dark:bg-zinc-900/40 p-10 text-center">
          <p className="text-sm text-neutral-400 dark:text-zinc-500">Belum ada ulasan. Jadilah yang pertama! 👆</p>
        </div>
      )}
    </section>
  );
}
