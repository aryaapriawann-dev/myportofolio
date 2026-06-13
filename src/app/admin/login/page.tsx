'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/app/components/ui/Button';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const router = useRouter();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const envPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const ok =
      typeof envPassword === 'string' && envPassword.length > 0 && password === envPassword;
    if (ok) {
      document.cookie = 'oft_admin=1; path=/; max-age=86400';
      router.push('/admin');
    } else {
      alert('Password salah');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-xl px-4 py-2"
        />
        <Button type="submit" className="w-full">Masuk</Button>
      </form>
    </div>
  );
}
