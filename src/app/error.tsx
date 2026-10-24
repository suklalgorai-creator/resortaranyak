'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Unhandled application error', error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4 dark:bg-[#101713]">
      <section className="w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-white/[0.06]">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Resort Arranyak</p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-forest dark:text-stone-100">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600 dark:text-stone-300">Please try again. If the issue continues, contact the resort team directly.</p>
        <button type="button" onClick={() => reset()} className="mt-7 rounded-xl bg-forest px-5 py-3 text-sm font-bold text-white transition hover:bg-forest/90">Try again</button>
      </section>
    </main>
  );
}
