'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type Room = { id: string; name: string; slug: string; pricePerNight: number; maxGuests: number; inventoryCount: number; status: string; images: string[] };

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState('');

  async function load() {
    const response = await fetch('/api/admin/rooms');
    const result = await response.json() as { success: boolean; data?: Room[]; error?: string };
    if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load rooms');
    setRooms(result.data);
  }

  useEffect(() => {
    let cancelled = false;
    fetch('/api/admin/rooms')
      .then(async (response) => {
        const result = await response.json() as { success: boolean; data?: Room[]; error?: string };
        if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load rooms');
        if (!cancelled) setRooms(result.data);
      })
      .catch((loadError) => { if (!cancelled) setError(loadError instanceof Error ? loadError.message : 'Unable to load rooms'); });
    return () => { cancelled = true; };
  }, []);

  async function deactivate(id: string) {
    if (!window.confirm('Deactivate this room? Existing confirmed bookings are not changed.')) return;
    const response = await fetch(`/api/admin/rooms/${id}`, { method: 'DELETE' });
    const result = await response.json() as { success: boolean; error?: string };
    if (!response.ok || !result.success) throw new Error(result.error || 'Unable to deactivate room');
    await load();
  }

  return <div className="space-y-6"><div className="flex items-center justify-between"><div><h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Room Management</h1><p className="text-stone-500 mt-1">Manage live rooms, pricing, capacity, and inventory</p></div><Link href="/admin/rooms/new" className="rounded-lg bg-green-600 px-4 py-2 text-white">Add room</Link></div>{error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>}<div className="rounded-xl border bg-white dark:bg-white/5 overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs uppercase text-stone-500"><th className="p-4">Room</th><th className="p-4">Price</th><th className="p-4">Capacity</th><th className="p-4">Inventory</th><th className="p-4">Status</th><th className="p-4">Actions</th></tr></thead><tbody>{rooms.map((room) => <tr key={room.id} className="border-t"><td className="p-4 font-medium">{room.name}</td><td className="p-4">₹{room.pricePerNight.toLocaleString()}</td><td className="p-4">{room.maxGuests}</td><td className="p-4">{room.inventoryCount}</td><td className="p-4">{room.status}</td><td className="p-4"><div className="flex gap-2"><Link href={`/admin/rooms/${room.id}/edit`} className="rounded border px-3 py-1 text-sm">Edit</Link>{room.status !== 'DEACTIVATED' && <button onClick={() => deactivate(room.id).catch((deleteError) => setError(deleteError instanceof Error ? deleteError.message : 'Unable to deactivate room'))} className="rounded bg-red-600 px-3 py-1 text-sm text-white">Deactivate</button>}</div></td></tr>)}</tbody></table></div></div>;
}
