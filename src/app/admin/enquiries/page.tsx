'use client';

import { useState } from 'react';
import { Mail, Phone, CalendarDays } from 'lucide-react';

const initialEnquiries = [
  { id: 1, name: 'Raju Mishra', email: 'raju@gmail.com', phone: '+91-9988776655', message: 'Hi, I want to know about group booking for 20 people in November.', date: '2026-09-01', isRead: false },
  { id: 2, name: 'Anita Sinha', email: 'anita@gmail.com', phone: '+91-8877665544', message: 'Do you have any special Diwali packages? We are a family of 4.', date: '2026-09-02', isRead: false },
  { id: 3, name: 'Deepak Ghosh', email: 'deepak@gmail.com', phone: '+91-7766554433', message: 'Is swimming pool available in September? Also, do you serve Bengali food?', date: '2026-09-03', isRead: true },
  { id: 4, name: 'Kavita Roy', email: 'kavita@gmail.com', phone: '+91-6655443322', message: 'I need a wheelchair accessible room. Do you have ground floor options?', date: '2026-09-04', isRead: true },
];

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState(initialEnquiries);

  const markAsRead = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, isRead: true } : item));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Enquiries</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">Contact form submissions ({items.filter(i => !i.isRead).length} unread)</p>
      </div>

      <div className="space-y-4">
        {items.map((enq) => (
          <div key={enq.id} className={`bg-white dark:bg-white/5 glass-card rounded-xl border p-6 transition-all ${
            enq.isRead
              ? 'border-stone-200 dark:border-white/5'
              : 'border-gold/40 dark:border-gold/20 ring-1 ring-gold/10'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100">{enq.name}</h3>
                  {!enq.isRead && (
                    <span className="text-[10px] uppercase font-bold tracking-wider bg-gold text-stone-900 px-2 py-0.5 rounded-full">New</span>
                  )}
                </div>
                <p className="text-stone-700 dark:text-stone-300 mb-4">{enq.message}</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500 dark:text-stone-400">
                  <span className="flex items-center gap-1.5"><Mail className="w-4 h-4" /> {enq.email}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {enq.phone}</span>
                  <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4" /> {enq.date}</span>
                </div>
              </div>
              <div className="flex sm:flex-col items-center gap-2 shrink-0">
                {!enq.isRead && (
                  <button
                    onClick={() => markAsRead(enq.id)}
                    className="text-xs px-4 py-2 rounded-lg border border-stone-300 dark:border-stone-600 hover:bg-stone-50 dark:hover:bg-white/5 text-stone-600 dark:text-stone-300 transition-colors font-medium w-full"
                  >
                    Mark as Read
                  </button>
                )}
                <a
                  href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  className="text-xs px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium text-center w-full"
                >
                  Reply on WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}