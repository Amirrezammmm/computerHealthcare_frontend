'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function AdminButton() {
  return (
    <Link
      href="/admin"
      className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl border border-cyan-500/40 bg-slate-900/80 px-4 py-2 text-sm font-semibold text-cyan-300 backdrop-blur-md transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-950/50 hover:text-cyan-200 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] active:scale-95"
    >
      {/* هاله نور پس‌زمینه هنگام Hover */}
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />

      {/* آیکون امنیتی با انیمیشن پالس */}
      <div className="relative flex items-center justify-center">
        <ShieldAlert className="h-4 w-4 text-cyan-400 transition-transform duration-300 group-hover:scale-110" />
        <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 animate-ping rounded-full bg-cyan-400 opacity-75" />
      </div>

      <span>ورود به مقر فرماندهی</span>

      {/* فلش جهت‌نما */}
      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
    </Link>
  );
}
