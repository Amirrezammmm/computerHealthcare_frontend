'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Search, X, Loader2, Radar } from 'lucide-react';
import type { Computer } from './ComputerCard';

const API = 'http://127.0.0.1:8000/api/computers';

type FormData = Omit<Computer, 'id'>;

const emptyForm: FormData = {
  property_code: '',
  item_title: 'رایانه',
  user_name: '',
  label_code: '',
  primary_seal_code: '',
  secondary_seal_code: '',
  last_service_date: '',
  next_service_date: '',
  health_status: 'healthy',
  description: '',
};

const statusConfig = {
  healthy:  { label: 'عملیاتی و پایدار', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  warning:  { label: 'نیازمند سرویس',    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  critical: { label: 'بحرانی',           badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
};

async function api(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    ...options,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errorMap = json.errors as Record<string, string[]> | undefined;
    const firstError = errorMap ? Object.values(errorMap)[0]?.[0] : null;
    throw new Error(firstError || json.message || 'ارتباط با ستاد فرماندهی برقرار نشد!');
  }


  return json;
}

function Field({ label, ...inputProps }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs text-slate-400">{label}</span>
      <input
        {...inputProps}
        className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 placeholder-slate-600 transition-colors focus:border-cyan-500 focus:outline-none"
      />
    </label>
  );
}

export default function AdminPanel() {
  const [computers, setComputers] = useState<Computer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Computer | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const load = async (term = search) => {
    setLoading(true);
    try {
      const data = await api(`?search=${encodeURIComponent(term)}`);
      setComputers(data);
    } catch (err: any) {
      setToast(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (key: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const startCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const startEdit = (c: Computer) => {
    setEditing(c);
    setForm({ ...emptyForm, ...c });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = JSON.stringify(form);
      const res = editing
        ? await api(`/${editing.id}`, { method: 'PUT', body })
        : await api('', { method: 'POST', body });

      setToast(res.message);
      setShowForm(false);
      setEditing(null);
      await load();
    } catch (err: any) {
      setToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Computer) => {
    if (!confirm(`آیا کد اموال «${c.property_code}» برای همیشه از سامانه حذف شود؟ 🪦`)) return;
    try {
      const res = await api(`/${c.id}`, { method: 'DELETE' });
      setToast(res.message);
      await load();
    } catch (err: any) {
      setToast(err.message);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-950 p-6 text-slate-100">
      {/* هدر ستاد فرماندهی */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-2.5">
            <Radar className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold">پنل فرماندهی سامانه القارعه</h1>
            <p className="text-xs text-slate-400">{computers.length} فروند در رادار 🎯</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <form onSubmit={(e) => { e.preventDefault(); load(); }} className="relative">
            <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="جستجو: کد اموال، کاربر، پلمپ..."
              className="w-64 rounded-lg border border-slate-700 bg-slate-900 py-2 pl-3 pr-9 text-sm focus:border-cyan-500 focus:outline-none"
            />
          </form>
          <button
            onClick={startCreate}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-bold transition-colors hover:bg-cyan-500"
          >
            <Plus className="h-4 w-4" /> ثبت سیستم جدید
          </button>
        </div>
      </div>

      {/* جدول رادار */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="w-full min-w-[950px] text-sm">
          <thead className="bg-slate-900/80 text-xs text-slate-400">
            <tr>
              <th className="p-3 text-right">کد اموال</th>
              <th className="p-3 text-right">عنوان</th>
              <th className="p-3 text-right">کاربر</th>
              <th className="p-3 text-right">القارعه</th>
              <th className="p-3 text-right">پلمپ‌ها</th>
              <th className="p-3 text-right">سرویس آتی</th>
              <th className="p-3 text-right">وضعیت</th>
              <th className="p-3 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-500">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                </td>
              </tr>
            )}
            {!loading && computers.map((c) => (
              <tr key={c.id} className="border-t border-slate-800 transition-colors hover:bg-slate-800/40">
                <td className="p-3 font-mono font-bold text-cyan-300">#{c.property_code}</td>
                <td className="p-3">{c.item_title || '---'}</td>
                <td className="p-3">{c.user_name || '---'}</td>
                <td className="p-3 font-mono">{c.label_code || '---'}</td>
                <td className="p-3 font-mono text-xs">
                  {[c.primary_seal_code, c.secondary_seal_code].filter(Boolean).join(' | ') || 'فاقد پلمپ'}
                </td>
                <td className="p-3">{c.next_service_date || 'نامشخص'}</td>
                <td className="p-3">
                  <span className={`rounded-full border px-2 py-0.5 text-xs ${statusConfig[c.health_status].badge}`}>
                    {statusConfig[c.health_status].label}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => startEdit(c)}
                      className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-2 text-amber-400 transition-colors hover:bg-amber-500/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-2 text-rose-400 transition-colors hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && computers.length === 0 && (
              <tr>
                <td colSpan={8} className="p-10 text-center text-slate-500">
                  هیچ هدفی در رادار نیست! اولین سیستم رو ثبت کن 🚀
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* مودال ثبت / ویرایش */}
      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <form
            onSubmit={handleSave}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="flex items-center gap-2 text-lg font-bold">
                {editing ? <Pencil className="h-5 w-5 text-amber-400" /> : <Plus className="h-5 w-5 text-cyan-400" />}
                {editing ? `ویرایش ${editing.property_code}` : 'ثبت سیستم جدید'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="کد اموال *" required value={form.property_code} onChange={set('property_code')} placeholder="مثل 502-06-005169" dir="ltr" />
              <Field label="عنوان کالا" value={form.item_title ?? ''} onChange={set('item_title')} />
              <Field label="کاربر" value={form.user_name ?? ''} onChange={set('user_name')} placeholder="مثل محمد احمدی" />
              <Field label="شماره القارعه" value={form.label_code ?? ''} onChange={set('label_code')} placeholder="مثل 11652" dir="ltr" />
              <Field label="پلمپ ۱ (اصلی)" value={form.primary_seal_code ?? ''} onChange={set('primary_seal_code')} dir="ltr" />
              <Field label="پلمپ ۲ (امنیتی)" value={form.secondary_seal_code ?? ''} onChange={set('secondary_seal_code')} dir="ltr" />
              <Field label="تاریخ سرویس اولیه" value={form.last_service_date ?? ''} onChange={set('last_service_date')} placeholder="1403/01/17" dir="ltr" />
              <Field label="تاریخ سرویس آتی" value={form.next_service_date ?? ''} onChange={set('next_service_date')} placeholder="1403/06/18" dir="ltr" />
              <label className="block">
                <span className="mb-1 block text-xs text-slate-400">وضعیت سلامت *</span>
                <select
                  value={form.health_status}
                  onChange={set('health_status')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="healthy">عملیاتی و پایدار</option>
                  <option value="warning">نیازمند سرویس</option>
                  <option value="critical">وضعیت بحرانی</option>
                </select>
              </label>
              <Field label="توضیحات" value={form.description ?? ''} onChange={set('description')} />
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
                انصراف
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-cyan-600 px-5 py-2 text-sm font-bold transition-colors hover:bg-cyan-500 disabled:opacity-50"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {editing ? 'ذخیره تغییرات' : 'ثبت در سامانه'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* توست پیام‌ها */}
      {toast && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-cyan-500/40 bg-slate-900 px-5 py-3 text-sm text-slate-100 shadow-2xl">
          {toast}
        </div>
      )}
    </div>
  );
}
