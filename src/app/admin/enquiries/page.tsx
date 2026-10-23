'use client';

import { useEffect, useState } from 'react';

type Enquiry = { id: string; name: string; email: string; phone: string | null; message: string; status: string; createdAt: string };

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [error, setError] = useState('');

  async function load() {
    const response = await fetch('/api/admin/enquiries');
    const result = await response.json() as { success: boolean; data?: { data: Enquiry[] }; error?: string };
    if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load enquiries');
    setItems(result.data.data);
  }

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/enquiries')
      .then(async (response) => {
        const result = await response.json() as { success: boolean; data?: { data: Enquiry[] }; error?: string };
        if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load enquiries');
        if (!cancelled) setItems(result.data.data);
      })
      .catch((loadError) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load enquiries'); });
    return () => { cancelled = true; };
  }, []);

  async function markAsRead(id: string) {
    const response = await fetch('/api/admin/enquiries', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    const result = await response.json() as { success: boolean; error?: string };
    if (!response.ok || !result.success) throw new Error(result.error || 'Unable to update enquiry');
    await load();
  }

  return <div className="space-y-6"><div><h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Enquiries</h1><p className="text-stone-500 mt-1">Live contact submissions</p></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}<div className="space-y-4">{items.map((enquiry) => <article key={enquiry.id} className={`rounded-xl border bg-white p-6 dark:bg-white/5 ${enquiry.status === 'UNREAD' ? 'border-gold' : ''}`}><div className="flex flex-col gap-4 sm:flex-row sm:justify-between"><div><h2 className="text-lg font-bold">{enquiry.name} {enquiry.status === 'UNREAD' && <span className="ml-2 rounded bg-gold px-2 py-1 text-xs">New</span>}</h2><p className="mt-3 whitespace-pre-wrap text-stone-700 dark:text-stone-300">{enquiry.message}</p><p className="mt-4 text-sm text-stone-500">{enquiry.email}{enquiry.phone ? ` · ${enquiry.phone}` : ''} · {new Date(enquiry.createdAt).toLocaleString()}</p></div>{enquiry.status === 'UNREAD' && <button onClick={() => markAsRead(enquiry.id).catch((updateError) => setError(updateError instanceof Error ? updateError.message : 'Unable to update enquiry'))} className="h-fit rounded-lg border px-4 py-2 text-sm">Mark as read</button>}</div></article>)}</div></div>;
}
