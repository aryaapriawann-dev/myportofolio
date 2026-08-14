'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/app/lib/supabase';

/* ──────────────────── Types ──────────────────── */

type Project = {
  id: string;
  name: string;
  category: string;
  desc: string;
  tech: string[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
};

type Certificate = {
  id: string;
  image: string;
  title: string;
  issuer?: string;
  year?: string;
  description?: string;
  credentialId?: string;
  status?: string;
};

type TimelineItem = {
  id: string;
  q: string;
  title: string;
  desc: string;
};

/* ──────────────────── Seed data (one-time if Firestore is empty) ──────────────────── */

const seedProjects: Omit<Project, 'id'>[] = [
  {
    name: 'Ocular Sentinel',
    category: 'COMPUTER VISION',
    desc: 'Sistem deteksi gangguan proyek berbasis Computer Vision.',
    tech: ['Python', 'OpenCV', 'PyTorch'],
    image: '/images/hakisertifikat.jpeg',
  },
];

const seedCertificates: Omit<Certificate, 'id'>[] = [
  {
    image: '/images/courserasertifikat.jpeg',
    title: 'TensorFlow Developer',
    issuer: 'Google / Coursera',
    year: '2023',
    description: 'Sertifikasi TensorFlow Developer.',
    credentialId: 'TF-DEV-XYZ',
    status: 'Issued',
  },
  {
    image: '/images/komdigisertifikat.jpeg',
    title: 'Advanced MLOps',
    issuer: 'Google / DeepLearning.AI',
    year: '2024',
    description: 'Sertifikasi Advanced MLOps.',
    credentialId: 'MLOPS-2024',
    status: 'Issued',
  },
];

const seedTimeline: Omit<TimelineItem, 'id'>[] = [
  {
    q: '2025  Present',
    title: 'Awal Perjalanan SOFTVISION',
    desc: 'SOFTVISION berawal dari eksplorasi teknologi modern, pengembangan berbagai proyek perangkat lunak, serta pembelajaran berkelanjutan di bidang Web Development, Mobile Development, Artificial Intelligence, dan Computer Vision sebagai fondasi membangun solusi digital yang bernilai.',
  },
];

/* ──────────────────── Empty form factories ──────────────────── */

const emptyProject = (): Omit<Project, 'id'> => ({
  name: '',
  category: '',
  desc: '',
  tech: [''],
  image: '',
  liveUrl: '',
  githubUrl: '',
});

const emptyCertificate = (): Omit<Certificate, 'id'> => ({
  image: '',
  title: '',
  issuer: '',
  year: '',
  description: '',
  credentialId: '',
  status: '',
});

const emptyTimeline = (): Omit<TimelineItem, 'id'> => ({
  q: '',
  title: '',
  desc: '',
});

/* ──────────────────── Image compression (agresif — untuk Firestore) ──────────────────── */

const compressImage = (file: File, maxWidth = 320, maxHeight = 240, quality = 0.35): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new window.Image();
      img.src = String(reader.result);
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w / h > maxWidth / maxHeight) {
          if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
        } else {
          if (h > maxHeight) { w = Math.round(w * maxHeight / h); h = maxHeight; }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('canvas error')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('image load error'));
    };
    reader.onerror = () => reject(new Error('file read error'));
    reader.readAsDataURL(file);
  });
};

/* ──────────────────── Helper: is image a data URI? ──────────────────── */

const isDataUri = (src?: string) => src?.startsWith('data:');

/* ══════════════════════════════════════════════════════════════
   MAIN ADMIN PANEL
   ══════════════════════════════════════════════════════════════ */

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<'projects' | 'certificates' | 'timeline'>('projects');
  const hasCheckedAuthRef = useRef(false);

  // Firestore-driven state
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const seededRef = useRef(false);

  /* ──── Auth guard ──── */
  useEffect(() => {
    if (hasCheckedAuthRef.current) return;
    hasCheckedAuthRef.current = true;

    const isAuth = typeof document !== 'undefined' ? document.cookie.includes('oft_admin=1') : false;
    if (!isAuth) {
      try { router.replace('/admin/login'); } catch { /* ignore */ }
    }
  }, [router]);

  /* ──── Real-time Supabase listeners & fetching ──── */
  useEffect(() => {
    const isAuth = typeof document !== 'undefined' ? document.cookie.includes('oft_admin=1') : false;
    if (!isAuth) return;

    const fetchAll = async () => {
      setLoading(true);
      const [projRes, certRes, timeRes] = await Promise.all([
        supabase.from('projects').select('*'),
        supabase.from('certificates').select('*'),
        supabase.from('timeline').select('*'),
      ]);

      if (projRes.data) setProjects(projRes.data);
      if (certRes.data) setCertificates(certRes.data);
      if (timeRes.data) setTimeline(timeRes.data);
      setLoading(false);
    };

    fetchAll();

    const channel = supabase
      .channel('admin_panel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        supabase.from('projects').select('*').then((res) => res.data && setProjects(res.data));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certificates' }, () => {
        supabase.from('certificates').select('*').then((res) => res.data && setCertificates(res.data));
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'timeline' }, () => {
        supabase.from('timeline').select('*').then((res) => res.data && setTimeline(res.data));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* ──── One-time seed if all tables empty ──── */
  useEffect(() => {
    if (loading || seededRef.current) return;
    if (projects.length === 0 && certificates.length === 0 && timeline.length === 0) {
      seededRef.current = true;
      (async () => {
        try {
          await Promise.all([
            ...seedProjects.map((p, i) =>
              supabase.from('projects').upsert({ ...p, id: `proj-seed-${i + 1}` })
            ),
            ...seedCertificates.map((c, i) =>
              supabase.from('certificates').upsert({ ...c, id: `cert-seed-${i + 1}` })
            ),
            ...seedTimeline.map((t, i) =>
              supabase.from('timeline').upsert({ ...t, id: `time-seed-${i + 1}` })
            ),
          ]);
        } catch (err) {
          console.error('Seed failed:', err);
        }
      })();
    } else {
      seededRef.current = true;
    }
  }, [loading, projects.length, certificates.length, timeline.length]);

  /* ──── Supabase CRUD: Projects ──── */
  const addProject = useCallback(async (data: Omit<Project, 'id'>) => {
    const id = `proj-${Date.now()}`;
    const payload = {
      id,
      name: data.name,
      category: data.category,
      desc: data.desc,
      tech: data.tech,
      image: data.image,
      liveUrl: data.liveUrl,
      githubUrl: data.githubUrl,
    };
    const { error } = await supabase.from('projects').insert([payload]);
    if (error) console.error('addProject error:', error);
  }, []);

  const updateProject = useCallback(async (item: Project) => {
    const payload = {
      name: item.name,
      category: item.category,
      desc: item.desc,
      tech: item.tech,
      image: item.image,
      liveUrl: item.liveUrl,
      githubUrl: item.githubUrl,
    };
    const { error } = await supabase.from('projects').update(payload).eq('id', item.id);
    if (error) console.error('updateProject error:', error);
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await supabase.from('projects').delete().eq('id', id);
  }, []);

  /* ──── Supabase CRUD: Certificates ──── */
  const addCertificate = useCallback(async (data: Omit<Certificate, 'id'>) => {
    const id = `cert-${Date.now()}`;
    const payload = {
      id,
      title: data.title,
      issuer: data.issuer,
      year: data.year,
      description: data.description,
      image: data.image,
      credentialId: data.credentialId,
      status: data.status,
    };
    const { error } = await supabase.from('certificates').insert([payload]);
    if (error) console.error('addCertificate error:', error);
  }, []);

  const updateCertificate = useCallback(async (item: Certificate) => {
    const payload = {
      title: item.title,
      issuer: item.issuer,
      year: item.year,
      description: item.description,
      image: item.image,
      credentialId: item.credentialId,
      status: item.status,
    };
    const { error } = await supabase.from('certificates').update(payload).eq('id', item.id);
    if (error) console.error('updateCertificate error:', error);
  }, []);

  const deleteCertificate = useCallback(async (id: string) => {
    await supabase.from('certificates').delete().eq('id', id);
  }, []);

  /* ──── Supabase CRUD: Timeline ──── */
  const addTimelineItem = useCallback(async (data: Omit<TimelineItem, 'id'>) => {
    const id = `time-${Date.now()}`;
    const payload = {
      id,
      q: data.q,
      title: data.title,
      desc: data.desc,
    };
    const { error } = await supabase.from('timeline').insert([payload]);
    if (error) console.error('addTimelineItem error:', error);
  }, []);

  const updateTimelineItem = useCallback(async (item: TimelineItem) => {
    const payload = {
      q: item.q,
      title: item.title,
      desc: item.desc,
    };
    const { error } = await supabase.from('timeline').update(payload).eq('id', item.id);
    if (error) console.error('updateTimelineItem error:', error);
  }, []);

  const deleteTimelineItem = useCallback(async (id: string) => {
    await supabase.from('timeline').delete().eq('id', id);
  }, []);

  /* ──── Logout ──── */
  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'oft_admin=1; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.replace('/admin/login');
  };

  const isAuth = typeof document !== 'undefined' ? document.cookie.includes('oft_admin=1') : false;

  if (!isAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">
        Mengalihkan ke halaman login...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-zinc-950/80 text-slate-900 dark:text-zinc-100 backdrop-blur-sm">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            OFTVISION Admin
            {loading && (
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent" />
            )}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Kelola proyek, sertifikat, dan timeline dari satu tempat.</p>
        </div>
        <div className="flex gap-2">
          <button
            className="rounded-full bg-red-500 text-white text-xs px-4 py-2 hover:bg-red-600"
            onClick={handleLogout}
          >
            Keluar
          </button>
        </div>
      </header>

      <div className="p-4 md:p-6">
        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl bg-white border border-slate-200 p-4 text-center shadow-sm">
            <span className="block text-2xl font-bold text-red-500 min-h-[32px] flex items-center justify-center">
              {loading ? (
                <span className="inline-block h-6 w-12 animate-pulse bg-slate-200 rounded" />
              ) : (
                projects.length
              )}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Proyek</span>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4 text-center shadow-sm">
            <span className="block text-2xl font-bold text-red-500 min-h-[32px] flex items-center justify-center">
              {loading ? (
                <span className="inline-block h-6 w-12 animate-pulse bg-slate-200 rounded" />
              ) : (
                certificates.length
              )}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Sertifikat</span>
          </div>
          <div className="rounded-xl bg-white border border-slate-200 p-4 text-center shadow-sm">
            <span className="block text-2xl font-bold text-red-500 min-h-[32px] flex items-center justify-center">
              {loading ? (
                <span className="inline-block h-6 w-12 animate-pulse bg-slate-200 rounded" />
              ) : (
                timeline.length
              )}
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Timeline</span>
          </div>
        </div>

        <div className="flex gap-3 border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-3">
          {(['projects', 'certificates', 'timeline'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-medium tracking-wide transition-colors ${
                tab === t
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === 'projects' && (
            <AdminProjects
              value={projects}
              onAdd={addProject}
              onUpdate={updateProject}
              onDelete={deleteProject}
              loading={loading}
            />
          )}
          {tab === 'certificates' && (
            <AdminCertificates
              value={certificates}
              onAdd={addCertificate}
              onUpdate={updateCertificate}
              onDelete={deleteCertificate}
              loading={loading}
            />
          )}
          {tab === 'timeline' && (
            <AdminTimeline
              value={timeline}
              onAdd={addTimelineItem}
              onUpdate={updateTimelineItem}
              onDelete={deleteTimelineItem}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN PROJECTS
   ══════════════════════════════════════════════════════════════ */

function AdminProjects({
  value,
  onAdd,
  onUpdate,
  onDelete,
  loading,
}: {
  value: Project[];
  onAdd: (data: Omit<Project, 'id'>) => Promise<void>;
  onUpdate: (item: Project) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}) {
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, 'id'>>(emptyProject());
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const startEdit = (item: Project) => {
    setEditingItem(item);
    setForm({ name: item.name, category: item.category, desc: item.desc, tech: item.tech, image: item.image, liveUrl: item.liveUrl ?? '', githubUrl: item.githubUrl ?? '' });
    setPreview(item.image || null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setForm(emptyProject());
    setPreview(null);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      setForm((prev) => ({ ...prev, image: compressed }));
      setPreview(compressed);
    } catch (err) {
      console.error('Compress error:', err);
    } finally {
      setUploading(false);
    }
  };

  const fillTerangBulan = () => {
    setEditingItem(null);
    setForm({
      name: 'Terang Bulan Mama Arya',
      category: 'WEB DEVELOPMENT',
      desc: 'Website bisnis martabak manis premium dengan fitur menu online, sistem pemesanan, dan halaman admin untuk manajemen konten secara real-time.',
      tech: ['React', 'Firebase', 'Tailwind CSS', 'Firestore'],
      image: '',
      liveUrl: 'https://terang-bulan-mama-arya.web.app',
      githubUrl: '',
    });
    setPreview(null);
  };

  const save = async () => {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editingItem) {
        await onUpdate({ ...form, id: editingItem.id } as Project);
      } else {
        await onAdd(form);
      }
      cancelEdit();
    } catch (err) {
      console.error('Error saving project:', err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Project) => {
    setSaving(true);
    try {
      await onDelete(item.id);
    } catch (err) {
      console.error('Error deleting project:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-semibold text-slate-900">
              {editingItem ? '✏️ Edit Proyek' : '➕ Tambah Proyek'}
            </h2>
          </div>
          <div className="flex gap-2">
            {!editingItem && (
              <button
                className="rounded-full border border-yellow-400 bg-yellow-50 text-yellow-700 text-xs px-3 py-2 hover:bg-yellow-100 transition"
                onClick={fillTerangBulan}
                type="button"
              >
                🥞 Isi Terang Bulan
              </button>
            )}
            <button
              className="rounded-full bg-red-500 text-white text-sm px-5 py-2 hover:bg-red-600 shadow-sm disabled:opacity-50"
              onClick={save}
              disabled={saving || uploading}
            >
              {uploading ? 'Mengupload...' : saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            {editingItem && (
              <button
                className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={cancelEdit}
              >
                Batal
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Nama Proyek</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Contoh: Ocular Sentinel"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Kategori</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Contoh: COMPUTER VISION"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-medium text-slate-500">Deskripsi</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition resize-none h-20"
              placeholder="Jelaskan singkat tentang proyek ini..."
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Tech Stack</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Contoh: Next.js, Python, OpenCV"
              value={form.tech.join(', ')}
              onChange={(e) => {
                const parts = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                setForm({ ...form, tech: parts.length > 0 ? parts : [''] });
              }}
            />
            <p className="text-[10px] text-slate-400">Pisah dengan koma untuk lebih dari satu</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Link Live Demo</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="https://contoh.web.app"
              value={form.liveUrl ?? ''}
              onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Link GitHub (opsional)</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="https://github.com/username/repo"
              value={form.githubUrl ?? ''}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Gambar Proyek</label>            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
            />
            {(form.image || preview) && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-28 w-full relative">
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                    <span className="text-xs text-slate-500 animate-pulse">Mengupload...</span>
                  </div>
                )}
                <Image src={preview || form.image || ''} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="h-28 w-full bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))
        ) : value.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-sm text-slate-400 bg-white rounded-2xl border border-slate-200">
            Belum ada proyek
          </div>
        ) : (
          value.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="h-28 w-full bg-slate-100 relative">
                {item.image ? (
                  isDataUri(item.image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  ) : (
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    🖼️ Belum ada gambar
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">{item.name}</h3>
                    <p className="text-[10px] font-medium text-red-500 mt-0.5 tracking-wide">
                      {item.category || 'Tanpa kategori'}
                    </p>
                  </div>
                  <div className="flex gap-1.5 ml-2 flex-shrink-0">
                    <button
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                      onClick={() => remove(item)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.desc}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(item.tech || []).map((t, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN CERTIFICATES
   ══════════════════════════════════════════════════════════════ */

function AdminCertificates({
  value,
  onAdd,
  onUpdate,
  onDelete,
  loading,
}: {
  value: Certificate[];
  onAdd: (data: Omit<Certificate, 'id'>) => Promise<void>;
  onUpdate: (item: Certificate) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}) {
  const [editingItem, setEditingItem] = useState<Certificate | null>(null);
  const [form, setForm] = useState<Omit<Certificate, 'id'>>(emptyCertificate());
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const field = (key: keyof Omit<Certificate, 'id'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      setForm((prev) => ({ ...prev, image: compressed }));
      setPreview(compressed);
    } catch (err) {
      console.error('Compress error:', err);
    } finally {
      setUploading(false);
    }
  };

  const startEdit = (item: Certificate) => {
    setEditingItem(item);
    setForm({
      image: item.image,
      title: item.title,
      issuer: item.issuer ?? '',
      year: item.year ?? '',
      description: item.description ?? '',
      credentialId: item.credentialId ?? '',
      status: item.status ?? '',
    });
    setPreview(item.image || null);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setForm(emptyCertificate());
    setPreview(null);
  };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingItem) {
        await onUpdate({ ...form, id: editingItem.id } as Certificate);
      } else {
        const data = { ...form, image: form.image || '/images/certificate-default.png' };
        await onAdd(data);
      }
      cancelEdit();
    } catch (err) {
      console.error('Error saving certificate:', err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: Certificate) => {
    setSaving(true);
    try {
      await onDelete(item.id);
    } catch (err) {
      console.error('Error deleting certificate:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-semibold text-slate-900">
              {editingItem ? '✏️ Edit Sertifikat' : '➕ Tambah Sertifikat'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-full bg-red-500 text-white text-sm px-5 py-2 hover:bg-red-600 shadow-sm disabled:opacity-50"
              onClick={save}
              disabled={saving || uploading}
            >
              {uploading ? 'Mengupload...' : saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            {editingItem && (
              <button
                className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={cancelEdit}
              >
                Batal
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Judul</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Contoh: TensorFlow Developer"
              value={form.title}
              onChange={field('title')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Penerbit</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Contoh: Google / Coursera"
              value={form.issuer ?? ''}
              onChange={field('issuer')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Tahun</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="2024"
              value={form.year ?? ''}
              onChange={field('year')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Credential ID</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Opsional"
              value={form.credentialId ?? ''}
              onChange={field('credentialId')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Status</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Contoh: Issued"
              value={form.status ?? ''}
              onChange={field('status')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Gambar Sertifikat</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="block w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
            />
            {(form.image || preview) && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-28 w-full relative">
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                    <span className="text-xs text-slate-500 animate-pulse">Mengupload...</span>
                  </div>
                )}
                <Image src={preview || form.image || ''} alt="Preview" fill className="object-cover" unoptimized />
              </div>
            )}
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-medium text-slate-500">Deskripsi</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition resize-none h-20"
              placeholder="Ringkasan sertifikat..."
              value={form.description ?? ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 space-y-3">
              <div className="h-28 w-full bg-slate-200 rounded-xl" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))
        ) : value.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-sm text-slate-400 bg-white rounded-2xl border border-slate-200">
            Belum ada sertifikat
          </div>
        ) : (
          value.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
            >
              <div className="h-28 w-full bg-slate-100 relative">
                {item.image ? (
                  isDataUri(item.image) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={400}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                    🖼️ Tidak ada gambar
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              </div>
              <div className="p-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">{item.title}</h3>
                    <p className="text-[10px] font-medium text-red-500 mt-0.5">
                      {item.issuer} • {item.year}
                    </p>
                  </div>
                  <div className="flex gap-1.5 ml-2 flex-shrink-0">
                    <button
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                      onClick={() => startEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                      onClick={() => remove(item)}
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                {item.status && (
                  <span className="mt-2 inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600">
                    {item.status}
                  </span>
                )}
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.description}</p>
                {item.credentialId && (
                  <p className="mt-1 text-[10px] text-slate-400 font-mono">ID: {item.credentialId}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ADMIN TIMELINE
   ══════════════════════════════════════════════════════════════ */

function AdminTimeline({
  value,
  onAdd,
  onUpdate,
  onDelete,
  loading,
}: {
  value: TimelineItem[];
  onAdd: (data: Omit<TimelineItem, 'id'>) => Promise<void>;
  onUpdate: (item: TimelineItem) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}) {
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);
  const [form, setForm] = useState<Omit<TimelineItem, 'id'>>(emptyTimeline());
  const [saving, setSaving] = useState(false);

  const update = (key: 'q' | 'title' | 'desc') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const startEdit = (item: TimelineItem) => {
    setEditingItem(item);
    setForm({ q: item.q, title: item.title, desc: item.desc });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setForm(emptyTimeline());
  };

  const save = async () => {
    if (!form.title.trim()) return;
    setSaving(true);
    try {
      if (editingItem) {
        await onUpdate({ ...form, id: editingItem.id } as TimelineItem);
      } else {
        await onAdd(form);
      }
      cancelEdit();
    } catch (err) {
      console.error('Error saving timeline:', err);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (item: TimelineItem) => {
    setSaving(true);
    try {
      await onDelete(item.id);
    } catch (err) {
      console.error('Error deleting timeline:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-semibold text-slate-900">
              {editingItem ? '✏️ Edit Timeline' : '➕ Tambah Timeline'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-full bg-red-500 text-white text-sm px-5 py-2 hover:bg-red-600 shadow-sm disabled:opacity-50"
              onClick={save}
              disabled={saving}
            >
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
            {editingItem && (
              <button
                className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={cancelEdit}
              >
                Batal
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Quarter</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Contoh: 2026.Q1"
              value={form.q}
              onChange={update('q')}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Title</label>
            <input
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition"
              placeholder="Contoh: Product Launch"
              value={form.title}
              onChange={update('title')}
            />
          </div>
          <div className="md:col-span-2 space-y-1">
            <label className="text-xs font-medium text-slate-500">Deskripsi</label>
            <textarea
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none transition resize-none h-20"
              placeholder="Jelaskan milestone ini..."
              value={form.desc}
              onChange={update('desc')}
            />
          </div>
        </div>
      </section>

      <div className="space-y-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="h-4 bg-slate-200 rounded w-2/3" />
              <div className="h-3 bg-slate-200 rounded w-1/2" />
            </div>
          ))
        ) : value.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-400 bg-white rounded-2xl border border-slate-200">
            Belum ada timeline
          </div>
        ) : (
          value.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl border border-slate-200 bg-white shadow-sm p-4 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-3 flex-1 min-w-0">
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-bold text-red-600">
                      {item.q}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-900 truncate">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.desc}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 ml-3 flex-shrink-0">
                  <button
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                    onClick={() => startEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                    onClick={() => remove(item)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
