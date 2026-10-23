'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type DashboardData = {
  stats: { totalBookings: number; confirmedBookings: number; totalRevenue: number; totalRooms: number; totalEnquiries: number };
  recentBookings: Array<{ id: string; bookingCode: string; guestName: string; status: string; totalAmount: number; room: { name: string } }>;
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/dashboard')
      .then(async (response) => {
        const result = await response.json() as { success: boolean; data?: DashboardData; error?: string };
        if (!response.ok || !result.data) throw new Error(result.error || 'Unable to load dashboard');
        setData(result.data);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard'));
  }, []);

  if (error) return <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-700">{error}</p>;
  if (!data) return <p className="text-stone-500">Loading dashboard…</p>;

  const cards = [
    ['Total Bookings', data.stats.totalBookings],
    ['Confirmed Bookings', data.stats.confirmedBookings],
    ['Rooms', data.stats.totalRooms],
    ['Unread Enquiries', data.stats.totalEnquiries],
    ['Confirmed Revenue', `₹${data.stats.totalRevenue.toLocaleString()}`],
  ];

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Dashboard</h1><p className="text-stone-500 mt-1">Live resort operations overview</p></div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">{cards.map(([label, value]) => <div key={String(label)} className="rounded-xl border bg-white p-5 dark:bg-white/5"><p className="text-sm text-stone-500">{label}</p><p className="mt-2 text-2xl font-bold text-stone-800 dark:text-stone-100">{value}</p></div>)}</div>
      <div className="rounded-xl border bg-white dark:bg-white/5 overflow-hidden"><div className="flex items-center justify-between p-5 border-b"><h2 className="font-semibold">Recent bookings</h2><Link href="/admin/bookings" className="text-sm text-green-700">View all</Link></div><div className="overflow-x-auto"><table className="w-full"><thead><tr className="text-left text-xs uppercase text-stone-500"><th className="p-4">Reference</th><th className="p-4">Guest</th><th className="p-4">Room</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead><tbody>{data.recentBookings.map((booking) => <tr key={booking.id} className="border-t"><td className="p-4 font-mono text-sm">{booking.bookingCode}</td><td className="p-4">{booking.guestName}</td><td className="p-4">{booking.room.name}</td><td className="p-4">₹{booking.totalAmount.toLocaleString()}</td><td className="p-4">{booking.status}</td></tr>)}</tbody></table></div></div>
    </div>
  );
}
