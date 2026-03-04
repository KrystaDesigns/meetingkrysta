'use client';

import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
      return;
    }

    router.push('/app');
    router.refresh();
  }

  return (
    <main className="container-page flex min-h-screen items-center py-10">
      <form onSubmit={onSubmit} className="w-full max-w-md space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-semibold">Log in</h1>
        <Input type="email" name="email" required placeholder="you@company.com" />
        <Input type="password" name="password" required placeholder="Your password" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button disabled={loading} type="submit" className="w-full">
          {loading ? 'Logging in...' : 'Log in'}
        </Button>
        <p className="text-sm text-slate-400">
          No account?{' '}
          <Link className="text-brand" href="/register">
            Create one
          </Link>
        </p>
      </form>
    </main>
  );
}
