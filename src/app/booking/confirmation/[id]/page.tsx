import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock3, Phone } from 'lucide-react';
import { siteConfig } from '@/config/site';

export default async function BookingConfirmationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-amber-50/40 px-4 pb-24 pt-32 dark:from-[#101713] dark:via-[#17251e] dark:to-[#101713]">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-lg shadow-emerald-900/10 dark:bg-emerald-400/15 dark:text-emerald-300"><CheckCircle2 className="h-11 w-11" /></div>
        <p className="mt-7 text-xs font-bold uppercase tracking-[0.24em] text-gold">Thank you for choosing Arranyak</p>
        <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-forest dark:text-stone-100 sm:text-5xl">Request received</h1>
        <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-stone-600 dark:text-stone-300">Your stay request is safely with our team. We will review availability and contact you to confirm the details.</p>

        <section className="mt-9 rounded-3xl border border-stone-200/80 bg-white/90 p-6 text-left shadow-[0_24px_80px_-35px_rgba(23,58,42,0.45)] backdrop-blur sm:p-8 dark:border-white/10 dark:bg-white/[0.06]" aria-label="Booking request details">
          <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-5 dark:border-white/10"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-stone-400">Request reference</p><p className="mt-2 break-all font-mono text-lg font-semibold text-forest dark:text-stone-100">{id}</p></div><div className="rounded-2xl bg-gold/10 p-3 text-gold"><Clock3 className="h-6 w-6" /></div></div>
          <div className="mt-6 space-y-4 text-sm text-stone-600 dark:text-stone-300"><div className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /><span>Our team will check the selected room and dates.</span></div><div className="flex gap-3"><Phone className="h-5 w-5 shrink-0 text-gold" /><span>We will contact you on the phone number shared in the request.</span></div><div className="flex gap-3"><CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" /><span>No payment is required until your stay is confirmed.</span></div></div>
          <div className="mt-7 rounded-2xl bg-stone-50 p-4 text-sm text-stone-600 dark:bg-white/5 dark:text-stone-300">Need an update? Call us at <a className="font-semibold text-forest hover:text-gold dark:text-gold" href={`tel:${siteConfig.links.phone.split(',')[0].replace(/[^0-9+]/g, '')}`}>{siteConfig.links.phone.split(',')[0]}</a>.</div>
        </section>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><Link href="/" className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-6 py-3.5 font-semibold text-white transition hover:bg-forest/90">Back to home <ArrowRight className="h-4 w-4" /></Link><Link href="/rooms" className="inline-flex items-center justify-center rounded-xl border border-stone-300 px-6 py-3.5 font-semibold text-stone-700 transition hover:border-gold hover:text-gold dark:border-white/15 dark:text-stone-200">Explore rooms</Link></div>
      </div>
    </main>
  );
}
