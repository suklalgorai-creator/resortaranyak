'use client';

import { useState } from 'react';

const allBookings = [
  { id: 'BK001', guest: 'Rahul Sharma', email: 'rahul@gmail.com', phone: '+91-9876543210', room: 'Deluxe Cottage', checkIn: '2026-09-10', checkOut: '2026-09-12', guests: 2, amount: 7000, status: 'Confirmed', paymentStatus: 'Paid' },
  { id: 'BK002', guest: 'Priya Patel', email: 'priya@gmail.com', phone: '+91-9123456789', room: 'Nature View Room', checkIn: '2026-09-11', checkOut: '2026-09-14', guests: 3, amount: 10500, status: 'Pending', paymentStatus: 'Awaiting' },
  { id: 'BK003', guest: 'Amit Kumar', email: 'amit@gmail.com', phone: '+91-8765432109', room: 'Family Suite', checkIn: '2026-09-15', checkOut: '2026-09-17', guests: 5, amount: 9000, status: 'Confirmed', paymentStatus: 'Paid' },
  { id: 'BK004', guest: 'Sunita Devi', email: 'sunita@gmail.com', phone: '+91-7654321098', room: 'Deluxe Cottage', checkIn: '2026-09-16', checkOut: '2026-09-18', guests: 2, amount: 7000, status: 'Cancelled', paymentStatus: 'Refunded' },
  { id: 'BK005', guest: 'Vikash Singh', email: 'vikash@gmail.com', phone: '+91-6543210987', room: 'Nature View Room', checkIn: '2026-09-20', checkOut: '2026-09-22', guests: 4, amount: 7000, status: 'Pending', paymentStatus: 'Awaiting' },
  { id: 'BK006', guest: 'Meena Kumari', email: 'meena@gmail.com', phone: '+91-5432109876', room: 'Family Suite', checkIn: '2026-09-25', checkOut: '2026-09-28', guests: 6, amount: 13500, status: 'Confirmed', paymentStatus: 'Paid' },
];

const statusColors: Record<string, string> = {
  Confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

const paymentColors: Record<string, string> = {
  Paid: 'text-green-600 dark:text-green-400',
  Awaiting: 'text-amber-600 dark:text-amber-400',
  Refunded: 'text-red-600 dark:text-red-400',
};

type FilterType = 'All' | 'Confirmed' | 'Pending' | 'Cancelled';

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState<FilterType>('All');
  const filters: FilterType[] = ['All', 'Confirmed', 'Pending', 'Cancelled'];

  const filtered = filter === 'All' ? allBookings : allBookings.filter(b => b.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Bookings</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Manage all resort bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-green-600 text-white'
                : 'bg-white glass-card text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/10 border border-stone-200 dark:border-white/5'
            }`}}
          >
            {f} {f !== 'All' && ({allBookings.filter(b => b.status === f).length})}
          </button>
        ))}
      </div>

      {/* Bookings Table */}
      <div className="bg-white glass-card rounded-xl border border-stone-200 dark:border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 dark:border-white/5 bg-stone-50 dark:bg-white/[0.02]">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">ID</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Guest</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden md:table-cell">Room</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden lg:table-cell">Dates</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Amount</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden md:table-cell">Payment</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => (
                <tr key={b.id} className="border-b border-stone-50 dark:border-white/5 hover:bg-stone-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="p-4 text-sm font-mono text-stone-500 dark:text-stone-400">{b.id}</td>
                  <td className="p-4">
                    <p className="font-medium text-sm text-stone-800 dark:text-stone-200">{b.guest}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400">{b.phone}</p>
                  </td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-400 hidden md:table-cell">{b.room}</td>
                  <td className="p-4 text-xs text-stone-600 dark:text-stone-400 hidden lg:table-cell">{b.checkIn} ? {b.checkOut}</td>
                  <td className="p-4 text-sm font-semibold text-stone-800 dark:text-stone-200">?{b.amount.toLocaleString()}</td>
                  <td className={`p-4 text-sm font-medium hidden md:table-cell ${paymentColors[b.paymentStatus]}`}>{b.paymentStatus}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[b.status]}`}>{b.status}</span>
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
