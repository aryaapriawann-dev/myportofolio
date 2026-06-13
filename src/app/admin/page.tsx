'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanel from '@/app/components/admin/AdminPanel';

export default function AdminPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState<boolean>(() =>
    typeof document !== 'undefined' ? document.cookie.includes('oft_admin=1') : false
  );

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!authed) {
      try {
        router.replace('/admin/login');
      } catch {
        // ignore hydration/transition errors
      }
    }
  }, [authed, router]);

  if (!ready || !authed) return null;
  return <AdminPanel />;
}
