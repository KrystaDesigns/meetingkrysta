import Link from 'next/link';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
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
          </nav>
        </div>
      </header>
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
