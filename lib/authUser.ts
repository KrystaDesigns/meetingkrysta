import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ensureDefaultAccount, defaultAccountCredentials } from '@/lib/defaultAccount';
import { prisma } from '@/lib/prisma';

export async function getEffectiveUserId() {
  const session = await getServerSession(authOptions);
  if (session?.user?.id) return session.user.id;

  await ensureDefaultAccount();
  const user = await prisma.user.findUnique({ where: { email: defaultAccountCredentials.email } });
  if (!user) throw new Error('Default account not found');
  return user.id;
}
