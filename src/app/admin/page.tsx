'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from '@/app/components/admin/AdminPanel';
import FloatingLines3D from '@/app/components/backgrounds/FloatingLines3D';

export default function AdminPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const isAuth = document.cookie.includes('oft_admin=1');
    setAuthed(isAuth);
    if (!isAuth) {
      router.replace('/admin/login');
    }
  }, [router]);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center text-neutral-500">
        Mengalihkan ke halaman login...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      <FloatingLines3D />
      <div className="relative z-10">
        <AdminPanel />
      </div>
    </div>
  );
}
