import React, { useEffect, useState, useCallback } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext.jsx';
import Sidebar from '../components/Sidebar.jsx';
import BalanceHero from '../components/BalanceHero.jsx';
import CategoryBreakdown from '../components/CategoryBreakdown.jsx';
import TransactionLedger from '../components/TransactionLedger.jsx';
import AddTransactionModal from '../components/AddTransactionModal.jsx';

const currentMonth = () => new Date().toISOString().slice(0, 7);

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, byCategory: {} });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const month = currentMonth();

  const load = useCallback(async () => {
    setLoading(true);
    const [expRes, sumRes] = await Promise.all([
      client.get('/expenses', { params: { month } }),
      client.get(`/expenses/summary/${month}`),
    ]);
    setExpenses(expRes.data.expenses);
    setSummary(sumRes.data);
    setLoading(false);
  }, [month]);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (payload) => {
    await client.post('/expenses', payload);
    await load();
  };

  const handleDelete = async (id) => {
    await client.delete(`/expenses/${id}`);
    await load();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <main className="flex-1 px-8 md:px-12 py-10 max-w-6xl">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-2xl">
              Good day, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-parchment-dim text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-gilt hover:bg-gilt-bright text-ink font-semibold rounded-lg px-5 py-3 text-sm transition-colors"
          >
            + New entry
          </button>
        </div>

        {loading ? (
          <div className="text-parchment-dim text-sm">Loading your ledger…</div>
        ) : (
          <div className="space-y-6">
            <BalanceHero
              balance={summary.balance}
              income={summary.totalIncome}
              expense={summary.totalExpense}
              budget={user?.monthlyBudget}
              currency={user?.currency}
            />

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3">
                <TransactionLedger items={expenses} currency={user?.currency} onDelete={handleDelete} />
              </div>
              <div className="lg:col-span-2">
                <CategoryBreakdown byCategory={summary.byCategory} currency={user?.currency} />
              </div>
            </div>
          </div>
        )}
      </main>

      {modalOpen && (
        <AddTransactionModal onClose={() => setModalOpen(false)} onSubmit={handleAdd} />
      )}
    </div>
  );
}
