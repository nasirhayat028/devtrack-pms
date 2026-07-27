import React from 'react';

const fmt = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export default function TransactionLedger({ items, currency, onDelete }) {
  return (
    <div className="bg-ink-card border border-ink-border rounded-2xl shadow-card p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-display text-lg mb-1">Ledger</h3>
          <p className="text-xs text-parchment-dim uppercase tracking-[0.15em]">Recent transactions</p>
        </div>
        <span className="text-xs text-parchment-dim font-mono">{items.length} entries</span>
      </div>

      {items.length === 0 ? (
        <div className="text-parchment-dim text-sm text-center py-12">
          Nothing recorded yet. Your first entry will appear here.
        </div>
      ) : (
        <div className="divide-y divide-ink-border">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between py-4 group">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-9 h-9 rounded-full bg-ink flex items-center justify-center border border-ink-border shrink-0">
                  <span
                    className={`text-xs font-mono ${
                      item.type === 'income' ? 'text-emerald-bright' : 'text-rust-bright'
                    }`}
                  >
                    {item.type === 'income' ? '+' : '−'}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-parchment truncate">{item.title}</div>
                  <div className="text-xs text-parchment-dim">
                    {item.category} · {fmtDate(item.date)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span
                  className={`font-mono text-sm ${
                    item.type === 'income' ? 'text-emerald-bright' : 'text-parchment'
                  }`}
                >
                  {item.type === 'income' ? '+' : '-'}
                  {fmt(item.amount, currency)}
                </span>
                <button
                  onClick={() => onDelete(item._id)}
                  className="opacity-0 group-hover:opacity-100 text-xs text-parchment-dim hover:text-rust-bright transition-all"
                  aria-label={`Delete ${item.title}`}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
