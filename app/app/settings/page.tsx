import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Input } from '@/components/ui';
import { ChangePasswordForm } from '@/components/change-password-form';

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, name: true }
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Account Settings</h1>
      <section className="space-y-3 rounded-lg border border-slate-800 bg-slate-900 p-5">
        <div>
          <label className="mb-1 block text-sm text-slate-400">Email</label>
          <Input value={user?.email ?? ''} readOnly />
        </div>
        <div>
          <label className="mb-1 block text-sm text-slate-400">Name</label>
          <Input value={user?.name ?? ''} readOnly />
        </div>
      </section>
      <ChangePasswordForm />
    </div>
  );
}
