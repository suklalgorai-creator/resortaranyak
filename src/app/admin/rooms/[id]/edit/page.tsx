'use client';

import Link from 'next/link';
import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Room = { id: string; name: string; description: string; pricePerNight: number; maxGuests: number; inventoryCount: number; bedType: string; roomSize: string | null; status: string };

export default function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/admin/rooms/${id}`).then(async (response) => {
      const result = await response.json() as { success: boolean; data?: Room; error?: string };
      if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load room');
      setRoom(result.data);
    }).catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load room'));
  }, [id]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!room) return;
    const response = await fetch(`/api/admin/rooms/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: room.name, description: room.description, pricePerNight: room.pricePerNight, maxGuests: room.maxGuests, inventoryCount: room.inventoryCount, bedType: room.bedType, roomSize: room.roomSize, status: room.status }) });
    const result = await response.json() as { success: boolean; error?: string };
    if (!response.ok || !result.success) { setError(result.error || 'Unable to update room'); return; }
    router.push('/admin/rooms');
  }

  if (error) return <p role="alert" className="rounded bg-red-50 p-4 text-red-700">{error}</p>;
  if (!room) return <p>Loading room…</p>;
  return <div className="mx-auto max-w-3xl space-y-6"><div><Link href="/admin/rooms" className="text-sm text-green-700">← Back to rooms</Link><h1 className="mt-3 text-2xl font-bold">Edit room</h1></div><form onSubmit={submit} className="space-y-5 rounded-xl border bg-white p-6 dark:bg-white/5"><label className="block text-sm font-medium">Name<input required maxLength={100} value={room.name} onChange={(e) => setRoom({ ...room, name: e.target.value })} className="mt-1 w-full rounded border p-3" /></label><label className="block text-sm font-medium">Description<textarea required minLength={10} maxLength={5000} value={room.description} onChange={(e) => setRoom({ ...room, description: e.target.value })} className="mt-1 w-full rounded border p-3" rows={5} /></label><div className="grid gap-4 sm:grid-cols-4"><label className="text-sm font-medium">Price<input type="number" min="1" value={room.pricePerNight} onChange={(e) => setRoom({ ...room, pricePerNight: Number(e.target.value) })} className="mt-1 w-full rounded border p-3" /></label><label className="text-sm font-medium">Max guests<input type="number" min="1" max="20" value={room.maxGuests} onChange={(e) => setRoom({ ...room, maxGuests: Number(e.target.value) })} className="mt-1 w-full rounded border p-3" /></label><label className="text-sm font-medium">Inventory<input type="number" min="1" max="100" value={room.inventoryCount} onChange={(e) => setRoom({ ...room, inventoryCount: Number(e.target.value) })} className="mt-1 w-full rounded border p-3" /></label><label className="text-sm font-medium">Status<select value={room.status} onChange={(e) => setRoom({ ...room, status: e.target.value })} className="mt-1 w-full rounded border p-3"><option>AVAILABLE</option><option>MAINTENANCE</option><option>DEACTIVATED</option></select></label></div><button className="rounded-lg bg-green-600 px-5 py-3 text-white">Save changes</button></form></div>;
}
