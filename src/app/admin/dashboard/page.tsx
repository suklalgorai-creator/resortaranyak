'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight, BedDouble, CalendarDays, CheckCircle2, Clock3, Mail, MessageSquare } from 'lucide-react';

type DashboardData = {
  stats: { totalBookings: number; requestedBookings: number; confirmedBookings: number; cancelledBookings: number; totalRevenue: number; totalRooms: number; totalEnquiries: number };
  recentBookings: Array<{ id: string; bookingCode: string; guestName: string; status: string; totalAmount: number; createdAt: string; room: { name: string } }>;
  recentEnquiries: Array<{ id: string; name: string; email: string; phone: string | null; message: string; status: string; createdAt: string }>;
};

function statusClass(status: string) {
  if (status === 'CONFIRMED' || status === 'COMPLETED' || status === 'READ') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-300';
  if (status === 'CANCELLED' || status === 'FAILED' || status === 'EXPIRED') return 'bg-red-100 text-red-800 dark:bg-red-400/15 dark:text-red-300';
  return 'bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-300';
}

function statusLabel(status: string) {
  return status.toLowerCase().replaceAll('_', ' ');
}

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

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

  if (error) return <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-400/10 dark:text-red-300">{error}</p>;
  if (!data) return <p className="text-stone-500">Loading dashboard…</p>;

  const cards = [
    { label: 'Pending requests', value: data.stats.requestedBookings, href: '/admin/bookings?status=REQUESTED', icon: Clock3, tone: 'text-amber-700 dark:text-amber-300' },
    { label: 'Confirmed stays', value: data.stats.confirmedBookings, href: '/admin/bookings?status=CONFIRMED', icon: CheckCircle2, tone: 'text-emerald-700 dark:text-emerald-300' },
    { label: 'Total bookings', value: data.stats.totalBookings, href: '/admin/bookings', icon: CalendarDays, tone: 'text-forest dark:text-green-300' },
    { label: 'Rooms', value: data.stats.totalRooms, href: '/admin/rooms', icon: BedDouble, tone: 'text-forest dark:text-green-300' },
    { label: 'Unread enquiries', value: data.stats.totalEnquiries, href: '/admin/enquiries?status=UNREAD', icon: MessageSquare, tone: 'text-gold' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Resort operations</p><h1 className="mt-2 text-2xl font-bold text-stone-800 dark:text-stone-100 lg:text-3xl">Good day, admin</h1><p className="mt-1 text-stone-500">Review requests, respond to guests, and keep stays moving.</p></div><Link href="/admin/bookings?status=REQUESTED" className="inline-flex w-fit items-center gap-2 rounded-xl bg-green-800 px-4 py-3 text-sm font-bold text-white transition hover:bg-green-900">Review pending requests <ArrowRight className="h-4 w-4" /></Link></div>
      {data.stats.requestedBookings > 0 && <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-400/20 dark:bg-amber-400/10 dark:text-amber-200"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" /><div><p className="font-bold">{data.stats.requestedBookings} booking request{data.stats.requestedBookings > 1 ? 's' : ''} need{data.stats.requestedBookings === 1 ? 's' : ''} review.</p><p className="mt-1 text-sm opacity-80">Check availability and contact the guest before confirming.</p></div></div>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{cards.map(({ label, value, href, icon: Icon, tone }) => <Link key={label} href={href} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gold dark:border-white/10 dark:bg-white/[0.04]"><div className="flex items-center justify-between"><p className="text-sm text-stone-500">{label}</p><Icon className={`h-5 w-5 ${tone}`} /></div><p className={`mt-3 text-3xl font-bold ${tone}`}>{value}</p></Link>)}</div>
      <div className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <section className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]"><div className="flex items-center justify-between border-b border-stone-100 p-5 dark:border-white/10"><div><h2 className="font-bold text-stone-800 dark:text-stone-100">Recent booking requests</h2><p className="mt-1 text-sm text-stone-500">Latest activity from your booking form</p></div><Link href="/admin/bookings" className="text-sm font-semibold text-green-800 hover:text-gold dark:text-green-400">View all</Link></div><div className="overflow-x-auto"><table className="w-full"><thead className="bg-stone-50 dark:bg-white/5"><tr className="text-left text-xs uppercase tracking-wider text-stone-500"><th className="p-4">Reference</th><th className="p-4">Guest</th><th className="p-4">Room</th><th className="p-4">Amount</th><th className="p-4">Status</th></tr></thead><tbody>{data.recentBookings.map((booking) => <tr key={booking.id} className="border-t border-stone-100 dark:border-white/10"><td className="p-4 font-mono text-xs"><Link href={`/admin/bookings/${booking.id}`} className="text-green-800 underline-offset-4 hover:underline dark:text-green-400">{booking.bookingCode}</Link><p className="mt-1 font-sans text-xs text-stone-400">{dateLabel(booking.createdAt)}</p></td><td className="p-4 text-sm font-medium text-stone-800 dark:text-stone-100">{booking.guestName}</td><td className="p-4 text-sm text-stone-600 dark:text-stone-300">{booking.room.name}</td><td className="p-4 text-sm font-semibold text-gold">Rs. {booking.totalAmount.toLocaleString()}</td><td className="p-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold capitalize ${statusClass(booking.status)}`}>{statusLabel(booking.status)}</span></td></tr>)}</tbody></table>{data.recentBookings.length === 0 && <p className="p-8 text-center text-sm text-stone-500">No bookings yet.</p>}</div></section>
        <section className="rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.04]"><div className="flex items-center justify-between border-b border-stone-100 p-5 dark:border-white/10"><div><h2 className="font-bold text-stone-800 dark:text-stone-100">Recent enquiries</h2><p className="mt-1 text-sm text-stone-500">Latest guest messages</p></div><Link href="/admin/enquiries" className="text-sm font-semibold text-green-800 hover:text-gold dark:text-green-400">View all</Link></div><div className="space-y-4 p-5">{data.recentEnquiries.map((enquiry) => <article key={enquiry.id} className="border-b border-stone-100 pb-4 last:border-0 last:pb-0 dark:border-white/10"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold text-stone-800 dark:text-stone-100">{enquiry.name}</p><p className="mt-1 text-xs text-stone-500">{dateLabel(enquiry.createdAt)} · {enquiry.email}</p></div><span className={`rounded-full px-2 py-1 text-[10px] font-bold capitalize ${statusClass(enquiry.status)}`}>{statusLabel(enquiry.status)}</span></div><p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600 dark:text-stone-300">{enquiry.message}</p></article>)}{data.recentEnquiries.length === 0 && <p className="py-4 text-center text-sm text-stone-500">No enquiries yet.</p>}</div></section>
      </div>
      <div className="grid gap-4 sm:grid-cols-3"><a href="mailto:smnt.mukherjee@gmail.com" className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-700 transition hover:border-gold hover:text-gold dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200"><Mail className="h-5 w-5 text-gold" /> Open resort email</a><Link href="/admin/enquiries?status=UNREAD" className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-700 transition hover:border-gold hover:text-gold dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200"><MessageSquare className="h-5 w-5 text-gold" /> Check unread enquiries</Link><Link href="/admin/rooms" className="flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-4 text-sm font-semibold text-stone-700 transition hover:border-gold hover:text-gold dark:border-white/10 dark:bg-white/[0.04] dark:text-stone-200"><BedDouble className="h-5 w-5 text-gold" /> Manage room inventory</Link></div>
    </div>
  );
}
