import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="container-page py-20">
      <section className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-10">
        <p className="mb-3 text-sm font-medium text-brand">EchoMeet</p>
        <h1 className="max-w-2xl text-4xl font-semibold leading-tight">
          Capture every meeting and turn conversations into actionable outcomes.
        </h1>
        <p className="mt-4 max-w-2xl text-slate-300">
          Upload recordings, generate AI transcripts and summaries, and search every key decision across your meetings.
        </p>
        <div className="mt-8 flex gap-3">
          <Link href="/register" className="rounded-md bg-brand px-4 py-2 font-medium hover:bg-brand-dark">
            Sign up
          </Link>
          <Link href="/login" className="rounded-md border border-slate-700 px-4 py-2 font-medium hover:bg-slate-900">
            Log in
          </Link>
        </div>
      </section>
      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {[
          'Upload audio/video meeting recordings.',
          'Get transcript, summary, key takeaways, and action items.',
          'Search across titles, summaries, and transcript text.'
        ].map((feature) => (
          <div key={feature} className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-slate-200">
            {feature}
          </div>
        ))}
      </section>
    </main>
  );
}
