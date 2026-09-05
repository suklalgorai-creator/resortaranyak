'use client';

import { CalendarDays, IndianRupee, MessageSquare, Hotel, Plus, Camera } from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Total Bookings', value: '156', change: '+12%', icon: CalendarDays, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' },
  { label: 'Revenue', value: '\u20B92,45,000', change: '+8%', icon: IndianRupee, color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' },
  { label: 'Pending Enquiries', value: '23', change: '+5', icon: MessageSquare, color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' },
  { label: 'Occupancy Rate', value: '78%', change: '+3%', icon: Hotel, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400' },
];

const recentBookings = [
  { id: 'BK001', guest: 'Rahul Sharma', room: 'Deluxe Cottage', checkIn: '2026-09-10', checkOut: '2026-09-12', amount: '\u20B97,000', status: 'Confirmed' },
  { id: 'BK002', guest: 'Priya Patel', room: 'Nature View Room', checkIn: '2026-09-11', checkOut: '2026-09-14', amount: '\u20B910,500', status: 'Pending' },
  { id: 'BK003', guest: 'Amit Kumar', room: 'Family Suite', checkIn: '2026-09-15', checkOut: '2026-09-17', amount: '\u20B99,000', status: 'Confirmed' },
  { id: 'BK004', guest: 'Sunita Devi', room: 'Deluxe Cottage', checkIn: '2026-09-16', checkOut: '2026-09-18', amount: '\u20B97,000', status: 'Cancelled' },
  { id: 'BK005', guest: 'Vikash Singh', room: 'Nature View Room', checkIn: '2026-09-20', checkOut: '2026-09-22', amount: '\u20B97,000', status: 'Pending' },
];

const statusColors: Record<string, string> = {
  Confirmed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  Pending: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  Cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Dashboard</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Welcome back! Here&apos;s your resort overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white glass-card rounded-xl p-6 border border-stone-200 dark:border-stone-800 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className={`p-2.5 rounded-lg ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">{stat.change}</span>
              </div>
              <p className="text-2xl font-bold text-stone-800 dark:text-stone-100">{stat.value}</p>
              <p className="text-sm text-stone-500 dark:text-stone-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/admin/rooms/new" className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl transition-colors font-medium">
          <Plus className="w-5 h-5" /> Add New Room
        </Link>
        <Link href="/admin/enquiries" className="flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white p-4 rounded-xl transition-colors font-medium">
          <MessageSquare className="w-5 h-5" /> View Enquiries
        </Link>
        <Link href="/admin/gallery" className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-colors font-medium">
          <Camera className="w-5 h-5" /> Upload Photos
        </Link>
      </div>

      <div className="bg-white glass-card rounded-xl border border-stone-200 dark:border-stone-800">
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800 dark:text-stone-100">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-green-600 dark:text-green-400 hover:underline">View All &rarr;</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Booking ID</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Guest</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden md:table-cell">Room</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden lg:table-cell">Check-in</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 hidden lg:table-cell">Check-out</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Amount</th>
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="border-b border-stone-50 dark:border-stone-800/50 hover:bg-stone-50 dark:hover:bg-white/[0.03] transition-colors">
                  <td className="p-4 text-sm font-mono text-stone-600 dark:text-stone-400">{booking.id}</td>
                  <td className="p-4 text-sm font-medium text-stone-800 dark:text-stone-200">{booking.guest}</td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-400 hidden md:table-cell">{booking.room}</td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-400 hidden lg:table-cell">{booking.checkIn}</td>
                  <td className="p-4 text-sm text-stone-600 dark:text-stone-400 hidden lg:table-cell">{booking.checkOut}</td>
                  <td className="p-4 text-sm font-semibold text-stone-800 dark:text-stone-200">{booking.amount}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
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