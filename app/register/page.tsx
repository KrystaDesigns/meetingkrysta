'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { Button, Input } from '@/components/ui';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setError(null);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password')
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setLoading(false);
      setError(data.error ?? 'Registration failed');
      return;
    }

    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false
    });

    setLoading(false);
    router.push('/app');
    router.refresh();
  }

  return (
    <main className="container-page flex min-h-screen items-center py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <Input type="text" name="name" placeholder="Your name" />
        <Input type="email" name="email" required placeholder="you@company.com" />
        <Input type="password" name="password" required minLength={8} placeholder="At least 8 characters" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? 'Creating account...' : 'Sign up'}
        </Button>
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link className="text-brand" href="/login">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
