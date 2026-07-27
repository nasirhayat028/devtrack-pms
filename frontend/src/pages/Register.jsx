import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', monthlyBudget: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form.name, form.email, form.password, Number(form.monthlyBudget) || 0);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create your account. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-full border border-gilt/50 flex items-center justify-center font-display text-gilt text-lg mb-4">
            DT
          </div>
          <h1 className="font-display text-3xl text-parchment tracking-wide">DevTrack</h1>
          <p className="text-parchment-dim text-sm mt-1 tracking-wide">Open your private ledger</p>
        </div>

        <div className="bg-ink-card border border-ink-border rounded-2xl shadow-card p-8">
          <h2 className="font-display text-xl mb-6">Create account</h2>

          {error && (
            <div className="mb-4 text-sm text-rust-bright bg-rust/10 border border-rust/30 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">Name</label>
              <input
                required
                value={form.name}
                onChange={update('name')}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment placeholder-parchment-dim/50 focus:border-gilt/60 transition-colors"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={update('email')}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment placeholder-parchment-dim/50 focus:border-gilt/60 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={form.password}
                onChange={update('password')}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment placeholder-parchment-dim/50 focus:border-gilt/60 transition-colors"
                placeholder="At least 6 characters"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">
                Monthly budget (optional)
              </label>
              <input
                type="number"
                value={form.monthlyBudget}
                onChange={update('monthlyBudget')}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment placeholder-parchment-dim/50 focus:border-gilt/60 transition-colors"
                placeholder="e.g. 2000"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gilt hover:bg-gilt-bright text-ink font-semibold rounded-lg py-3 mt-2 transition-colors disabled:opacity-60"
            >
              {busy ? 'Creating account…' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-parchment-dim mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gilt hover:text-gilt-bright">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
