'use client';

import React from 'react';
import { ShieldCheck, AlertTriangle, Flame, Calendar, Tag, Lock } from 'lucide-react';

export interface Computer {
  id: number;
  property_code: string;
  item_title?: string | null;
  user_name?: string | null;
  primary_seal_code: string | null;
  secondary_seal_code: string | null;
  label_code: string | null;
  last_service_date: string | null;
  next_service_date: string | null;
  health_status: 'healthy' | 'warning' | 'critical';
  description: string | null;
}


const statusConfig = {
  healthy: {
    bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: ShieldCheck,
    label: 'عملیاتی و پایدار',
  },
  warning: {
    bg: 'bg-amber-950/40 border-amber-500/40 text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: AlertTriangle,
    label: 'نیازمند سرویس',
  },
  critical: {
    bg: 'bg-rose-950/40 border-rose-500/40 text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
    icon: Flame,
    label: 'وضعیت بحرانی (خطر انفجار!)',
  },
};

export default function ComputerCard({ computer }: { computer: Computer }) {
  const config = statusConfig[computer.health_status];
  const Icon = config.icon;

  return (
    <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 hover:scale-[1.02] shadow-lg ${config.bg}`}>
      {/* هدر کارت: کد اموال و وضعیت سلامت */}
      <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xl font-bold tracking-wider text-slate-100">
            #{computer.property_code}
          </span>
        </div>
        <span className={`px-2.5 py-1 text-xs rounded-full border flex items-center gap-1.5 font-medium ${config.badge}`}>
          <Icon className="w-4 h-4" />
          {config.label}
        </span>
      </div>

      {/* اطلاعات کلیدی و ردیف پلمپ‌ها */}
      <div className="space-y-2.5 text-sm text-slate-300">
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5" /> برچسب القارعه:
          </span>
          <span className="font-mono font-medium text-slate-200">
            {computer.label_code || '---'}
          </span>
        </div>

        {/* پلمپ اولیه */}
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-cyan-400" /> پلمپ ۱ (اصلی):
          </span>
          <span className="font-mono text-slate-200 bg-black/25 px-2 py-0.5 rounded border border-white/5">
            {computer.primary_seal_code || 'فاقد پلمپ'}
          </span>
        </div>

        {/* پلمپ ثانویه */}
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-indigo-400" /> پلمپ ۲ (امنیتی):
          </span>
          <span className="font-mono text-slate-200 bg-black/25 px-2 py-0.5 rounded border border-white/5">
            {computer.secondary_seal_code || 'فاقد پلمپ'}
          </span>
        </div>

        {/* سرویس بعدی */}
        <div className="flex justify-between items-center py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> سرویس بعدی:
          </span>
          <span className="font-medium text-slate-200">
            {computer.next_service_date || 'نامشخص'}
          </span>
        </div>
      </div>

      {/* توضیحات تکمیلی */}
      {computer.description && (
        <div className="mt-4 pt-3 border-t border-white/5 text-xs text-slate-400 line-clamp-2">
          {computer.description}
        </div>
      )}
    </div>
  );
}
