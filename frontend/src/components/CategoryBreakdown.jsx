import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#C9A227', '#2FA57D', '#B3543A', '#5B7CA8', '#8A6FB3', '#9AA0A6', '#D06E4F', '#6E9C86'];

const fmt = (n, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n || 0);

export default function CategoryBreakdown({ byCategory, currency }) {
  const data = Object.entries(byCategory || {}).map(([name, value]) => ({ name, value }));
  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-ink-card border border-ink-border rounded-2xl shadow-card p-8 h-full flex flex-col">
        <h3 className="font-display text-lg mb-1">By category</h3>
        <p className="text-xs text-parchment-dim uppercase tracking-[0.15em] mb-6">This month</p>
        <div className="flex-1 flex items-center justify-center text-parchment-dim text-sm text-center px-6">
          No spending recorded yet. Add a transaction to see the breakdown here.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-ink-card border border-ink-border rounded-2xl shadow-card p-8">
      <h3 className="font-display text-lg mb-1">By category</h3>
      <p className="text-xs text-parchment-dim uppercase tracking-[0.15em] mb-4">This month</p>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={2}
              stroke="none"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#171A1F', border: '1px solid #262B33', borderRadius: 8 }}
              formatter={(value) => fmt(value, currency)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data
          .sort((a, b) => b.value - a.value)
          .map((d, i) => (
            <div key={d.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                <span className="text-parchment-dim">{d.name}</span>
              </div>
              <div className="font-mono text-parchment">
                {fmt(d.value, currency)}{' '}
                <span className="text-parchment-dim text-xs">
                  ({total > 0 ? Math.round((d.value / total) * 100) : 0}%)
                </span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
