'use client';

import { useState, useEffect } from 'react';
import ComputerCard, { Computer } from '@/components/ComputerCard';
import { Search, ShieldAlert, RefreshCw } from 'lucide-react';

export default function Dashboard() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchComputers = async (query = '') => {
    setLoading(true);
    try {
      // آدرس API لاراول (پورت 8000 به صورت پیش‌فرض)
      const res = await fetch(`http://localhost:8000/api/computers?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      setComputers(data.data || []);
    } catch (err) {
      console.error('اتصال به مرکز فرماندهی القارعه قطع شد:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchComputers(search);
    }, 400); // به سبک بریکرِ حرفه‌ای، Debounce می‌زنیم تا سرور لاراول التماس نکنه!

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3 text-red-500">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
            سامانه مانیتورینگ سلامت القارعه
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            سیستم کنترل و ردیابی وضعیت فیزیکی و نرم‌افزاری کیس‌های تحت شبکه
          </p>
        </div>

        {/* جعبه جستجوی کد اموال */}
        <div className="relative w-full md:w-96">
          <Search className="absolute right-3.5 top-3 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="جستجوی کد اموال یا برچسب..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-11 pl-4 py-2.5 text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-slate-500"
          />
        </div>
      </header>

      {/* شبکه نمایش سیستم‌ها */}
      <section className="max-w-7xl mx-auto mt-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <RefreshCw className="w-8 h-8 animate-spin text-red-500" />
          </div>
        ) : computers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {computers.map((comp) => (
              <ComputerCard key={comp.id} computer={comp} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            هیچ کیسی با مشخصات وارد شده در زاغه مهمات پیدا نشد!
          </div>
        )}
      </section>
    </main>
  );
}
