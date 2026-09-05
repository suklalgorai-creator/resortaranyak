'use client';

import Link from 'next/link';
import { featuredRooms } from '@/lib/data';

export default function AdminRoomsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Room Management</h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">Manage your resort rooms and pricing</p>
        </div>
        <Link
          href="/admin/rooms/new"
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors text-sm"
        >
          ? Add New Room
        </Link>
      </div>

      {/* Rooms Table */}
      <div className="bg-white glass-card rounded-xl border border-stone-200 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 dark:border-white/5 bg-stone-50 dark:bg-white/[0.02]">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Room</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden md:table-cell">Type</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Price</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden lg:table-cell">Capacity</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Status</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {featuredRooms.map((room) => (
                <tr key={room.id} className="border-b border-stone-50 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={room.image} alt={room.name} className="w-14 h-14 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-stone-800 dark:text-stone-200 text-sm">{room.name}</p>
                        <p className="text-xs text-stone-500 dark:text-stone-400">{room.bedType}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-400 hidden md:table-cell">Cottage</td>
                  <td className="p-4 text-sm font-semibold text-gold">?{room.price.toLocaleString()}/night</td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-400 hidden lg:table-cell">{room.capacity} guests</td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">Active</span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-white/10 transition-colors">Edit</button>
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
