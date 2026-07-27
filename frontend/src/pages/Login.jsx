import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not sign in. Check your details and try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 rounded-full border border-gilt/50 flex items-center justify-center font-display text-gilt text-lg mb-4">
            DT
          </div>
          <h1 className="font-display text-3xl text-parchment tracking-wide">DevTrack</h1>
          <p className="text-parchment-dim text-sm mt-1 tracking-wide">Your private ledger</p>
        </div>

        <div className="bg-ink-card border border-ink-border rounded-2xl shadow-card p-8">
          <h2 className="font-display text-xl mb-6">Sign in</h2>

          {error && (
            <div className="mb-4 text-sm text-rust-bright bg-rust/10 border border-rust/30 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment placeholder-parchment-dim/50 focus:border-gilt/60 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-[0.15em] text-parchment-dim mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-ink border border-ink-border rounded-lg px-4 py-3 text-parchment placeholder-parchment-dim/50 focus:border-gilt/60 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-gilt hover:bg-gilt-bright text-ink font-semibold rounded-lg py-3 mt-2 transition-colors disabled:opacity-60"
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-parchment-dim mt-6">
          New to DevTrack?{' '}
          <Link to="/register" className="text-gilt hover:text-gilt-bright">
            Open an account
          </Link>
        </p>
      </div>
    </div>
  );
}
