import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { SignOutButton } from '@/components/sign-out-button';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-800 bg-slate-950/80">
        <div className="container-page flex items-center justify-between py-4">
          <Link href="/app" className="font-semibold text-white">
            EchoMeet
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/app">Meetings</Link>
            <Link href="/app/meetings/new">New Meeting</Link>
            <Link href="/app/settings">Settings</Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
