'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-[#111] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="font-serif text-3xl font-bold text-green-800 dark:text-green-400">Resort Arranyak</h1>
          </Link>
          <p className="text-stone-500 dark:text-stone-400 mt-2">Admin Login</p>
        </div>

        <div className="bg-white glass-card rounded-2xl border border-stone-200 dark:border-white/5 p-8 shadow-lg">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@arranyak.com"
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg border border-stone-300 dark:border-white/10 bg-white dark:bg-white/5 text-stone-800 dark:text-stone-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-stone-400"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors shadow-sm"
            >
              Sign In
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-stone-500 dark:text-stone-400 mt-6">
          <Link href="/" className="hover:text-green-600 dark:hover:text-green-400 transition-colors">? Back to Website</Link>
        </p>
      </div>
    </div>
  );
}
