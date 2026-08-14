'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Eye, EyeOff, Lock, ShieldCheck } from 'lucide-react';

/* ── Canvas meteor background ───────────────────────── */
function MeteorCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    type Meteor = {
      x: number; y: number;
      len: number; speed: number;
      opacity: number; thickness: number;
      color: [number, number, number];
      colorB: [number, number, number];
    };

    const FIRE_HEAD: [number,number,number] = [255, 200, 50];
    const FIRE_MID:  [number,number,number] = [255, 80, 10];
    const FIRE_TAIL: [number,number,number] = [180, 20, 0];
    const RED:       [number,number,number] = [220, 38, 38];

    const ANGLE = 55 * Math.PI / 180;
    const COS_A = Math.cos(ANGLE);
    const SIN_A = Math.sin(ANGLE);

    const randomFireColor = () => {
      const r = Math.random();
      if (r < 0.45) return { color: FIRE_HEAD, colorB: FIRE_MID };
      if (r < 0.75) return { color: FIRE_MID,  colorB: FIRE_TAIL };
      return               { color: RED,        colorB: FIRE_TAIL };
    };

    const createMeteor = (randomPos = false): Meteor => {
      const fc = randomFireColor();
      const m: Meteor = {
        x: 0, y: 0,
        len:      120 + Math.random() * 250,
        speed:    1.2 + Math.random() * 2.5,
        opacity:  0.5 + Math.random() * 0.5,
        thickness: 1.5 + Math.random() * 2.5,
        color: fc.color, colorB: fc.colorB,
      };
      if (randomPos) {
        m.x = Math.random() * canvas.width;
        m.y = Math.random() * canvas.height;
      } else {
        if (Math.random() < 0.6) {
          m.y = canvas.height + 20;
          m.x = Math.random() * (canvas.width + 200) - 200;
        } else {
          m.x = -20;
          m.y = Math.random() * (canvas.height + 100) - 50;
        }
      }
      return m;
    };

    let meteors: Meteor[] = [];
    const COUNT = 55;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      if (meteors.length === 0)
        meteors = Array.from({ length: COUNT }, () => createMeteor(true));
    };
    resize();
    window.addEventListener('resize', resize);

    let animId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // subtle grid
      ctx.strokeStyle = 'rgba(255,255,255,0.018)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 80)  { ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); }
      for (let y = 0; y < canvas.height; y += 80) { ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); }
      ctx.stroke();

      for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        m.x += m.speed * COS_A;
        m.y -= m.speed * SIN_A;

        const dx = m.len * COS_A, dy = -m.len * SIN_A;
        const tx = m.x - dx, ty = m.y - dy;

        if (ty < -20 || tx > canvas.width + 20) {
          meteors[i] = createMeteor(false);
          continue;
        }

        // tail → head fire gradient
        const grad = ctx.createLinearGradient(tx, ty, m.x, m.y);
        grad.addColorStop(0,   `rgba(${m.colorB[0]},${m.colorB[1]},${m.colorB[2]},0)`);
        grad.addColorStop(0.4, `rgba(${m.colorB[0]},${m.colorB[1]},${m.colorB[2]},${m.opacity * 0.4})`);
        grad.addColorStop(1,   `rgba(${m.color[0]},${m.color[1]},${m.color[2]},${m.opacity})`);

        ctx.save();
        ctx.shadowColor = `rgba(${m.color[0]},${m.color[1]},${m.color[2]},0.55)`;
        ctx.shadowBlur  = 14;
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = m.thickness;
        ctx.lineCap     = 'round';
        ctx.stroke();
        ctx.restore();

        // bright head
        ctx.save();
        ctx.shadowColor = 'rgba(255,220,80,0.9)';
        ctx.shadowBlur  = 20;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.thickness * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${FIRE_HEAD[0]},${FIRE_HEAD[1]},${FIRE_HEAD[2]},${m.opacity})`;
        ctx.fill();
        ctx.restore();

        // random sparks
        if (Math.random() < 0.12) {
          const ex = m.x + (Math.random() - 0.5) * 7;
          const ey = m.y + (Math.random() - 0.5) * 7;
          ctx.save();
          ctx.shadowColor = 'rgba(255,130,0,0.8)';
          ctx.shadowBlur  = 6;
          ctx.beginPath();
          ctx.arc(ex, ey, Math.random() * 1.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,${80 + Math.floor(Math.random() * 120)},0,${0.5 + Math.random() * 0.5})`;
          ctx.fill();
          ctx.restore();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0, pointerEvents: 'none' }}
    />
  );
}

/* ── Main Login Page ─────────────────────────────────── */
export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // small delay for feel
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const ok = typeof envPassword === 'string' && envPassword.length > 0 && password === envPassword;
    if (ok) {
      document.cookie = 'oft_admin=1; path=/; max-age=86400';
      router.push('/admin');
    } else {
      setError('Password salah. Coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#09090b] flex items-center justify-center p-6 overflow-hidden">

      {/* Meteor background */}
      <MeteorCanvas />

      {/* Radial glow center */}
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center" style={{ zIndex: 1 }}>
        <div className="h-[500px] w-[500px] rounded-full bg-red-600/10 blur-[120px]" />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
        style={{ zIndex: 10 }}
      >
        {/* Glow ring behind card */}
        <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-red-500/30 via-transparent to-orange-500/10 blur-sm" />

        <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl shadow-2xl shadow-black/60 p-8 md:p-10 space-y-8">

          {/* Logo + brand */}
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ rotateY: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ perspective: 800 }}
            >
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-red-500/30 blur-xl scale-110" />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/5 shadow-lg shadow-black/40 backdrop-blur">
                  <Image
                    src="/images/mentah-logo-softvesion.png"
                    alt="SOFTVISION"
                    width={52}
                    height={52}
                    className="drop-shadow-[0_0_12px_rgba(220,38,38,0.6)]"
                  />
                </div>
              </div>
            </motion.div>

            <div className="text-center">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-lg font-bold tracking-widest text-white"
              >
                SOFTVISION
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="font-label text-[9px] uppercase tracking-[0.3em] text-zinc-500 mt-0.5"
              >
                Admin Portal
              </motion.p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="font-label text-[9px] font-bold uppercase tracking-widest text-zinc-400 mb-2 block">
                Password
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500">
                  <Lock size={15} />
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Masukkan password admin"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-10 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 backdrop-blur"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-xs text-red-400 font-medium"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              disabled={loading || !password}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-5 py-3 text-sm font-bold tracking-widest text-white shadow-lg shadow-red-900/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* shine effect */}
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-700" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    Masuk ke Admin
                  </>
                )}
              </span>
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center font-label text-[9px] uppercase tracking-widest text-zinc-700">
            SOFTVISION © {new Date().getFullYear()} · Akses Terbatas
          </p>
        </div>
      </motion.div>
    </div>
  );
}
