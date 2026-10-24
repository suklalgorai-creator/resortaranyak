'use client';

import { useEffect, useState } from 'react';
import { Check, Filter, Mail, MessageCircle, Phone } from 'lucide-react';

type Enquiry = { id: string; name: string; email: string; phone: string | null; message: string; status: string; createdAt: string };

function statusClass(status: string) {
  if (status === 'READ' || status === 'REPLIED') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300';
  return 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300';
}

function statusLabel(status: string) {
  return status.toLowerCase().replaceAll('_', ' ');
}

function whatsappNumber(phone: string) {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
}

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState(() => typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('status') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load(nextFilter = filter) {
    setLoading(true);
    try {
      const query = nextFilter ? `?status=${encodeURIComponent(nextFilter)}` : '';
      const response = await fetch(`/api/admin/enquiries${query}`);
      const result = await response.json() as { success: boolean; data?: { data: Enquiry[] }; error?: string };
      if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load enquiries');
      setItems(result.data.data);
      setError('');
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load enquiries');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(filter); }, [filter]);

  async function markAsRead(id: string) {
    const response = await fetch('/api/admin/enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const result = await response.json() as { success: boolean; error?: string };
    if (!response.ok || !result.success) throw new Error(result.error || 'Unable to update enquiry');
    await load();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Guest communication</p><h1 className="mt-2 text-2xl font-bold text-stone-800 dark:text-stone-100 lg:text-3xl">Enquiries</h1><p className="mt-1 text-stone-500">Read, respond to, and track contact submissions.</p></div><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-stone-400" /><select aria-label="Filter enquiries" value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-gold dark:border-white/10 dark:bg-white/5 dark:text-stone-200"><option value="">All enquiries</option><option value="UNREAD">Unread</option><option value="READ">Read</option><option value="REPLIED">Replied</option></select></div></div>
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p>}
      {loading && <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500 dark:border-white/15">Loading enquiries…</p>}
      {!loading && items.length === 0 && !error && <div className="rounded-2xl border border-dashed border-stone-300 p-12 text-center dark:border-white/15"><MessageCircle className="mx-auto h-8 w-8 text-stone-400" /><p className="mt-3 font-semibold text-stone-700 dark:text-stone-200">No enquiries found</p><p className="mt-1 text-sm text-stone-500">Try another status filter or wait for a new message.</p></div>}
      <div className="space-y-4">{items.map((enquiry) => <article key={enquiry.id} className={`rounded-2xl border bg-white p-5 shadow-sm dark:bg-white/[0.04] sm:p-6 ${enquiry.status === 'UNREAD' ? 'border-gold/70' : 'border-stone-200 dark:border-white/10'}`}><div className="flex flex-col gap-5 lg:flex-row lg:justify-between"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">{enquiry.name}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass(enquiry.status)}`}>{statusLabel(enquiry.status)}</span></div><p className="mt-1 text-xs text-stone-500">Received {new Date(enquiry.createdAt).toLocaleString()}</p><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-stone-700 dark:text-stone-300">{enquiry.message}</p><div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-500"><a href={`mailto:${enquiry.email}`} className="inline-flex items-center gap-1.5 hover:text-gold"><Mail className="h-4 w-4" /> {enquiry.email}</a>{enquiry.phone && <a href={`tel:${enquiry.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold"><Phone className="h-4 w-4" /> {enquiry.phone}</a>}</div></div><div className="flex shrink-0 flex-wrap gap-2 lg:w-44 lg:flex-col">{enquiry.status === 'UNREAD' && <button onClick={() => markAsRead(enquiry.id).catch((updateError) => setError(updateError instanceof Error ? updateError.message : 'Unable to update enquiry'))} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-900"><Check className="h-4 w-4" /> Mark read</button>}<a href={`mailto:${enquiry.email}?subject=${encodeURIComponent('Resort Arranyak enquiry')}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-bold text-stone-700 transition hover:border-gold hover:text-gold dark:border-white/10 dark:text-stone-200"><Mail className="h-4 w-4" /> Email</a>{enquiry.phone && <a target="_blank" rel="noopener noreferrer" href={`https://wa.me/${whatsappNumber(enquiry.phone)}?text=${encodeURIComponent(`Hello ${enquiry.name}, thank you for contacting Resort Arranyak.`)}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-400/20 dark:text-emerald-300 dark:hover:bg-emerald-400/10"><MessageCircle className="h-4 w-4" /> WhatsApp</a>}</div></div></article>)}</div>
    </div>
  );
}
