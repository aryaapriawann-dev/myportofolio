'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

type TimelineItem = {
  q: string;
  title: string;
  desc: string;
};

type Data = {
  projects: Project[];
  certificates: Certificate[];
  timeline: TimelineItem[];
};

const emptyProject = (): Project => ({
  name: '',
  category: '',
  desc: '',
  tech: [''],
  image: '',
});

const emptyCertificate = (): Certificate => ({
  image: '',
  title: '',
  issuer: '',
  year: '',
  description: '',
  credentialId: '',
  status: '',
});

const emptyTimeline = (): TimelineItem => ({
  q: '',
  title: '',
  desc: '',
});

const defaultData: Data = {
  projects: [],
  certificates: [
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
  ],
  timeline: [
    {
      q: '2025  Present',
      title: 'Awal Perjalanan SOFTVISION',
      desc: 'SOFTVISION berawal dari eksplorasi teknologi modern, pengembangan berbagai proyek perangkat lunak, serta pembelajaran berkelanjutan di bidang Web Development, Mobile Development, Artificial Intelligence, dan Computer Vision sebagai fondasi membangun solusi digital yang bernilai.',
    },
  ],
};

const readSession = <T,>(key: string, fallback: T): T => {
  try {
    const raw = typeof window !== 'undefined' ? window.sessionStorage.getItem(key) : null;
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(err);
    return fallback;
  }
};

const writeSession = <T,>(key: string, value: T) => {
  try {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.error(err);
  }
};

export default function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<'projects' | 'certificates' | 'timeline'>('projects');
  const [projects, setProjects] = useState<Project[]>(() => readSession('admin_projects', defaultData.projects));
  const [certificates, setCertificates] = useState<Certificate[]>(() => readSession('admin_certificates', defaultData.certificates));
  const [timeline, setTimeline] = useState<TimelineItem[]>(() => readSession('admin_timeline', defaultData.timeline));
  const [auth, setAuth] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.cookie.includes('oft_admin=1') : false
  );

  useEffect(() => {
    if (!auth) {
      try {
        router.replace('/admin/login');
      } catch {
        // ignore redirect errors during hydration
      }
    }
  }, [auth, router]);

  const updateProjects = (next: Project[]) => {
    setProjects(next);
    writeSession('admin_projects', next);
  };

  const updateCertificates = (next: Certificate[]) => {
    setCertificates(next);
    writeSession('admin_certificates', next);
  };

  const updateTimeline = (next: TimelineItem[]) => {
    setTimeline(next);
    writeSession('admin_timeline', next);
  };

  const handleLogout = () => {
    if (typeof document !== 'undefined') {
      document.cookie = 'oft_admin=1; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    router.replace('/admin/login');
  };

  if (!auth) return null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200">
        <div>
          <h1 className="text-lg font-bold text-slate-900">OFTVISION Admin</h1>
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
        <div className="flex gap-3 border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-3">
          {(['projects', 'certificates', 'timeline'] as const).map((t, idx) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`pb-3 text-sm font-medium tracking-wide transition-colors ${
                tab === t
                  ? 'text-red-500 border-b-2 border-red-500'
                  : idx === 0
                    ? 'text-slate-500 hover:text-slate-700'
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
              onChange={updateProjects}
              onReload={() => {
                if (typeof window !== 'undefined') window.location.reload();
              }}
            />
          )}
          {tab === 'certificates' && (
            <AdminCertificates
              value={certificates}
              onChange={updateCertificates}
              onReload={() => {
                if (typeof window !== 'undefined') window.location.reload();
              }}
            />
          )}
          {tab === 'timeline' && (
            <AdminTimeline
              value={timeline}
              onChange={updateTimeline}
              onReload={() => {
                if (typeof window !== 'undefined') window.location.reload();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AdminProjects({
  value,
  onChange,
  onReload,
}: {
  value: Project[];
  onChange: (next: Project[]) => void;
  onReload: () => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Project>(() => value[0] || emptyProject());
  const [preview, setPreview] = useState<string | null>(null);

  const startEdit = (item: Project, index: number) => {
    setEditingIndex(index);
    setForm({ ...item });
    setPreview(item.image || null);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result);
      setForm({ ...form, image: result });
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const saveEdit = () => {
    if (editingIndex === null) {
      onChange([...value, { ...form }]);
    } else {
      const next = [...value];
      next[editingIndex] = { ...form };
      onChange(next);
      setEditingIndex(null);
    }
    setForm(emptyProject());
    setPreview(null);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-semibold text-slate-900">
              {editingIndex !== null ? '✏️ Edit Proyek' : '➕ Tambah Proyek'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-full bg-red-500 text-white text-sm px-5 py-2 hover:bg-red-600 shadow-sm"
              onClick={saveEdit}
            >
              Simpan
            </button>
            {editingIndex !== null && (
              <button
                className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => {
                  setEditingIndex(null);
                  setForm(emptyProject());
                  setPreview(null);
                }}
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
              value={(form.tech[0] || '') + (form.tech.slice(1).map(t => ', ' + t).join(''))}
              onChange={(e) => {
                const parts = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                setForm({ ...form, tech: parts });
              }}
            />
            <p className="text-[10px] text-slate-400">Pisah dengan koma untuk lebih dari satu</p>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-500">Gambar Proyek</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-red-50 file:text-red-600 hover:file:bg-red-100"
            />
            {(form.image || preview) && (
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-28 w-full">
                <img
                  src={preview || form.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {value.map((item, index) => (
          <div
            key={index}
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="h-28 w-full bg-slate-100 relative">
              {item.image ? (
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
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
                    onClick={() => startEdit(item, index)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                    onClick={() => remove(index)}
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{item.desc}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {item.tech.map((t, i) => (
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
        ))}
      </div>

      <div className="pb-4">
        <button
          className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-500 hover:border-red-400 hover:text-red-600 transition"
          onClick={onReload}
        >
          🔄 Reload Preview (Refresh Halaman)
        </button>
      </div>
    </div>
  );
}

function AdminCertificates({
  value,
  onChange,
  onReload,
}: {
  value: Certificate[];
  onChange: (next: Certificate[]) => void;
  onReload: () => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<Certificate>(() => value[0] || emptyCertificate());
  const [preview, setPreview] = useState<string | null>(null);

  const field = (key: keyof Certificate) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result);
      setForm({ ...form, image: result });
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
    if (editingIndex === null) {
      onChange([
        ...value,
        {
          ...form,
          image: form.image || '/images/certificate-default.png',
        },
      ]);
    } else {
      const next = [...value];
      next[editingIndex] = { ...form };
      onChange(next);
      setEditingIndex(null);
    }
    setForm(emptyCertificate());
    setPreview(null);
  };

  const startEdit = (item: Certificate, index: number) => {
    setEditingIndex(index);
    setForm({ ...item });
    setPreview(item.image || null);
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-semibold text-slate-900">
              {editingIndex !== null ? '✏️ Edit Sertifikat' : '➕ Tambah Sertifikat'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-full bg-red-500 text-white text-sm px-5 py-2 hover:bg-red-600 shadow-sm"
              onClick={save}
            >
              Simpan
            </button>
            {editingIndex !== null && (
              <button
                className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => {
                  setEditingIndex(null);
                  setForm(emptyCertificate());
                  setPreview(null);
                }}
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
              <div className="mt-2 rounded-xl overflow-hidden border border-slate-200 h-28 w-full">
                <img
                  src={preview || form.image}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
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
        {value.map((item, index) => (
          <div
            key={index}
            className="group rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition"
          >
            <div className="h-28 w-full bg-slate-100 relative">
              {(item.image || '/images/certificate-default.png') ? (
                <Image
                  src={item.image || '/images/certificate-default.png'}
                  alt={item.title}
                  width={400}
                  height={200}
                  className="h-full w-full object-cover"
                />
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
                    onClick={() => startEdit(item, index)}
                  >
                    Edit
                  </button>
                  <button
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                    onClick={() => remove(index)}
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
        ))}
      </div>

      <div className="pb-4">
        <button
          className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-500 hover:border-red-400 hover:text-red-600 transition"
          onClick={onReload}
        >
          🔄 Reload Preview (Refresh Halaman)
        </button>
      </div>
    </div>
  );
}

function AdminTimeline({
  value,
  onChange,
  onReload,
}: {
  value: TimelineItem[];
  onChange: (next: TimelineItem[]) => void;
  onReload: () => void;
}) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState<TimelineItem>(() => value[0] || emptyTimeline());

  const update = (key: 'q' | 'title' | 'desc') => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const save = () => {
    if (editingIndex === null) {
      onChange([...value, { ...form }]);
    } else {
      const next = [...value];
      next[editingIndex] = { ...form };
      onChange(next);
      setEditingIndex(null);
    }
    setForm(emptyTimeline());
  };

  const startEdit = (item: TimelineItem, index: number) => {
    setEditingIndex(index);
    setForm({ ...item });
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="font-semibold text-slate-900">
              {editingIndex !== null ? '✏️ Edit Timeline' : '➕ Tambah Timeline'}
            </h2>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-full bg-red-500 text-white text-sm px-5 py-2 hover:bg-red-600 shadow-sm"
              onClick={save}
            >
              Simpan
            </button>
            {editingIndex !== null && (
              <button
                className="rounded-full border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                onClick={() => {
                  setEditingIndex(null);
                  setForm(emptyTimeline());
                }}
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
        {value.map((item, index) => (
          <div
            key={index}
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
                  onClick={() => startEdit(item, index)}
                >
                  Edit
                </button>
                <button
                  className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-medium hover:bg-red-50 hover:text-red-600 transition"
                  onClick={() => remove(index)}
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pb-4">
        <button
          className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm text-slate-500 hover:border-red-400 hover:text-red-600 transition"
          onClick={onReload}
        >
          🔄 Reload Preview (Refresh Halaman)
        </button>
      </div>
    </div>
  );
}
