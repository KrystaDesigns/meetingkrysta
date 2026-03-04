'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui';

export function SignOutButton() {
  return (
    <Button
      className="bg-slate-800 hover:bg-slate-700"
      onClick={() => signOut({ callbackUrl: '/login' })}
    >
      Sign out
    </Button>
  );
}
