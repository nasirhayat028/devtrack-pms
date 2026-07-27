import React from 'react';

const fmt = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 2 }).format(n || 0);

export default function BalanceHero({ balance, income, expense, budget, currency }) {
  const budgetUsedPct = budget > 0 ? Math.min(100, Math.round((expense / budget) * 100)) : null;

  return (
    <div className="bg-ink-card border border-ink-border rounded-2xl shadow-card p-8 md:p-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-parchment-dim mb-3">
            Statement balance — this month
          </div>
          <div className="font-display text-5xl md:text-6xl font-medium tracking-tight text-parchment">
            {fmt(balance, currency)}
          </div>
        </div>

        <div className="flex gap-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-emerald-bright mb-1">Income</div>
            <div className="font-mono text-lg text-parchment">{fmt(income, currency)}</div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-rust-bright mb-1">Expense</div>
            <div className="font-mono text-lg text-parchment">{fmt(expense, currency)}</div>
          </div>
        </div>
      </div>

      {budgetUsedPct !== null && (
        <div className="mt-8">
          <div className="flex justify-between text-xs text-parchment-dim mb-2">
            <span className="uppercase tracking-[0.15em]">Budget used</span>
            <span className="font-mono">{budgetUsedPct}% of {fmt(budget, currency)}</span>
          </div>
          <div className="h-1.5 rounded-full bg-ink-border overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                budgetUsedPct >= 90 ? 'bg-rust' : 'bg-gilt'
              }`}
              style={{ width: `${budgetUsedPct}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
