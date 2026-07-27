import React from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 shrink-0 border-r border-ink-border bg-ink-soft/60 min-h-screen flex flex-col px-6 py-8">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-full border border-gilt/50 flex items-center justify-center font-display text-gilt text-sm">
          DT
        </div>
        <div>
          <div className="font-display text-lg leading-tight">DevTrack</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-parchment-dim">Private Ledger</div>
        </div>
      </div>

      <nav className="space-y-1 flex-1">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gilt/10 text-gilt text-sm font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-gilt" />
          Dashboard
        </div>
      </nav>

      <div className="gilt-rule my-6" />

      <div className="text-sm">
        <div className="text-parchment font-medium">{user?.name}</div>
        <div className="text-parchment-dim text-xs truncate">{user?.email}</div>
        <button
          onClick={logout}
          className="mt-4 text-xs uppercase tracking-[0.15em] text-parchment-dim hover:text-rust-bright transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
