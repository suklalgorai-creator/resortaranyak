'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddRoomPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', description: '', pricePerNight: '2500', maxGuests: '2', inventoryCount: '1', bedType: 'King Bed', roomSize: '', status: 'AVAILABLE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/rooms', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, pricePerNight: Number(form.pricePerNight), maxGuests: Number(form.maxGuests), inventoryCount: Number(form.inventoryCount), images: [], amenities: [] }) });
      const result = await response.json() as { success: boolean; error?: string };
      if (!response.ok || !result.success) throw new Error(result.error || 'Unable to create room');
      router.push('/admin/rooms');
    } catch (submitError) { setError(submitError instanceof Error ? submitError.message : 'Unable to create room'); setLoading(false); }
  }

  return <div className="mx-auto max-w-3xl space-y-6"><div><Link href="/admin/rooms" className="text-sm text-green-700">← Back to rooms</Link><h1 className="mt-3 text-2xl font-bold">Add room</h1></div><form onSubmit={submit} className="space-y-5 rounded-xl border bg-white p-6 dark:bg-white/5">{error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}<label className="block text-sm font-medium">Name<input required maxLength={100} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded border p-3" /></label><label className="block text-sm font-medium">Description<textarea required minLength={10} maxLength={5000} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1 w-full rounded border p-3" rows={5} /></label><div className="grid gap-4 sm:grid-cols-4">{[['pricePerNight','Price'],['maxGuests','Max guests'],['inventoryCount','Inventory']].map(([key,label]) => <label key={key} className="block text-sm font-medium">{label}<input required type="number" min="1" value={form[key as keyof typeof form]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full rounded border p-3" /></label>)}<label className="block text-sm font-medium">Bed type<input required maxLength={50} value={form.bedType} onChange={(e) => setForm({ ...form, bedType: e.target.value })} className="mt-1 w-full rounded border p-3" /></label></div><button disabled={loading} className="rounded-lg bg-green-600 px-5 py-3 font-medium text-white disabled:opacity-50">{loading ? 'Saving…' : 'Save room'}</button></form></div>;
}
