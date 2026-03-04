'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';

export function ChangePasswordForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setMessage(null);

    const response = await fetch('/api/account/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword')
      })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? 'Unable to change password');
      return;
    }

    setMessage('Password changed successfully.');
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-5">
      <h2 className="text-lg font-semibold">Change password</h2>
      <Input type="password" name="currentPassword" required placeholder="Current password" />
      <Input type="password" name="newPassword" required minLength={8} placeholder="New password" />
      {error && <p className="text-sm text-red-400">{error}</p>}
      {message && <p className="text-sm text-emerald-400">{message}</p>}
      <Button disabled={loading} type="submit">
        {loading ? 'Saving...' : 'Update password'}
      </Button>
    </form>
  );
}
