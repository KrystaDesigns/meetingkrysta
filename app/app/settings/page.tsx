import { prisma } from '@/lib/prisma';
import { getEffectiveUserId } from '@/lib/authUser';
import { Input } from '@/components/ui';
import { ChangePasswordForm } from '@/components/change-password-form';

export default async function SettingsPage() {
  const userId = await getEffectiveUserId();

  const user = await prisma.user.findUnique({
    where: { id: userId },
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
