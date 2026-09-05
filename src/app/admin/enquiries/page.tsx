'use client';

import { useState } from 'react';

const enquiries = [
  { id: 1, name: 'Raju Mishra', email: 'raju@gmail.com', phone: '+91-9988776655', message: 'Hi, I want to know about group booking for 20 people for a corporate retreat in October. What packages do you offer?', date: '2026-09-04', isRead: false },
  { id: 2, name: 'Anita Sinha', email: 'anita@gmail.com', phone: '+91-8877665544', message: 'Do you have any special Diwali packages? We are a family of 8 looking to celebrate at your resort.', date: '2026-09-03', isRead: false },
  { id: 3, name: 'Deepak Ghosh', email: 'deepak@gmail.com', phone: '+91-7766554433', message: 'Is swimming pool available in September? Also do you arrange bonfire in the evening?', date: '2026-09-02', isRead: true },
  { id: 4, name: 'Kavita Roy', email: 'kavita@gmail.com', phone: '+91-6655443322', message: 'Can we bring our pet dog? We are planning a 3-day stay next weekend.', date: '2026-09-01', isRead: true },
];

export default function AdminEnquiriesPage() {
  const [items, setItems] = useState(enquiries);

  const markRead = (id: number) => {
    setItems(items.map(e => e.id === id ? { ...e, isRead: true } : e));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-stone-800 dark:text-stone-100">Enquiries</h1>
        <p className="text-stone-500 dark:text-stone-400 mt-1">
          Contact form submissions ({items.filter(e => !e.isRead).length} unread)
        </p>
      </div>

      <div className="space-y-4">
        {items.map((enq) => (
          <div key={enq.id} className={`bg-white glass-card rounded-xl border p-6 transition-all ${
            enq.isRead
              ? 'border-stone-200 dark:border-white/5'
              : 'border-gold/40 dark:border-gold/20 ring-1 ring-gold/10'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-stone-800 dark:text-stone-200">{enq.name}</h3>
                  {!enq.isRead && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gold text-white uppercase">New</span>
                  )}
                </div>
                <p className="text-sm text-stone-600 dark:text-stone-400 mb-3 leading-relaxed">{enq.message}</p>
                <div className="flex flex-wrap gap-4 text-xs text-stone-500 dark:text-stone-400">
                  <span>?? {enq.email}</span>
                  <span>?? {enq.phone}</span>
                  <span>?? {enq.date}</span>
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                {!enq.isRead && (
                  <button
                    onClick={() => markRead(enq.id)}
                    className="text-xs px-4 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors font-medium"
                  >
                    Mark Read
                  </button>
                )}
                <a
                  href={https://wa.me/{enq.phone.replace(/[^0-9]/g, '')}}
                  target="_blank"
                  className="text-xs px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors font-medium"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
