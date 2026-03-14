import { hash } from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const DEFAULT_EMAIL = process.env.DEFAULT_ACCOUNT_EMAIL || 'demo@echomeet.local';
const DEFAULT_PASSWORD = process.env.DEFAULT_ACCOUNT_PASSWORD || 'EchoMeetDemo123!';
const DEFAULT_NAME = process.env.DEFAULT_ACCOUNT_NAME || 'EchoMeet Demo';

let ensured = false;

export async function ensureDefaultAccount() {
  if (ensured) return;

  const existing = await prisma.user.findUnique({ where: { email: DEFAULT_EMAIL } });
  if (!existing) {
    const passwordHash = await hash(DEFAULT_PASSWORD, 12);
    await prisma.user.create({
      data: {
        name: DEFAULT_NAME,
        email: DEFAULT_EMAIL,
        passwordHash
      }
    });
  }

  ensured = true;
}

export const defaultAccountCredentials = {
  email: DEFAULT_EMAIL,
  password: DEFAULT_PASSWORD
};
