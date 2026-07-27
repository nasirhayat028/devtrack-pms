import React, { useState } from 'react';

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Entertainment', 'Salary', 'Other'];

export default function AddTransactionModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Other',
    date: new Date().toISOString().slice(0, 10),
    note: '',
  });
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-ink-card border border-ink-border rounded-2xl shadow-card p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-xl mb-6">New entry</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {['expense', 'income'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm({ ...form, type: t, category: t === 'income' ? 'Salary' : 'Other' })}
                className={`flex-1 py-2 rounded-lg text-sm capitalize border transition-colors ${
                  form.type === t
                    ? t === 'income'
                      ? 'bg-emerald/15 border-emerald text-emerald-bright'
                      : 'bg-rust/15 border-rust text-rust-bright'
                    : 'border-ink-border text-parchment-dim'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">Title</label>
            <input
              required
              value={form.title}
              onChange={update('title')}
              className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment focus:border-gilt/60 transition-colors"
              placeholder="e.g. Grocery run"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                required
                value={form.amount}
                onChange={update('amount')}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment focus:border-gilt/60 transition-colors"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">Date</label>
              <input
                type="date"
                required
                value={form.date}
                onChange={update('date')}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment focus:border-gilt/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">Category</label>
            <select
              value={form.category}
              onChange={update('category')}
              className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment focus:border-gilt/60 transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-lg border border-ink-border text-parchment-dim hover:text-parchment transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={busy}
              className="flex-1 py-3 rounded-lg bg-gilt hover:bg-gilt-bright text-ink font-semibold transition-colors disabled:opacity-60"
            >
              {busy ? 'Saving…' : 'Save entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
